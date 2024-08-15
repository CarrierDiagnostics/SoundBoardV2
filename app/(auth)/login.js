import { TextInput, Text, View, Button, Image, ScrollView, ImageBackground } from "react-native";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import { AuthStore } from "../../store.js";
import { Stack, useRouter } from "expo-router";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import React, { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import DateObject from "react-date-object";
import styles from "../../style.js";
import * as FileSystem from 'expo-file-system';
import _ from "lodash";

export default function LogIn() {
  var today = new DateObject().format("YYYY-MM-DD");
  const router = useRouter();
  const sblogo = require('../assets/SoundBoardLogo.png');
  const BG = require("../assets/BG.jpg");
  const {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [messageUser, setUserMessage] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [tempToken, setTempToken] = React.useState(null);
  const the_data = AuthStore.getRawState();
  const [checkedTempToken, setCheck] = React.useState(false);
  const emotionColours = {'neutral':{"colour": "#808080", "val":{"speechEmotion":1, "textEmotion":1}}, 
    'calm': {"colour": "#75945b", "colourRGB":[117,148,91], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'happy': {"colour": "#fff761", "colourRGB":[255,247,97],"val":{"speechEmotion":1, "textEmotion":1}}, 
    'sad' : {"colour": "#6e79ff", "colourRGB":[110,121,255],"val":{"speechEmotion":1, "textEmotion":1}}, 
    'angry' : {"colour": "#ff4313","colourRGB":[255,67,19], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'fear' : {"colour": "#ff8c2d","colourRGB":[255,140,45], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'disgust' : {"colour": "#e564df","colourRGB":[229,100,223], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'surprise' : {"colour": "#24c9ff","colourRGB":[36,201,255], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'love' : {"colour": "#f3cec9","colourRGB":[243,206,201], "val":{"speechEmotion":1, "textEmotion":1}}};
   
  const { isLoggedIn,userData} = AuthStore.useState((s) => s);
  React.useEffect(() => {
    if(lastMessage){
      let e = JSON.parse(lastMessage.data);
      setUserMessage(e.result);
      if (e.result == "build webage"){
        save("tempToken", e["tempToken"]);
        let com = setEmotionData(cleanUserData(e.data));
        AuthStore.update((s) => {
          s.isLoggedIn = true;
          s.userData = e.data;
          s.sendMessage = sendMessage;
          s.lastMessage = lastMessage;
          s.readyState = readyState;
          s.messages = com[0];
          s.markedDates = com[1];
          s.tempToken = e["tempToken"];
          s.language = e["language"];
        });
        
        setOrganiseData(e.data)
        let raw = addCat(e.data);
        writeJSON(raw, "raw");
        writeJSON({"messages":com[0]}, "messages");
        writeJSON({"markedDates":com[1]}, "markedDates");
        router.replace("/(tabs)/Talk");
      }
    }
  },[lastMessage]);
  function addCat(raw){
    let temp=_.cloneDeep(raw);
    for (let [k,v] of Object.entries(raw.data)){
      
      if (!("category" in v)) {
        temp.data[k]["category"]= null;
      }else{temp.data[k] = v;} 
    }
 
    return temp;
  }
  async function writeJSON(exportData, fN){
    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + fN + "Data.json",
      JSON.stringify(exportData)
    )
  }
  async function setOrganiseData(userData){
    let catData = userData.data;
    let count = 0;
    let temp = [];
    let aTemp = {};
    for (let [k,v] of Object.entries(catData)) {
      if (v.hasOwnProperty("category") && v["category"]) {
        //console.log("still in login",v);
        aTemp[k] = v;
        continue
      }
      if (v.textBox.replace(/<br>/g,"")== "sorry I didn't catch that") continue
      temp.push({id:k, title:v.textBox.replace(/<br>/g,""), index:count, data:v}) //storing data twice, not very efficient
      count++;
    }
    AuthStore.update(s => {s.oraganiseData = temp});  
    AuthStore.update(s=> {s.analysedData = aTemp});
  }

  function setEmotionData(userData){
    console.log("setEMotioNData should only be calledo nce", userData);
    let tmarkedDates = {};  //Currently using textEmotion for emotion data, to change to prosody when ready. Also just using highest number to determine rants emotion and then median for days emotion
    let tDialogData = []; // for textBox and llmresponse
    let tSubsection = {title:null};
    let tempTextBox = []
    let msg = {}
    let tID = 0;
    for (let [k,v] of Object.entries(userData)){
          k = k.split("@")[0];
          let tHighEmtion = 0;
          let tHighNum = 0;
  
          if (tSubsection['title']!= k){
            if(tSubsection['title']){
      
              tDialogData.push(tSubsection)}
            tSubsection = {title:k, data:[]};
          }
          tSubsection['data'].push(v['textBox'].replace(/<br>/g,''));
          tSubsection['data'].push(v['llmresponse']);
          
          tempTextBox.push(MakeMsg(uuidv4(),
              v['textBox'].replace(/<br>/g,''),
              k, 1, "User"));
          
          tempTextBox.push(MakeMsg(uuidv4(),
            v['llmresponse'],
            k, 2, "AI response"));
          for (let [ke, ve] of Object.entries(v["textEmotion"])){
            if (ve > tHighNum){
              tHighEmtion = ke;
              tHighNum = ve;
            }
          //if (tHighEmtion instanceof String) 
          if (emotionColours.hasOwnProperty(tHighEmtion) && emotionColours[tHighEmtion].hasOwnProperty("colour")){
            tmarkedDates[k] = {"selected": true, "selectedColor":emotionColours[tHighEmtion]["colour"]};
          }
    
            
        }
      }

    return([tempTextBox, tmarkedDates]);
  }
  function MakeMsg(tLenght,text,the_date, uID, uName){
    return({
      _id: tLenght,
      text: text,
      createdAt: the_date,
      user: {
        _id: uID,
        name: uName,
        avatar: 'https://placeimg.com/140/140/any',
      }
    })
  }
  function cleanUserData(userData){
    let temp = {}
    for (let [k,v] of Object.entries(userData.data)){
      k = k.split(")")[1].split("_");
      k = k[4]+"-"+k[2]+"-"+k[1]+"@"+k[5]+":"+k[6]+":"+k[7];
      temp[k] = v;
    }
    //temp = JSON.parse(JSON.stringify(temp).replace(/<br>/g,""));
    return(temp);
  }

  function handleclick(email, password){
    console.log("handled click");
    if (email && password){
      let toSend = {"email":email,
                    "password":password,
                    "action":"LogIn"}
      sendMessage(JSON.stringify(toSend));
    }else{
      alert("somethiogn is null");
    }
  }
  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result && !checkedTempToken) {
      setCheck(true);
      setTempToken(result);
      var toSend = new Object();
      toSend.action = "tokenLogin"; 
      toSend.tempToken = result;
      var jsonToSend = JSON.stringify(toSend);
      sendMessage(jsonToSend);
    }else{
      console.log("securestore gave =",result);
    }
  }

  function forgotPassword(){
    var toSend = new Object();
    toSend.action = "forgotPassword"; 
    toSend.email = email;
    var jsonToSend = JSON.stringify(toSend);
    sendMessage(jsonToSend);
    setUserMessage("Please check the email of ",email);
}
  //console.log("check temp = ", checkedTempToken, " and justLoogedout = ", the_data.ju)
  //if(!checkedTempToken && !the_data.justLoggedOut){
  useEffect(() =>{
    setCheck(true);
    console.log("checked temp token is done ",checkedTempToken);
    getValueFor("tempToken");
  },[])
  return (
    <ImageBackground source={BG} style={styles.BGimage}>
    <KeyboardAwareScrollView style={{flex:1}} >
      <View style={styles.container} childStyle={styles.text}>
      
      <Stack.Screen options={{ title: "Login" }} />
      <Image 
              style={{ width:"100%"}} resizeMode="contain"
              source={sblogo}/>
      <TextInput
              onChangeText={email => onChangeEmail(email)}
              placeholder=" email"
              keyboardType="email-address"
              placeholderTextColor="white" 
              style={styles.textinput}
            />
      <TextInput secureTextEntry={true} 
              placeholder=" password"
              placeholderTextColor="white" 
              onChangeText={password =>onChangePassword(password)}
              style={styles.textinput}
               />
      <Button label="LogIn"
      color={styles.container.color}
            style={styles.container} 
            email={email} password={password} 
            onPress ={() => handleclick(email, password)}
            title="LogIn" >
            LogIn
      </Button>
      <Text style={styles.text}>{messageUser}</Text>
      
      <View >
      <Text
          onPress={() => {forgotPassword();}}
          style={styles.text}
        >
        Forgot Password
        </Text>
        <Text
          onPress={() => {router.push("/create-account");}}
          style={styles.text}
        >
        Create Account
        </Text>
      </View>
      
      </View>
    </KeyboardAwareScrollView>
    </ImageBackground>
    
  );
}
