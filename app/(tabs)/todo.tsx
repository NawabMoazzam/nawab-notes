import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Todo() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">This is Todo Page!!!!</Text>
    </SafeAreaView>
  );
}
