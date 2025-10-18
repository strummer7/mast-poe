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

// Theme colors
const COLORS = {
  primary: "#15d825ff", // warm chef red
  accent: "#e63fcfff",
  sky: "#ff7c6bff",
  mint: "#4DD0E1",
  dark: "#263238",
  light: "#F7F7F8",
  card: "#FFFFFF",
  muted: "#777",
};

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

  // UI state
  const [screen, setScreen] = useState<"home" | "chef">("home");
  const [filter, setFilter] = useState<"All" | Course>("All");

  // selection state for customers
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);

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

  const renderChefDish = ({ item }: { item: Dish }) => (
    <View style={[styles.dishCard, styles.shadow]}>
      <View style={[styles.accentStrip, { backgroundColor: courseColors[item.course] }]} />
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

  const renderCustomerDish = ({ item }: { item: Dish }) => {
    const isSelected = selectedDishId === item.id;
    return (
      <TouchableOpacity
        onPress={() => setSelectedDish(item)}
        activeOpacity={0.9}
        style={[
          styles.dishCard,
          styles.shadow,
          isSelected && styles.dishCardSelected,
        ]}
      >
        <View style={[styles.accentStrip, { backgroundColor: courseColors[item.course] }]} />
        <View style={styles.dishLeft}>
          <View style={[styles.badge, { backgroundColor: courseColors[item.course] }]}>
            <Text style={styles.badgeText}>{item.course}</Text>
          </View>
          <Text style={styles.dishName}>{item.name}</Text>
          {item.description ? <Text style={styles.dishDesc}>{item.description}</Text> : null}
        </View>

        <View style={styles.dishRight}>
          <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
          {isSelected ? <Text style={styles.selectedMark}>✓ Selected</Text> : null}
        </View>
      </TouchableOpacity>
    );
  };

  // Home screen (customer) with filter
  if (screen === "home") {
    const visible = filter === "All" ? menu : menu.filter((m) => m.course === filter);

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrap}>
          <View style={styles.headerTop} />
          <View style={[styles.headerCard, styles.shadow]}>
            <View style={styles.chefRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitial}>C</Text>
              </View>
              <View style={styles.chefInfo}>
                <Text style={styles.title}>Chef Christoffel</Text>
                <Text style={styles.tagline}>Latest menu — curated daily</Text>
              </View>
            </View>

            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterBtn, filter === "All" && styles.filterBtnActive]}
                onPress={() => setFilter("All")}
              >
                <Text style={[styles.filterText, filter === "All" && styles.filterTextActive]}>All</Text>
              </TouchableOpacity>

              {COURSES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.filterBtn, filter === c && styles.filterBtnActive]}
                  onPress={() => setFilter(c)}
                >
                  <Text style={[styles.filterText, filter === c && styles.filterTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          renderItem={renderCustomerDish}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No dishes yet. Come back soon.</Text>
            </View>
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        />

        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: COLORS.dark }]}
            onPress={() => setScreen("chef")}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>Manage menu (Chef)</Text>
          </TouchableOpacity>
        </View>

        {/* Dish detail / select modal for customers */}
        <Modal visible={!!selectedDish} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.detailModal, styles.shadow]}>
              <Text style={styles.modalTitle}>{selectedDish?.name}</Text>
              <Text style={styles.dishMeta}>
                {selectedDish?.course} • R{selectedDish ? selectedDish.price.toFixed(2) : ""}
              </Text>
              {selectedDish?.description ? <Text style={styles.dishDesc}>{selectedDish.description}</Text> : null}

              <View style={{ flexDirection: "row", marginTop: 14 }}>
                <TouchableOpacity
                  onPress={() => setSelectedDish(null)}
                  style={[styles.actionButton, styles.cancelButton]}
                >
                  <Text style={styles.actionText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (selectedDish) setSelectedDishId(selectedDish.id);
                    setSelectedDish(null);
                  }}
                  style={[styles.actionButton, styles.saveButton]}
                >
                  <Text style={[styles.actionText, { color: "#fff" }]}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // Chef screen — management UI (add/delete)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.headerTop} />
        <View style={[styles.headerCard, styles.shadow]}>
          <View style={styles.chefRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>C</Text>
            </View>
            <View style={styles.chefInfo}>
              <Text style={styles.title}>Chef Management</Text>
              <Text style={styles.tagline}>Add or remove dishes</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: "#FFF3E0" }]}>
              <Text style={[styles.summaryNumber, { color: COLORS.primary }]}>{menu.length}</Text>
              <Text style={styles.summaryLabel}>Total dishes</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: "#E1F5FE" }]}>
              <Text style={[styles.summaryNumber, { color: COLORS.sky }]}>{menu.filter((m) => m.course === "Starters").length}</Text>
              <Text style={styles.summaryLabel}>Starters</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: "#E8F5E9" }]}>
              <Text style={[styles.summaryNumber, { color: COLORS.mint }]}>{menu.filter((m) => m.course === "Mains").length}</Text>
              <Text style={styles.summaryLabel}>Mains</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: "#FCE4EC" }]}>
              <Text style={[styles.summaryNumber, { color: COLORS.accent }]}>{menu.filter((m) => m.course === "Desserts").length}</Text>
              <Text style={styles.summaryLabel}>Desserts</Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        renderItem={renderChefDish}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No dishes yet. Tap + to add the first dish.</Text>
          </View>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      />

      <TouchableOpacity
        style={[styles.fab, styles.shadow]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add dish"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <View style={{ position: "absolute", left: 16, top: 24 }}>
        <TouchableOpacity
          style={[styles.backBtnInline]}
          onPress={() => setScreen("home")}
        >
          <Text style={{ color: COLORS.dark, fontWeight: "700" }}>← Home</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalWrap}
        >
          <View style={[styles.modalContent, styles.shadow]}>
            <Text style={styles.modalTitle}>Add New Dish</Text>

            <TextInput placeholder="Dish name" value={name} onChangeText={setName} style={styles.input} />
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
                    style={[styles.courseButton, selected && styles.courseButtonSelected]}
                  >
                    <Text style={[styles.courseText, selected && styles.courseTextSelected]}>{c}</Text>
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

              <TouchableOpacity onPress={addDish} style={[styles.actionButton, styles.saveButton]}>
                <Text style={[styles.actionText, { color: "white" }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  // header with top color band and overlapping card
  headerWrap: { marginBottom: 8 },
  headerTop: { height: 92, backgroundColor: COLORS.primary },
  headerCard: {
    marginHorizontal: 16,
    marginTop: -44,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3,
  },

  chefRow: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { color: "#fff", fontWeight: "800", fontSize: 22 },
  chefInfo: { marginLeft: 14 },
  title: { fontSize: 20, fontWeight: "900", color: COLORS.dark },
  tagline: { color: COLORS.muted, marginTop: 4 },

  summaryRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  summaryNumber: { fontSize: 18, fontWeight: "900" },
  summaryLabel: { color: COLORS.muted, marginTop: 4, fontSize: 12 },

  dishCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    overflow: "hidden",
  },
  accentStrip: {
    width: 6,
    height: "100%",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    marginRight: 12,
  },
  dishCardSelected: {
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  dishLeft: { flex: 1 },
  dishRight: { alignItems: "flex-end", marginLeft: 12 },
  dishName: { fontSize: 16, fontWeight: "800", color: COLORS.dark },
  dishDesc: { marginTop: 6, color: COLORS.muted, fontSize: 13 },

  price: { fontSize: 14, fontWeight: "900", color: COLORS.dark },
  deleteButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f44336",
    backgroundColor: "#fff",
  },
  deleteText: { color: "#f44336", fontWeight: "800" },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 40 },
  emptyText: { color: COLORS.muted },

  fab: {
    position: "absolute",
    right: 18,
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  fabText: { color: "#fff", fontSize: 30, fontWeight: "900" },

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
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#eee",
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
    borderColor: "#eee",
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  courseButtonSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  courseText: { color: COLORS.dark },
  courseTextSelected: { color: "#fff", fontWeight: "800" },

  modalActions: { flexDirection: "row", marginTop: 14 },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  cancelButton: { borderWidth: 1, borderColor: "#ccc", backgroundColor: "#fff" },
  saveButton: { backgroundColor: COLORS.primary },
  actionText: { fontWeight: "800" },

  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  // filters + manage button
  filterRow: { flexDirection: "row", marginTop: 12, alignItems: "center", flexWrap: "wrap" },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    marginRight: 8,
    marginTop: 6,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.dark, fontWeight: "800" },
  filterTextActive: { color: "#fff" },

  loginBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },

  backBtnInline: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },

  selectedMark: {
    marginTop: 8,
    color: "#4caf50",
    fontWeight: "900",
  },

  // shadow helper
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  detailModal: { width: "90%", backgroundColor: "#fff", padding: 16, borderRadius: 12 },
  dishMeta: { color: COLORS.muted, marginTop: 6 },
});