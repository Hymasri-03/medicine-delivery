import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { styles } from '../theme/styles';

interface QtyControlProps {
  id: string;
  qty: number;
  onChange: (id: string, delta: number) => void;
  accent?: string;
}

export default function QtyControl({ id, qty, onChange, accent = COLORS.green }: QtyControlProps) {
  if (qty === 0) {
    return (
      <TouchableOpacity style={[styles.addBtn, { borderColor: accent }]} onPress={() => onChange(id, 1)}>
        <Text style={[styles.addBtnText, { color: accent }]}>ADD</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.qtyStepper, { backgroundColor: accent }]}>
      <TouchableOpacity onPress={() => onChange(id, -1)} hitSlop={8}>
        <Text style={styles.qtyStepperBtn}>–</Text>
      </TouchableOpacity>
      <Text style={styles.qtyStepperVal}>{qty}</Text>
      <TouchableOpacity onPress={() => onChange(id, 1)} hitSlop={8}>
        <Text style={styles.qtyStepperBtn}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
