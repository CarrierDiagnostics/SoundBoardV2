import { Redirect, Stack, useRouter,Link, usePathname } from "expo-router";
import { Button, Pressable, Text, StyleSheet, View, ScrollView, Modal } from "react-native";
import { AuthStore } from "../../../store";
import { VictoryPie} from "victory-native";
import React from "react";
import useWebSocket from 'react-use-websocket';
import _ from "lodash";

const TabAnalysis = () => {
  const router = useRouter();
  const {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');

  const [seeModal, setSeeModal] = React.useState(false);
  const the_data = AuthStore.getRawState();
  const [mCat, setMCat] = React.useState(null);
  var catData = the_data.analysedData;
  var orgData = _.cloneDeep(the_data.oraganiseData);
  console.log(orgData);
  console.log(typeof orgData);
  const sections = ["Physical Environment","Business/Career","Finances","Health","Family and Friends","Romance","Personal Growth","Fun and Recreation"];
  const colours = [ "#75945b","#54dc9eff",  "#fff761", "#6e79ff", "#ff4313", "#f3cec9", "#24c9ff","#e564df" ]
  var aData = {};
  var thoughtsData = {}
  for (let s= 0; s<sections.length; s++){
    
    aData[sections[s]] = {key:s, breakdown:false, category:sections[s]};
  }
  for (let [k,v] of Object.entries(catData)){
    //console.log(k , " = ",v);
    let tTemp = {id:k, text:v.textBox.replace(/<br>/g,"")};
    if (!aData[v.category].breakdown){
      
      thoughtsData[v.category]= [tTemp];
      bTemp = [];
      for (let [j,l] of Object.entries(v.textEmotion)) bTemp.push({x:j, y:l})
      aData[v.category].breakdown = bTemp;
    }else{
      thoughtsData[v.category].push(tTemp)
      for (let emo in v.textEmotion){
        aData[v.category].breakdown[emo] += v.textEmotion[emo]; 
      }
    }
  }
  
  var UNIQUEDATA = new Array();
  for (let [k,v] of Object.entries(aData)){
    UNIQUEDATA.push(v);
  }
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
    console.log("changing cat for",id);
    catData[id].category = false;
    let temp = {"data":catData[id]}
    console.log("what I'm moving",catData[id]);
    
    AuthStore.update(s => {s.analysedData = catData});  
    console.log("saved cat data");
    orgData.push(temp)
    console.log("added to orgdata")
    AuthStore.update(s => {s.oraganiseData = orgData}); 
    console.log("saved to org data"); 
    delete catData[id];
    console.log("deleting from current lsit")
    //the_data = AuthStore.getRawState();
  }
  const ModalData = () =>{
    return(
      <ScrollView >
        <Button   
           title="Close"   
           onPress = {() => {setSeeModal(false)}}  
        />  
        {thoughtsData[mCat].map((x,idx) => (
          <View key={idx}>
            <Text>{x.text}</Text>
            <Button   
              title="Remove"   
              onPress = {() => {removeAnalysis(x.id)}}  
            />  
          </View>
        ))}
        
      </ScrollView>
    )
  }

  const RenderSection =(d) =>{
    let idx = d.vars[1];
    let x = d.vars[0];
    let t = "Breakdown "+ x.category;
    if (!x.breakdown) return
    return(
      <View>
        
          <Text >{x.category} </Text>
          <VictoryPie
            colorScale={colours}
            data={x.breakdown}
            startAngle={90}
            endAngle={-90}
            labelRadius={({ innerRadius }) => innerRadius + 15 }
            innerRadius={100}
            style={{ labels: { fill: "white", fontSize: 20, fontWeight: "bold" } }}
          />
          <Modal 
           animationType = {"fade"}  
           transparent = {false}  
           visible = {seeModal}  
           onRequestClose = {() =>{ console.log("Modal has been closed.") } }>  
            <ModalData/>
          </Modal>
          <Button   
           title={t}   
           onPress = {() => {
            setSeeModal(true)
            setMCat(x.category);
          }}  
        />  
        </View>
    )
  }
  return (
    <ScrollView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: true, title: "Categorise" }} />
      
      {UNIQUEDATA.map((x,idx) => (
        <RenderSection key={x.key}  vars={[x,idx]}/>
      ))
      }
    </ScrollView>
  );
};
export default TabAnalysis;

const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    alignItems: 'center',  
    justifyContent: 'center',  
    backgroundColor: '#ecf0f1',  
  },  
  modal: {  
  justifyContent: 'center',  
  alignItems: 'center',   
  backgroundColor : "#00BCD4",   
  height: 300 ,  
  width: '80%',  
  borderRadius:10,  
  borderWidth: 1,  
  borderColor: '#fff',    
  marginTop: 80,  
  marginLeft: 40,  
   
   },  
   text: {  
      color: '#3f2949',  
      marginTop: 10  
   }  
});  