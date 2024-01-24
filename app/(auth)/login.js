import { TextInput, Text, View, Button } from "react-native";
import { AuthStore } from "../../store.js";
import { Stack, useRouter } from "expo-router";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import DateObject from "react-date-object";


export default function LogIn() {
  var today = new DateObject().format("YYYY-MM-DD");
  const sections = ["Physical Environment","Business/Career","Finances","Health","Family and Friends","Romance","Personal Growth","Fun and Recreation"];
  const router = useRouter();
  const {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [messageUser, setUserMessage] = React.useState('');
  const [markedDates, setMarkedDates] = React.useState(today);
  const [messages, setMessages] = React.useState([]);
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
        });
        setOrganiseData(e.data)
        router.replace("/(tabs)/Talk");
      }
    }
  },[lastMessage]);

  async function setOrganiseData(userData){
    console.log("the userdata = ",userData);
    let catData = userData.data
    let temp = [];
    for (let [k,v] of Object.entries(catData)) temp.push({id:k, title:v.textBox.replace(/<bg>/g,"")})
    AuthStore.update(s => {s.oraganiseData = temp});  
  }

  function setEmotionData(userData){
    console.log("setEMotioNData should only be calledo nce");
    let tmarkedDates = {};  //Currently using textEmotion for emotion data, to change to prosody when ready. Also just using highest number to determine rants emotion and then median for days emotion
    let tDialogData = []; // for textBox and llmresponse
    let tSubsection = {title:null};
    let tempTextBox = []
    let msg = {}
    let tID = 0;
    for (let [k,v] of Object.entries(userData)){
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
          tmarkedDates[k] = {"selected": true, "selectedColor":emotionColours[tHighEmtion]["colour"]};
    
            
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
      k = k[4]+"-"+k[2]+"-"+k[1];
      temp[k] = v;
    }
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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} childStyle={{margin: 30}}>
      <Stack.Screen options={{ title: "Login" }} />

      <TextInput
              onChangeText={email => onChangeEmail(email)}
              placeholder=" email"
              keyboardType="email-address"
            />
      <TextInput secureTextEntry={true} 
              placeholder=" password"
              onChangeText={password =>onChangePassword(password)} />
      <Button label="LogIn" 
            email={email} password={password} 
            onPress ={() => handleclick(email, password)}
            title="LogIn" >
            LogIn
      </Button>

      <Text
        onPress={() => {
         
          router.push("/create-account");
        }}
      >
        Create Account
      </Text>
      <Text>{messageUser}</Text>
    </View>
  );
}
