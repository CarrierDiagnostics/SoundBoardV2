import { Link, Redirect, Stack } from "expo-router";
import { View, Text, ScrollView, Button,FlatList} from "react-native";
import { AuthStore } from "../../../store";
import useWebSocket from 'react-use-websocket';
import React from "react";

const TabOrganise = () => {
  const {sendMessage, lastMessage, readyState } = useWebSocket('wss://carriertech.uk:8008/');
  const sections = ["Physical Environment","Business/Career","Finances","Health","Family and Friends","Romance","Personal Growth","Fun and Recreation"];
  const the_data = AuthStore.getRawState();
  const catData = the_data.oraganiseData;
  const ButtonRow = () => {
    return(
      <View>
      {sections.map((x,idx) =>(
        <Button
          title={x}
          onPress={catThought(this.title)}
          key={idx}
        />
      ))}
      </View>
    )
  }
  

  //<Text>{JSON.stringify(catData)}</Text>
  function catThought(category){
    return
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "Home" }} />
      <FlatList
         data={catData}
         renderItem={({item}) => <View><Text>{item.title}</Text> <ButtonRow/></View>}
         keyExtractor={item => item.id}
      />
      
    </View>
  );
};
export default TabOrganise;
