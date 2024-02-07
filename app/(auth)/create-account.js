import { Text, View, TextInput, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { AuthStore } from "../../store.js";
import { Stack, useRouter } from "expo-router";
import useWebSocket from 'react-use-websocket';

export default function CreateAccount() {
  const router = useRouter();
  const emailRef = useRef("");
  const [result, setResult] = useState("");
  const passwordRef = useRef("");
  const passwordcheckRef = useRef("");
  const {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');


  useEffect(() =>{
    console.log(lastMessage)
    if(lastMessage && lastMessage.hasOwnProperty("data")){
      setResult(JSON.parse(lastMessage["data"])["result"]);
      console.log(JSON.parse(lastMessage["data"])["result"]);
    }
  },[lastMessage]);

  function submitSignUp(){  
    console.log("click");
    if(emailRef && passwordRef && passwordRef.current == passwordcheckRef.current){
        var toSend = new Object();
        toSend.action = "SignUp"; 
        toSend.email = emailRef;
        toSend.password = passwordRef;
        var jsonToSend = JSON.stringify(toSend);
        console.log(toSend);
        sendMessage(jsonToSend);
        console.log("data sent");
        
        
        
    }else{
        console.log("there's a problem = " ,passwordRef.current," = ", passwordcheckRef.current);
        setResult("passwords don't match :/");
    }
}

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen
        options={{ title: "Create Account", headerLeft: () => <></> }}
      />
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="email"
          nativeID="email"
          onChangeText={(text) => {
            emailRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>
      <View>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          nativeID="password"
          onChangeText={(text) => {
            passwordRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>

      <View>
        <Text style={styles.label}>Password Check (to be sure)</Text>
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          nativeID="password"
          onChangeText={(text) => {
            passwordcheckRef.current = text;
          }}
          style={styles.textInput}
        />
      </View>

      <Text
        onPress={submitSignUp}
      >
        Create Account
      </Text>
      <Text>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    color: "#455fff",
  },
  textInput: {
    width: 250,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#455fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
});
