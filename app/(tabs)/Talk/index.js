import { Link, Redirect, Stack } from "expo-router";
import { View, Text, Image, Pressable, ImageBackground,SafeAreaView, Modal} from "react-native";
import { AuthStore } from "../../../store";
import { Audio } from 'expo-av';
import { GiftedChat } from 'react-native-gifted-chat'
import DateObject from "react-date-object";
import * as SecureStore from 'expo-secure-store';
import React from "react";
import * as FileSystem from 'expo-file-system';
import { useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { v4 as uuidv4 } from 'uuid';
import styles from "../../../style";
import _ from "lodash";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";



const Talk = () => {
  var today = new DateObject().format("YYYY-MM-DD");
  const chatRef = useRef();
  const [rData, setRData] = React.useState(null);
  const [seeModal, setSeeModal] = React.useState(false);
  const [connectURL, setConnectURL] = React.useState('wss://carriertech.uk:8008/')
  const [socketUrl, setSocketUrl] = React.useState(connectURL);
  const {sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        onOpen: () => console.log('opened'),
        shouldReconnect: (closeEvent) => true,
      });
  const the_data = AuthStore.getRawState();
  const recImage = require('../../assets/rec.png')  //'./assets/rec.png');
  const recStop = require('../../assets/stoprec.png');
  const tdAnim = require('../../assets/threedotsanim.gif');
  const BG = require("../../assets/BG.jpg");
  const Q = require("../../assets/q.png");
  const Q1 = require("../../assets/q1.png");
  const Q2 = require("../../assets/q2.png");

  const [recButton, changeRecState] = React.useState(recImage);
  const [recording, setRecording] = React.useState();
  const [messages, setMessages] = React.useState([]);
  const [markedDates, setMarkedDates] = React.useState(null);
  const [load, setLoading] =React.useState(false);
  const [dataJson, setDataJson] = React.useState(null);
 
  const emotionColours = {'neutral':{"colour": "#808080", "val":{"speechEmotion":1, "textEmotion":1}}, 
    'calm': {"colour": "#75945b", "colourRGB":[117,148,91], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'happy': {"colour": "#fff761", "colourRGB":[255,247,97],"val":{"speechEmotion":1, "textEmotion":1}}, 
    'sad' : {"colour": "#6e79ff", "colourRGB":[110,121,255],"val":{"speechEmotion":1, "textEmotion":1}}, 
    'angry' : {"colour": "#ff4313","colourRGB":[255,67,19], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'fear' : {"colour": "#ff8c2d","colourRGB":[255,140,45], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'disgust' : {"colour": "#e564df","colourRGB":[229,100,223], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'surprise' : {"colour": "#24c9ff","colourRGB":[36,201,255], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'love' : {"colour": "#f3cec9","colourRGB":[243,206,201], "val":{"speechEmotion":1, "textEmotion":1}}};

    async function writeJSON(exportData, fN){
      await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + fN + "Data.json",
        JSON.stringify(exportData)
      )
    }
    async function readJSON(fN){
      var data = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + fN+ "Data.json");
      return data
    }
  useEffect(() => {
    readJSON("raw").then((result) => { setRData(JSON.parse(result));});
    var rtemp = {};
    readJSON("messages").then((result) => {
      let temp = [];
      result = JSON.parse(result);
      for (let v of result.messages)temp.push(v);
      setMessages(temp);
    });
  },[]);
  
  useEffect(() => {
    readJSON("raw").then((result) => { setRData(JSON.parse(result));});
    var rtemp = {};
    readJSON("messages").then((result) => {
      let temp = [];
      result = JSON.parse(result);
      for (let v of result.messages)temp.push(v);
      setMessages(temp);
    });
  },[]); 

  

  useEffect(()=> {
    if (lastMessage && lastMessage.hasOwnProperty("data")){
      let LM = JSON.parse(lastMessage.data);
      if(LM.hasOwnProperty("result") && LM.result == "add text"){
        setLoading(false);
        setMessages([...messages,
          MakeMsg(
            uuidv4(),
            LM.data["textBox"].replace(/<br>/g,""),
            new DateObject().format("YYYY-MM-DDTHH:mm:ss"),
            1,
            "User"),
            MakeMsg(
              uuidv4(),
              LM.data["llmresponse"],
              new DateObject().format("YYYY-MM-DDTHH:mm:ss"),
              2,
              "AI Response"
            )
          ])
          writeJSON({"messages":messages}, "messages");
          if ("data" in rData){
            let temp = _.cloneDeep(rData);
            temp.data[LM.data.key] = LM.data;
          writeJSON(temp, "raw");
          }

      }
    }
  },[lastMessage]);

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
  function record(){
    if(recButton == recImage){
        changeRecState(recStop);
        startRecording();
    }else{
        changeRecState(recImage);
        stopRecording();
        setLoading(true);
    }
  }

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync( 
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    let tempToken = await SecureStore.getItemAsync("tempToken");
    console.log("sending lang = ",the_data.language)
    let toSend = {"userID":tempToken,
                  "browser":"app",
                  "action":"processVoice",
                "LLM":true, "language": the_data.language}
    sendMessage(JSON.stringify(toSend));
    let fileOptions = {encoding: FileSystem.EncodingType.Base64};
    let theFile = await FileSystem.readAsStringAsync(uri, fileOptions );
    sendMessage(theFile);
    
  }
  function Loading(){
    if (load){
    return(
      <Image 
              style={{width:40,height:40, alignSelf:"flex-end"}} 
              source={tdAnim}/>
    )
    }else{return}
  }

 

  const ModalData = () =>{
   
    return(
      <View>
       
       
       <Pressable
          onPress={() => {
            setSeeModal(false);
            }}
          style={styles.pressable}>
          <Text style={styles.text}>Close</Text>
        </Pressable>
        <Text>To start, just press the record button</Text>
       
        <Text>Say what's on your mind, and press again.</Text>
        <Text>You can also oragnise your thoughts and see the analysis of emotions based on categories</Text>
      </View>
    )
  }
  return (
    <ImageBackground source={BG} style={styles.BGimage}>
    <SafeAreaView  style={styles.container}>
      <Pressable style={{backgroundColor:"#00000000", flex:0.05, alignItems: 'flex-end'}}
        onPress={() => {setSeeModal(true)}}>
        <Image  source={Q} style={{backgroundColor:"#00000000", position:"absolute",right:0, height:"100%", width:"10%"}} resizeMode="contain"/>
      </Pressable>
      <Stack.Screen options={{ headerShown: false, title: "Chat", headerStyle : {backgroundColor: '#00000000',} }} />
        <View style={{flex:0.9, alignSelf: 'stretch'}}>
          
          <GiftedChat
            messageContainerRef={chatRef}
            messages={messages}
            user={{
              _id: 1,
            }}
            inverted={false}
            scrollToBottom={true}
            style={{flex:0.2, alignSelf: 'stretch'}}
            disableComposer={true}
            renderInputToolbar={() => { return null }}
            />
            
            <Text>ready state = {readyState}</Text>
            
            <Loading/>
        </View>
        <View id="ButtonArea" style={{flex:0.2, alignSelf: 'stretch', alignItems: 'center'}}>
          <TouchableOpacity onPressOut={record} >
            <Image  source={recButton} style={{ height:"100%"}} resizeMode="contain"/>
          </TouchableOpacity>
          
        </View>
        <Modal 
           animationType = {"fade"}  
           transparent = {false}  
           visible = {seeModal}  
           onRequestClose = {() =>{ console.log("Modal has been closed.") } }> 
           <ModalData/> 
      </Modal>
    </SafeAreaView >
    </ImageBackground>
  );
};
export default Talk;