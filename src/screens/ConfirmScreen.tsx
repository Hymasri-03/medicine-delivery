import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../theme/styles';
import { COLORS } from '../theme/colors';
import { PRODUCTS } from '../data/products';
import { MEDICINE_IMAGES } from '../data/medicineImages';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';
import Icon from '../components/Icon';

export default function ConfirmScreen() {
  const { lastOrder, lastOrderId, orders, goHome, goTo, showToast } = useApp();
  const ids = Object.keys(lastOrder);
  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <View style={[styles.screen, { backgroundColor: COLORS.bg }]}>
      <HeaderBar title="Order confirmed" onBack={goHome} onHelp={() => goTo('help')} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 6 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.confirmHero}>
          <View style={styles.confirmCheck}>
            <Text style={{ fontSize: 28 }}>✅</Text>
          </View>
          <Text style={styles.confirmTitle}>Order placed!</Text>
          <Text style={styles.confirmSub}>Your pharmacy has confirmed the order</Text>
        </View>

        {/* ETA Card */}
        <View style={styles.etaCard}>
          <View>
            <Text style={styles.etaTitle}>Arriving today</Text>
            <Text style={styles.etaSub}>{dateLabel} · Hyderabad</Text>
          </View>
          <View style={styles.etaBadge}>
            <Text style={styles.etaBadgeNum}>28</Text>
            <Text style={styles.etaBadgeLabel}>MINS</Text>
          </View>
        </View>

        {/* ── Your Orders Section Immediately After Arriving Today ── */}
        <View style={{ marginTop: 18, marginBottom: 8, paddingHorizontal: 2 }}>
          <Text style={[styles.sectionTitle, { fontSize: 17, marginBottom: 8, color: COLORS.ink }]}>
            Your orders
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: COLORS.card,
            padding: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.line,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 13.5, color: COLORS.inkSoft, fontWeight: '600' }}>Order ID</Text>
          <Text style={{ fontSize: 14, color: COLORS.ink, fontWeight: '800' }}>{lastOrderId}</Text>
        </View>

        {ids.map((id) => {
          const p = PRODUCTS[id];
          if (!p) return null;
          return (
            <View
              key={id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: COLORS.card,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: COLORS.line,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 10,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: COLORS.line,
                  padding: 3,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                {MEDICINE_IMAGES[id] ? (
                  <Image
                    source={MEDICINE_IMAGES[id]}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                ) : p.image ? (
                  <Image
                    source={{ uri: p.image }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                ) : (
                  <Icon type={p.icon} size={24} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.ink }}>
                  {p.name} × {lastOrder[id]}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: COLORS.greenDark,
                    marginTop: 3,
                  }}
                >
                  ₹{(p.price * lastOrder[id]).toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Total Amount Paid */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: COLORS.card,
            padding: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.line,
            marginTop: 4,
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 14, color: COLORS.ink, fontWeight: '700' }}>
            Total Amount Paid
          </Text>
          <Text style={{ fontSize: 16, color: COLORS.greenDark, fontWeight: '800' }}>
            ₹{(orders[0]?.total ?? 0).toFixed(2)}
          </Text>
        </View>

        <View style={styles.helpRow}>
          <TouchableOpacity style={styles.helpBtn} onPress={() => goTo('help')}>
            <Text style={styles.helpBtnText}>❓ Help & FAQs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.helpBtn}
            onPress={() => showToast('Opening chat support')}
          >
            <Text style={styles.helpBtnText}>💬 Chat support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomDock}>
        <TouchableOpacity style={styles.primaryBtn} onPress={goHome}>
          <Text style={styles.primaryBtnText}>Return to home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            {
              backgroundColor: COLORS.greenPale,
              borderWidth: 1,
              borderColor: COLORS.green,
              marginTop: 8,
            },
          ]}
          onPress={() => goTo('orders')}
        >
          <Text style={[styles.primaryBtnText, { color: COLORS.greenDark }]}>
            View in My Orders
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
