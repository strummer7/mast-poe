import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";

type Course = "Starters" | "Mains" | "Desserts";
type Dish = { id: string; name: string; price: number; course: Course };

type CartEntry = { dish: Dish; qty: number };

type Props = {
  cart: CartEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
};

export default function CartBar({ cart, onRemove, onClear }: Props) {
  const [open, setOpen] = useState(false);

  const count = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + c.qty * c.dish.price, 0);

  return (
    <>
      <View style={styles.barWrap} pointerEvents="box-none">
        <TouchableOpacity style={styles.bar} onPress={() => setOpen(true)}>
          <View>
            <Text style={styles.barTitle}>Cart</Text>
            <Text style={styles.barSub}>{count} items • R{total.toFixed(2)}</Text>
          </View>
          <View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View>
        </TouchableOpacity>
      </View>

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Your cart</Text>
            <FlatList
              data={cart}
              keyExtractor={(i) => i.dish.id}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <View>
                    <Text style={styles.itemName}>{item.dish.name}</Text>
                    <Text style={styles.itemMeta}>{item.qty} × R{item.dish.price.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => onRemove(item.dish.id)} style={styles.removeBtn}><Text style={styles.removeText}>Remove</Text></TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.empty}>Cart is empty</Text>}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => { setOpen(false); }} style={styles.actionBtn}><Text>Close</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { onClear(); setOpen(false); }} style={[styles.actionBtn, styles.clearBtn]}><Text style={{ color: "#fff" }}>Clear</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  barWrap: { position: "absolute", left: 16, right: 16, bottom: 16, alignItems: "center", zIndex: 50 },
  bar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 10, width: "100%", shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12, elevation: 6 },
  barTitle: { fontWeight: "800", fontSize: 14 },
  barSub: { color: "#666", marginTop: 2, fontSize: 12 },
  badge: { backgroundColor: "#FF6B6B", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: "#fff", fontWeight: "800" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", padding: 16 },
  modal: { backgroundColor: "#fff", borderRadius: 12, padding: 16, maxHeight: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "900", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderColor: "#f1f1f1" },
  itemName: { fontWeight: "800" },
  itemMeta: { color: "#777", marginTop: 4 },
  removeBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#eee" },
  removeText: { color: "#f44336", fontWeight: "700" },

  empty: { textAlign: "center", color: "#777", padding: 8 },

  modalActions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 12 },
  actionBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, marginLeft: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#eee" },
  clearBtn: { backgroundColor: "#f44336", borderColor: "#f44336" },
});