import { Link, Redirect, Stack } from "expo-router";
import { View, Text, ScrollView, Button,FlatList, TouchableOpacity, PixelRatio, Dimensions, Platform } from "react-native";
import { AuthStore } from "../../../store";
import useWebSocket from 'react-use-websocket';
import React from "react";
import _ from "lodash";
import * as SecureStore from 'expo-secure-store';
import styles from "../../../style";

const TabOrganise = () => {
  const {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');
  const sections = ["Physical Environment","Business/Career","Finances","Health","Family and Friends","Romance","Personal Growth","Fun and Recreation"];
  var the_data = AuthStore.getRawState();
  const [catData, setCatData] = React.useState(_.cloneDeep(the_data.oraganiseData));
  var analyseData = _.cloneDeep(the_data.analysedData);
  const colours = [ "#75945b","#54dc9eff",  "#fff761", "#6e79ff", "#ff4313", "#f3cec9", "#24c9ff","#e564df" ]
  const emotionColours = {'neutral':{"colour": "#808080", "val":{"speechEmotion":1, "textEmotion":1}}, 
    'calm': {"colour": "#75945b", "colourRGB":[117,148,91], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'happy': {"colour": "#fff761", "colourRGB":[255,247,97],"val":{"speechEmotion":1, "textEmotion":1}}, 
    'sad' : {"colour": "#6e79ff", "colourRGB":[110,121,255],"val":{"speechEmotion":1, "textEmotion":1}}, 
    'angry' : {"colour": "#ff4313","colourRGB":[255,67,19], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'fear' : {"colour": "#ff8c2d","colourRGB":[255,140,45], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'disgust' : {"colour": "#e564df","colourRGB":[229,100,223], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'surprise' : {"colour": "#24c9ff","colourRGB":[36,201,255], "val":{"speechEmotion":1, "textEmotion":1}}, 
    'love' : {"colour": "#f3cec9","colourRGB":[243,206,201], "val":{"speechEmotion":1, "textEmotion":1}}};
  
  const catColours = sections.map((x,i) => ({"id":x, "colour":colours[i]}));
  const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  } = Dimensions.get('window');
  const scale = SCREEN_WIDTH / 320;
  
  function normalize(size) {
    const newSize = size * scale 
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
  }
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    console.log(result);
  }
  const renderItem = ({item}) => {
    
    return(
      <View style={{backgroundColor:"#efdb7aff", margin:"2%"}}>
        <Text style={{borderBottomColor:"black",borderBottomWidth:3,fontSize: normalize(24), margin:"1%"}}>{item.title}</Text> 
        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
        {catColours.map((x,idx) =>(
          <TouchableOpacity 
            onPress={() => catThought(item,item.id,x.id, item.index)}
            key={idx}
            style={{backgroundColor:x.colour, margin:"1%", padding:"2%"}}
          >
          <Text key={idx} style={{ fontSize: normalize(16)}} >{x.id}</Text>
          </TouchableOpacity>
        ))}
        </View>
      </View>
    )
  }

  function catThought(item, id,cat, idx){
    
    let temp = {};
    temp[id] ={...item.data, "category":cat};
    var toSend = new Object();
    toSend.action = "sort"; 
    //for (let [k,v] of Object.entries(the_data.userData)) console.log(k);
    toSend.tempToken = the_data.tempToken;
    toSend.category = cat;
    toSend.rantID = id;
    var jsonToSend = JSON.stringify(toSend);
    sendMessage(jsonToSend);
    Object.assign(analyseData, temp);
    AuthStore.update(s => {s.analysedData = analyseData});  
    the_index = catData.indexOf(item);
    let tempCatdata = _.cloneDeep(catData);
    tempCatdata.splice(the_index, 1);
    setCatData(tempCatdata);
    AuthStore.update(s => {s.oraganiseData = catData});  
    the_data = AuthStore.getRawState();
    return
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Organise Thoughts", headerStyle : styles.header  }} />
      <FlatList
         data={catData}
         renderItem={renderItem}
         keyExtractor={item => item.id}
      />
      
    </View>
  );
};
export default TabOrganise;
