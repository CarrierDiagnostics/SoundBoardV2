import { Redirect, Stack, useRouter,Link, usePathname } from "expo-router";
import { Button, Pressable, Text, StyleSheet, View, ScrollView, Modal, ImageBackground , SafeAreaView} from "react-native";
import { AuthStore } from "../../../store";
import { VictoryPie} from "victory-native";
import React, {useEffect} from "react";
import useWebSocket from 'react-use-websocket';
import _ from "lodash";
import styles from "../../../style";
import * as FileSystem from 'expo-file-system';
import { useFocusEffect, useIsFocused  } from '@react-navigation/native';

const TabAnalysis = () => {
  const router = useRouter();
  const {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');
  const [rData, setRData] = React.useState(null);
  const [catData, setCatData] = React.useState(null);
  const [seeModal, setSeeModal] = React.useState(false);
  const [modalCat, setModalCat] = React.useState(false);
  const the_data = AuthStore.getRawState();
  var temp = {};
  const sections = ["Physical Environment","Business/Career","Finances","Health","Family and Friends","Romance","Personal Growth","Fun and Recreation"];
  const colours = [ "#75945b","#54dc9eff",  "#fff761", "#6e79ff", "#ff4313", "#f3cec9", "#24c9ff","#e564df" ]
  const BG = require("../../assets/BG.jpg");


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
  //readJSON("raw").then((result) => {setRData(JSON.parse(result))});

  const renderItem = ({item}) => {
    return(
      <Text>{item}</Text>
    )
  }
  function removeAnalysis(id){ //change all of this, was taken from organise
    var toSend = new Object();
    toSend.action = "sort"; 
    toSend.tempToken = the_data.tempToken;
    toSend.category = false;
    toSend.rantID = id;
    var jsonToSend = JSON.stringify(toSend);
    sendMessage(jsonToSend);
    rData.data[id].category = false;
    writeJSON(rData,"raw");
    setSeeModal(false);

  }
  const ModalData = () =>{
   
    return(
      
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.text}>{modalCat}</Text>
        {temp[modalCat].map((x,idx) => (
          <View key={idx} style={styles.container}>
            <Text style={styles.text}>{x.textBox}</Text>
            <Button   
              title="Remove"   
              onPress = {() => {removeAnalysis(x.key)}}  
            />  
          </View>
        ))}
        <Button   
           title="Close"   
           onPress = {() => {setSeeModal(false)}}  
        />  
      </ScrollView>
    )
  }

  const RenderSection =(d) =>{
    let idx = d.vars[1];
    let x = d.vars[0];
    if (x === undefined || x.length == 0)return
    let t = "See "+ x[0].category + " Thoughts";
    let breakdown = x[0].textEmotion;
    if(x.length >0){
      for (let i=1;i<x.length; i++){
        for (let [k,v] of Object.entries(x[i].textEmotion)){
          breakdown[k] = breakdown[k]+v;
        }
      }
    }
    dBreak = [];
    for (let [k,v] of Object.entries(breakdown))dBreak.push({"x":k,"y":v})
    

    return(
      <View style={styles.container} >
        
          <Text style={styles.text}>{x[0].category} </Text>
          <VictoryPie
          padding={{ top: 50, bottom: -20, right: 0, left: 0 }}
            colorScale={colours}
            data={dBreak}
            startAngle={90}
            endAngle={-90}
            labelRadius={({ innerRadius }) => innerRadius + 15 }
            innerRadius={100}
            height={400}
            style={{ labels: { fill: "white", fontSize: 20, fontWeight: "bold" } , backgroundColor:"#00000000" }}
          />
          <Modal 
           animationType = {"fade"}  
           transparent = {false}  
           visible = {seeModal}  
           >  
            <ModalData />
          </Modal>
          <Button   
           title={t}   
           onPress = {() => {
            setSeeModal(true);
            setModalCat(x[0].category);
          }}  
        />  
        </View>
    )

  }
  if (rData){
    
    for ( let [k,v] of Object.entries(rData.data)) {
      if (v.category){
        if (v.category in temp)  {
          
        }else{temp[v.category] = []; }
        temp[v.category].push(v);
      }     
    }
    //setCatData(temp);
    return (
      <ImageBackground source={BG} style={styles.BGimage}>
      <SafeAreaView style={styles.container}>
      
      
      <ScrollView style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false, title: "Categorise",  headerStyle : {backgroundColor: '#00000000',} }} />
        
        {Object.keys(temp).map((k,idx) => (
          <RenderSection key={temp[k].key}  vars={[temp[k],idx]}/>
        ))
        }
      </ScrollView>
      
      
      </SafeAreaView>
      </ImageBackground>
    );
    }
};
export default TabAnalysis;

