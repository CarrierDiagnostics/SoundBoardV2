import { Link, Redirect, Stack } from "expo-router";
import { View, Text, Image, Pressable } from "react-native";
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



const Talk = () => {
  var today = new DateObject().format("YYYY-MM-DD");
  const chatRef = useRef();
  const [rData, setRData] = React.useState(null);

  var {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');
  const the_data = AuthStore.getRawState();
  const recImage = require('./assets/rec.png');
  const recStop = require('./assets/stoprec.png');
  const tdAnim = require('./assets/threedotsanim.gif');
  const [recButton, changeRecState] = React.useState(recImage);
  const [recording, setRecording] = React.useState();
  const [messages, setMessages] = React.useState([]);
  const [markedDates, setMarkedDates] = React.useState(null);
  const [load, setLoading] =React.useState(false);
  /*console.log("messages = ",the_data.messages);
  console.log("lenght = ",the_data.messages.length )
  if (messages.length == 0 && the_data.messages.length != 0){
    let temp = [];
    for (let v of the_data.messages) temp.push(v);
    setMessages(temp);
  }*/
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
    let toSend = {"userID":tempToken,
                  "browser":"app",
                  "action":"processVoice",
                "LLM":true}
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
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Chat", headerStyle : {backgroundColor: '#677ea3',} }} />
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
          <Pressable onPress={record} >
            <Image  source={recButton} style={{ height:"100%"}} resizeMode="contain"/>
          </Pressable>
          
        </View>
    </View>
  );
};
export default Talk;