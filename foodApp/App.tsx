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

// added: color map for course badges
const courseColors: Record<Course, string> = {
  Starters: "#FFB86B",
  Mains: "#6BB0FF",
  Desserts: "#FF8ACB",
};

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
    <View style={styles.dishCard}>
      <View style={styles.dishLeft}>
        <View style={[styles.badge, { backgroundColor: courseColors[item.course] }]}>
          <Text style={styles.badgeText}>{item.course}</Text>
        </View>
        <Text style={styles.dishName}>{item.name}</Text>
        {item.description ? <Text style={styles.dishDesc}>{item.description}</Text> : null}
      </View>

      <View style={styles.dishRight}>
        <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => removeDish(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.chefRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>C</Text>
          </View>
          <View style={styles.chefInfo}>
            <Text style={styles.title}>Chef Christoffel</Text>
            <Text style={styles.tagline}>Curating seasonal, soulful plates</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{menu.length}</Text>
            <Text style={styles.summaryLabel}>Total dishes</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{menu.filter(m => m.course === "Starters").length}</Text>
            <Text style={styles.summaryLabel}>Starters</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{menu.filter(m => m.course === "Mains").length}</Text>
            <Text style={styles.summaryLabel}>Mains</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{menu.filter(m => m.course === "Desserts").length}</Text>
            <Text style={styles.summaryLabel}>Desserts</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={renderDish}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No dishes yet. Tap + to add the first dish.</Text>
          </View>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add dish"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: "#F7F7F8" },
  header: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 0, elevation: 2 },
  chefRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { color: "#fff", fontWeight: "700", fontSize: 22 },
  chefInfo: { marginLeft: 12 },
  title: { fontSize: 18, fontWeight: "800" },
  tagline: { color: "#666", marginTop: 2 },

  summaryRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    elevation: 1,
  },
  summaryNumber: { fontSize: 18, fontWeight: "800" },
  summaryLabel: { color: "#777", marginTop: 4, fontSize: 12 },

  dishCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 1,
  },
  dishLeft: { flex: 1 },
  dishRight: { alignItems: "flex-end", marginLeft: 12 },
  dishName: { fontSize: 16, fontWeight: "700" },
  dishDesc: { marginTop: 6, color: "#666", fontSize: 13 },

  price: { fontSize: 14, fontWeight: "800", color: "#333" },
  deleteButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f44336",
  },
  deleteText: { color: "#f44336", fontWeight: "700" },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40 },
  emptyText: { color: "#888" },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1e90ff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  fabText: { color: "#fff", fontSize: 30, fontWeight: "700" },

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

  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
});