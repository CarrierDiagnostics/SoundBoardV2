import { Redirect, Stack, useRouter } from "expo-router";
import { Button, Pressable, Text, TouchableOpacity, View, Modal, ImageBackground, SafeAreaView } from "react-native";
import * as SecureStore from 'expo-secure-store';
import styles from "../../style";
import {Picker} from '@react-native-picker/picker';
import React from "react";
import langlist from "../../langlist";
import useWebSocket from 'react-use-websocket';

const Tab2Index = () => {
  const router = useRouter();
  const {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');
  var the_data = AuthStore.getRawState();
  const [selectedLanguage, setSelectedLanguage] = React.useState(the_data.language);
  const BG = require("../assets/BG.jpg");

  const [seeModal, setSeeModal] = React.useState(false);

  const ModalData = () =>{
    return(
      
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            setSeeModal(false);
            delAccount();
            logOUt();}}
          style={styles.pressable}>
          <Text style={styles.text}>Delete</Text>
        </Pressable>

        <Pressable
          onPress={() => {setSeeModal(false);}}
          style={styles.pressable}>
          <Text style={styles.text}>Cancel</Text>
        </Pressable>
      </View>
     
    )
  }
  function delAccount(){
    let toSend = {"action":"deleteAccount",
                "email":the_data.userData.email}
    sendMessage(JSON.stringify(toSend));
  }
  async function deleteSS(key, value) {
    await SecureStore.deleteItemAsync(key);
    return ("done")
  }
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    return result
  }

  function logOUt(){
    AuthStore.update((s) => { s.isLoggedIn = false;  });
    deleteSS("tempToken").then((result) =>{
      console.log(result)});
    router.replace("/login");
   
  }
  return (
    <ImageBackground source={BG} style={styles.BGimage}>

    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false, title: "Settings", headerStyle : styles.header }} />
      <Text style={styles.text}>Language</Text>
      <Picker
        style={styles.text}
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedLanguage(itemValue);
          AuthStore.update((s) => {
            s.language = itemValue});
            console.log(itemValue);
        }
      }>
        {Object.keys(langlist).map((x, idx) =>(
          <Picker.Item label={x} value={langlist[x]} key={idx}/>
        ))}

      </Picker>


      <Pressable
        onPress={() => {logOUt()
      }}
        style={styles.pressable}
      >
        <Text style={styles.text}>LogOut</Text>
      </Pressable>
      <Pressable
        onPress={() => {setSeeModal(true)}}
        style={({pressed})=>[
          {    backgroundColor: pressed
            ? "#161b22"
            :'#677ea3'},{
          borderColor: "#677ea3",
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          marginVertical:12,
        }]}
      >
        <Text style={styles.text}>Delete Account</Text>
      </Pressable>
      <Modal 
           animationType = {"fade"}  
           transparent = {false}  
           visible = {seeModal}  
           onRequestClose = {() =>{ console.log("Modal has been closed.") } }> 
           <ModalData/> 
      </Modal>
    </SafeAreaView>
    </ImageBackground>
  );
};
export default Tab2Index;
