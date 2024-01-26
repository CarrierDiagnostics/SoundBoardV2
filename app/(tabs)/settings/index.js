import { Redirect, Stack, useRouter } from "expo-router";
import { Button, Pressable, Text, TouchableOpacity, View } from "react-native";
import { AuthStore } from "../../../store";
import * as SecureStore from 'expo-secure-store';


const Tab2Index = () => {
  const router = useRouter();
  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
      <Text style={{ fontFamily: "EncodeSansSemiCondensed_100Thin" }}>
        EncodeSansSemiCondensed_100Thin
      </Text>
      <Text style={{ fontFamily: "EncodeSansSemiCondensed_300Light" }}>
        EncodeSansSemiCondensed_300Light
      </Text>
      <Text style={{ fontFamily: "EncodeSansSemiCondensed_400Regular" }}>
        EncodeSansSemiCondensed_400Regular
      </Text>
      <Text style={{ fontFamily: "EncodeSansSemiCondensed_700Bold" }}>
        EncodeSansSemiCondensed_700Bold
      </Text>
      <Button
        onPress={() => {
          AuthStore.update((s) => {
            s.isLoggedIn = false;
          });
          save("tempToken", null);
          router.replace("/login");
        }}
        title="LOGOUT"
      />

      <Pressable
        onPress={() => {alert('pressed')}}
        style={({pressed})=>[
          {    backgroundColor: pressed
            ? '#920'
            : "#818"},{
          borderColor: "#920",
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }]}
      >
        <Text
          style={{
            fontFamily: "EncodeSansSemiCondensed_700Bold",
            color: "white",
          }}
        >
          Button
        </Text>
      </Pressable>
    </View>
  );
};
export default Tab2Index;
