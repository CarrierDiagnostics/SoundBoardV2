import { Link, Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { AuthStore } from "../../../store";
import { Calendar } from 'react-native-calendars';
import React from "react";

const Tab1Index = () => {
  const the_data = AuthStore.getRawState();
  const [markedDates, setMarkedDates] = React.useState({});
  if (Object.keys(markedDates).length === 0){
    let temp = {};
    for (let [k,v] of Object.entries(the_data.markedDates)){
       temp[k]=v;
    }
    setMarkedDates(temp);
  }
  console.log(markedDates);
  console.log(typeof markedDates);
  return (
    <View>
        <Calendar markedDates={markedDates}/>
      </View>);
};
export default Tab1Index;
