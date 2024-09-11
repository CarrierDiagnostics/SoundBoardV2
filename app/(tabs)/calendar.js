import { Link, Redirect, Stack } from "expo-router";
import { View, ImageBackground, SafeAreaView } from "react-native";
import { Calendar } from 'react-native-calendars';
import React from "react";
import styles from "../../style";

const TabCalendar = () => {
  const the_data = null;
  const [markedDates, setMarkedDates] = React.useState({});

  const BG = require("../assets/BG.jpg");

  if (Object.keys(markedDates).length === 0){
    let temp = {};
    for (let [k,v] of Object.entries(the_data.markedDates)){
       temp[k]=v;
    }
    setMarkedDates(temp);
  }

  return (
    <ImageBackground source={BG} style={styles.BGimage}>
    <SafeAreaView style={styles.container}>
      
      <Stack.Screen options={{ headerShown: false, title: "Calendar",  headerStyle : styles.header }} />
      <Calendar markedDates={markedDates}/>
      
    </SafeAreaView>
    </ImageBackground>
    
    );
};
export default TabCalendar;
