import React, { JSX, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Course = "Starters" | "Mains" | "Desserts";
type Dish = {
  id: string;
  name: string;
  description?: string;
  course: Course;
  price: number;
  createdAt: number;
};

const STORAGE_KEY = "@chef_menu_items";
const COURSES: Course[] = ["Starters", "Mains", "Desserts"];

export default function App(): JSX.Element {
  const [menu, setMenu] = useState<Dish[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState<Course>("Mains");
  const [priceText, setPriceText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setMenu(JSON.parse(raw));
      } catch (e) {
        console.warn("Failed to load menu:", e);
      }
    })();
  }, []);

  const persist = async (items: Dish[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save menu:", e);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCourse("Mains");
    setPriceText("");
  };

  const addDish = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter a dish name.");
      return;
    }
    const price = parseFloat(priceText);
    if (Number.isNaN(price) || price < 0) {
      Alert.alert("Validation", "Please enter a valid non-negative price.");
      return;
    }
    const newDish: Dish = {
      id: `${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      course,
      price,
      createdAt: Date.now(),
    };
    const updated = [newDish, ...menu];
    setMenu(updated);
    persist(updated);
    resetForm();
    setModalVisible(false);
  };

  const removeDish = (id: string) => {
    // cross-platform confirmation: use window.confirm on web, Alert on native
    const doDelete = (deleteId: string) => {
      const updated = menu.filter((d) => d.id !== deleteId);
      setMenu(updated);
      persist(updated);
    };

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const ok = window.confirm("Are you sure you want to delete this dish?");
      if (ok) doDelete(id);
      return;
    }

    Alert.alert("Delete dish", "Are you sure you want to delete this dish?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => doDelete(id),
      },
    ]);
  };

  const renderDish = ({ item }: { item: Dish }) => (
    <View style={styles.dishRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishMeta}>
          {item.course} • R{item.price.toFixed(2)}
        </Text>
        {item.description ? (
          <Text style={styles.dishDesc}>{item.description}</Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={() => removeDish(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chef Christoffel's Menu</Text>
        <Text style={styles.subtitle}>
          Total dishes: {menu.length}
        </Text>
      </View>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={renderDish}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No dishes yet. Add one!</Text>
          </View>
        }
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Dish</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalWrap}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Dish</Text>

            <TextInput
              placeholder="Dish name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Description (optional)"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { height: 80 }]}
              multiline
            />

            <View style={styles.courseRow}>
              {COURSES.map((c) => {
                const selected = c === course;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCourse(c)}
                    style={[
                      styles.courseButton,
                      selected && styles.courseButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.courseText,
                        selected && styles.courseTextSelected,
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              placeholder="Price (e.g. 120.00)"
              value={priceText}
              onChangeText={(t) => setPriceText(t)}
              keyboardType="decimal-pad"
              style={styles.input}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  setModalVisible(false);
                }}
                style={[styles.actionButton, styles.cancelButton]}
              >
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addDish}
                style={[styles.actionButton, styles.saveButton]}
              >
                <Text style={[styles.actionText, { color: "white" }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { marginTop: 4, color: "#666" },

  dishRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  dishName: { fontSize: 16, fontWeight: "600" },
  dishMeta: { color: "#666", marginTop: 4 },
  dishDesc: { marginTop: 6, color: "#444" },

  deleteButton: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#f44336",
  },
  deleteText: { color: "#f44336", fontWeight: "600" },

  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#888" },

  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontWeight: "700" },

  modalWrap: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  courseRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  courseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  courseButtonSelected: { backgroundColor: "#1e90ff", borderColor: "#1e90ff" },
  courseText: { color: "#333" },
  courseTextSelected: { color: "white", fontWeight: "700" },

  modalActions: { flexDirection: "row", marginTop: 14 },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelButton: { borderWidth: 1, borderColor: "#ccc", backgroundColor: "#fff" },
  saveButton: { backgroundColor: "#28a745" },
  actionText: { fontWeight: "700" },
});