import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../theme/styles';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';

const FAQS = [
  { q: "Where's my order?", a: 'Track it from the order screen' },
  { q: 'Why is a prescription needed?', a: 'Required by law for Rx medicines' },
  { q: 'Can I reschedule delivery?', a: 'Up to 30 mins before arrival' },
];

export default function HelpScreen() {
  const { goBack, showToast } = useApp();

  return (
    <View style={styles.screen}>
      <HeaderBar title="Help & FAQs" onBack={goBack} />
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 16 }}>
        {FAQS.map((f) => (
          <View key={f.q} style={styles.payOption}>
            <View style={{ flex: 1 }}>
              <Text style={styles.payLabel}>{f.q}</Text>
              <Text style={styles.paySub}>{f.a}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8 }]} onPress={() => showToast('Connecting you to a pharmacist')}>
          <Text style={styles.primaryBtnText}>Chat with support</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
