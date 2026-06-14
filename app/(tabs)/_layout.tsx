import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#38BDF8",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1E293B",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: "Checklist",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "checkmark-done-circle"
                  : "checkmark-done-circle-outline"
              }
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
