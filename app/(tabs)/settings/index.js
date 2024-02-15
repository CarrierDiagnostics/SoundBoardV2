import { Redirect, Stack, useRouter } from "expo-router";
import { Button, Pressable, Text, TouchableOpacity, View, Modal } from "react-native";
import { AuthStore } from "../../../store";
import * as SecureStore from 'expo-secure-store';
import styles from "../../../style";
import {Picker} from '@react-native-picker/picker';
import React from "react";
import langlist from "../../../langlist";
import useWebSocket from 'react-use-websocket';

const Tab2Index = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = React.useState("English (United Kingdom)");
  const {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');
  var the_data = AuthStore.getRawState();
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
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Settings", headerStyle : styles.header }} />
      <Text style={styles.text}>Language</Text>
      <Picker
        style={styles.text}
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedLanguage(itemValue)
        }>
        {Object.keys(langlist).map((x, idx) =>(
          <Picker.Item label={x} value={x} key={idx}/>
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
    </View>
  );
};
export default Tab2Index;
