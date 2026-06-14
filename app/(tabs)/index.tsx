import { deleteNote, getNotes, initDatabase, Note } from "@/database";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const router = useRouter();
  const navigation = useNavigation();
  const stackNavigation =
    (navigation as any).getParent?.()?.getParent?.() ??
    (navigation as any).getParent?.() ??
    navigation;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSelectedNotes([]);
    loadNotes();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // 1. Create table on startup
    initDatabase();
    // 2. Load any saved notes
    loadNotes();
  }, []);

  useEffect(() => {
    stackNavigation.setOptions({
      headerTitle:
        selectedNotes.length > 0
          ? () => (
              <View className="items-start">
                <Text className="text-[#F8FAFC] text-base font-semibold">
                  {selectedNotes.length} selected
                </Text>
              </View>
            )
          : "Nawab Notes",
      headerLeft:
        selectedNotes.length > 0
          ? () => (
              <Pressable onPress={clearSelection} className="mr-2">
                <Ionicons name="close" size={20} color="#F8FAFC" />
              </Pressable>
            )
          : undefined,
      headerRight:
        selectedNotes.length > 0
          ? () => (
              <View className="flex-row items-center gap-3">
                <Pressable
                  onPress={handleSelectAll}
                  className="rounded-full bg-[#1E293B] px-3 py-2"
                >
                  <Text className="text-[#F8FAFC] text-xs font-semibold">
                    {selectedNotes.length === notes.length
                      ? "Clear"
                      : "Select all"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleDeleteSelected}
                  className="rounded-full bg-[#EF4444] px-3 py-2 flex-row items-center gap-1"
                >
                  <Ionicons name="trash-outline" size={14} color="#F8FAFC" />
                  <Text className="text-[#F8FAFC] text-xs font-semibold">
                    Delete
                  </Text>
                </Pressable>
              </View>
            )
          : undefined,
    });
  }, [notes.length, selectedNotes, stackNavigation]);

  const loadNotes = () => {
    const savedNotes = getNotes();
    setNotes(savedNotes);
  };

  const handleCreateNote = () => {
    alert("This Button is to add new notes");
    loadNotes(); // Refresh the list
  };

  const clearSelection = () => {
    setSelectedNotes([]);
  };

  const handleSelectAll = () => {
    if (selectedNotes.length === notes.length) {
      setSelectedNotes([]);
      return;
    }

    setSelectedNotes(notes.map((note) => note.id));
  };

  const handleDeleteSelected = () => {
    if (selectedNotes.length === 0) {
      return;
    }

    selectedNotes.forEach((id) => deleteNote(id));
    setSelectedNotes([]);
    loadNotes();
  };

  const onNotePress = (id: number) => {
    if (selectedNotes.length === 0) {
      router.navigate({
        pathname: `/notes/[id]`,
        params: { id },
      });
    } else {
      setSelectedNotes((prev) =>
        prev.includes(id)
          ? prev.filter((noteId) => noteId !== id)
          : [...prev, id],
      );
    }
  };

  const onNoteLongPress = (id: number) => {
    setSelectedNotes((prev) =>
      prev.includes(id)
        ? prev.filter((noteId) => noteId !== id)
        : [...prev, id],
    );
  };

  return (
    <View className="flex-1 bg-[#0F172A]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notes.map((note) => (
          <View key={note.id} className="relative">
            <Pressable
              key={note.id}
              className={` px-8 py-4 m-2 rounded-full overflow-hidden ${selectedNotes.includes(note.id) ? "bg-[#334155]/50" : "bg-[#334155]"}`}
              android_ripple={{
                color: "#94A3B8/50",
                borderless: false,
                foreground: true,
              }}
              onPress={() => onNotePress(note.id)}
              onLongPress={() => onNoteLongPress(note.id)}
            >
              <Text
                className="font-extrabold text-xl text-[#F8FAFC]"
                numberOfLines={1}
              >
                {note.title}
              </Text>
              <Text className="text-[#94A3B8] font-[ShadowsIntoLight]">
                {note.content?.slice(0, 100)}{" "}
                {note.content && note.content.length > 100 ? "..." : ""}
              </Text>
            </Pressable>

            {selectedNotes.includes(note.id) && (
              <View className="absolute top-3 right-3 z-10 bg-[#38BDF8] p-1 rounded-full">
                <Ionicons name="checkmark" size={16} color="#0F172A" />
              </View>
            )}
          </View>
        ))}
        {notes.length <= 0 && (
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-[#94A3B8] font-[ShadowsIntoLight] text-lg">
              No notes yet. Tap the + button to add one!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating action button placed inside parent View so absolute positioning is relative to screen */}
      <Pressable
        className="bg-[#38BDF8] p-4 rounded-full absolute right-6 bottom-6"
        style={{ elevation: 5 }}
        onPress={handleCreateNote}
      >
        <Ionicons name="add-sharp" size={24} />
      </Pressable>
    </View>
  );
}
