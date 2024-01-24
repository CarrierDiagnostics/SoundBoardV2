import { Tabs } from "expo-router";
import { Text } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Calendar"
        options={{
          title: "Calendar",
          tabBarIcon: () => <Text>Calendar</Text>,
        }}
      />
      
      <Tabs.Screen
        name="Talk"
        options={{
          title: "Talk",
          tabBarIcon: () => <Text>Talk</Text>,
        }}
      />
      <Tabs.Screen
        name="Organise"
        options={{
          title: "Organise",
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: () => <Text>⚙️</Text>,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
