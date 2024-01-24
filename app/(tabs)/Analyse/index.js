import { Redirect, Stack, useRouter } from "expo-router";
import { Button, Pressable, Text, TouchableOpacity, View, FlatList } from "react-native";
import { AuthStore } from "../../../store";

const TabAnalysis = () => {
  const router = useRouter();
  const the_data = AuthStore.getRawState();
  const catData = the_data.analysedData;
  const sections = ["Physical Environment","Business/Career","Finances","Health","Family and Friends","Romance","Personal Growth","Fun and Recreation"];
  const colours = [ "#75945b","#54dc9eff",  "#fff761", "#6e79ff", "#ff4313", "#f3cec9", "#24c9ff","#e564df" ]
  const catColours = sections.map((x,i) => ({"id":x, "colour":colours[i]}));
  const aData = [];
  for (let s= 0; s<sections.length; s++){
    aData.push({id:s, cat:sections[s], breakdown:{}});
  }
  for (let [k,v] of Object.entries(catData)){
    for ( let sec of aData){
      if (sec.cat == v.category){
        
      }
    }
   
  }
  //console.log("analysed data = ",catData);
  
  function renderItem(){
    return
  }
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "Categorise" }} />
      <FlatList
         data={colours}
         renderItem={renderItem}
         keyExtractor={item => item.id}
      />
    </View>
  );
};
export default TabAnalysis;
