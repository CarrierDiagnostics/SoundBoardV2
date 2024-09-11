import { Link, Redirect, Stack, useNavigation } from "expo-router";
import { View, Text, ScrollView, Button,FlatList, TouchableOpacity, PixelRatio, Dimensions, Platform, ImageBackground } from "react-native";
import useWebSocket from 'react-use-websocket';
import React, {useEffect, useMemo} from "react";
import _ from "lodash";
import * as SecureStore from 'expo-secure-store';
import styles from "../../style";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect, useIsFocused  } from '@react-navigation/native';

const TabOrganise = () => {
  const {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');
  const sections = ["Physical Environment","Business/Career","Finances","Health","Family and Friends","Romance","Personal Growth","Fun and Recreation"];
  var the_data = null;
  const [init, setInit] = React.useState(null)
  const [rData, setRData] = React.useState(null);
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
  const BG = require("../assets/BG.jpg");

  function normalize(size) {
    const newSize = size * scale 
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(newSize))
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
    }
  }

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
    readJSON("raw").then((result) => {setRData(JSON.parse(result));
    });
  },[]);
  useFocusEffect(
    React.useCallback(() => {
        readJSON("raw").then((result) => {setRData(JSON.parse(result))});
    }, [])
  );
  //if(useIsFocused()) readJSON("raw").then((result) => {setRData(JSON.parse(result))});
  //if (!rData) readJSON("raw").then((result) => {setRData(JSON.parse(result))});
  
  const renderItem = ({item}) => {
    if (item.category)return; 
    return(
      <View style={{backgroundColor:"#efdb7aff", margin:"2%"}} key={item.key}>
        <Text style={{borderBottomColor:"black",
                    borderBottomWidth:3,
                    fontSize: normalize(24), 
                    margin:"1%"}}>{item.textBox}</Text> 
        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
        {catColours.map((x,idx) =>(
          <TouchableOpacity 
            onPress={() => catThought(item,item.key,x.id, item.index)}
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
    var toSend = new Object();
    toSend.action = "sort"; 
    toSend.tempToken = the_data.tempToken;
    toSend.category = cat;
    toSend.rantID = id;
    var jsonToSend = JSON.stringify(toSend);
    sendMessage(jsonToSend);
    rData.data[id].category = cat;
    writeJSON(rData, "raw");
  }

  if (rData){
    let temp = [];
    for ( let [k,v] of Object.entries(rData.data)) {temp.push(v);}

    return (
      <ImageBackground source={BG} style={styles.BGimage}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false, title: "Organise Thoughts", headerStyle : styles.header  }} />
        <FlatList
          data={temp}
          renderItem={renderItem}
          keyExtractor={item => {return item.key}}
        />
        
      </View>
      </ImageBackground>
    );
  }
};
export default TabOrganise;
