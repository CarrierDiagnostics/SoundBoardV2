import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import styles from "../../style";

const TabsLayout = () => {
  const navTheme = {
    colors: {
      background: "#171717"
    }
  };
  return (
    <Tabs
      style={styles.menu}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ccb1aa',
        },
      }}
    >
      <Tabs.Screen
        name="Calendar"
        options={{
          title: "Calendar",
          tabBarIcon: () => <Text style={styles.menu}>📅</Text>,
        }}
      />
      
      <Tabs.Screen
        name="Talk"
        options={{
          title: "Talk",
          tabBarIcon: () => <Text style={styles.menu}>💬</Text>,
        }}
      />
      <Tabs.Screen
        name="Organise"
        options={{
          title: "Organise",
          tabBarIcon: () => <Text style={styles.menu}>🗃️</Text>,
        }}
      />
      <Tabs.Screen
        name="Analyse"
        options={{
          title: "Analyse",
          tabBarIcon: () => <Text style={styles.menu}>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: () => <Text style={styles.menu}>⚙️</Text>,
        }}
      />

    </Tabs>
  
  );
};

export default TabsLayout;
