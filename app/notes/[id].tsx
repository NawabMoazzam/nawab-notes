import { getNoteById, updateNote } from "@/database";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Note() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState(getNoteById(Number(id)));
  const [isEditting, setIsEditting] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(note?.title || "");
  const [content, setContent] = useState<string>(note?.content || "");
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: isEditting
        ? () => (
            <Pressable
              onPress={handleSave}
              className="mr-2 bg-[#334155] px-3 py-1 rounded-full"
            >
              <Ionicons name="save-sharp" size={20} color="#38BDF8" />
            </Pressable>
          )
        : () => (
            <Pressable
              onPress={() => setIsEditting(true)}
              className="mr-2 bg-[#334155] px-3 py-1 rounded-full"
            >
              <Ionicons name="pencil-sharp" size={20} color="#38BDF8" />
            </Pressable>
          ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditting, navigation, note?.title]);

  const handleSave = () => {
    if (note) {
      updateNote(note.id, title, content);
    }
    setNote(getNoteById(Number(id)));
    setIsEditting(false);
  };

  if (!note) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0F172A]">
        <Text className="text-[#F8FAFC] text-xl">Note not found</Text>
      </View>
    );
  }

  if (isEditting) {
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-[#0F172A] p-4"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <TextInput
            className="font-extrabold text-2xl text-[#F8FAFC] mb-4 p-0"
            value={title}
            onChangeText={setTitle}
            multiline
          />
          <View className="border-t border-[#334155] my-4" />
          <TextInput
            className="text-[#94A3B8] text-xl font-[ShadowsIntoLight] p-0"
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View className="flex-1 bg-[#0F172A] p-4">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text className="font-extrabold text-2xl text-[#F8FAFC] mb-4">
          {note?.title}
        </Text>
        <View className="border-t border-[#334155] my-4" />
        <Text className="text-[#94A3B8] text-xl font-[ShadowsIntoLight]">
          {note?.content}
        </Text>
      </ScrollView>
    </View>
  );
}
