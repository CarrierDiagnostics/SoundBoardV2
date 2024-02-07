import { Redirect, Stack, useRouter } from "expo-router";
import { Button, Pressable, Text, TouchableOpacity, View } from "react-native";
import { AuthStore } from "../../../store";
import * as SecureStore from 'expo-secure-store';
import styles from "../../../style";
import {Picker} from '@react-native-picker/picker';
import React from "react";
import langlist from "../../../langlist";

const Tab2Index = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = React.useState("English (United Kingdom)");

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
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
        onPress={() => {AuthStore.update((s) => { s.isLoggedIn = false; s.justLoggedOut = true; });
        save("tempToken", null);
        router.replace("/login");
      }}
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
        }]}
      >
        <Text style={styles.text}>LogOut</Text>
      </Pressable>
    </View>
  );
};
export default Tab2Index;
