import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../theme/styles';
import { COLORS } from '../theme/colors';
import { MEDICINE_IMAGES } from '../data/medicineImages';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';
import Icon from '../components/Icon';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

export default function OrdersScreen() {
  const { orders, goHome, goBack, goTo, reorder, showToast, clearOrders, resetSampleOrders } = useApp();

  return (
    <View style={styles.screen}>
      <HeaderBar
        title="My Orders"
        sub={orders.length > 0 ? `${orders.length} orders placed` : undefined}
        onBack={goBack}
        onHelp={() => goTo('help')}
      />

      {orders.length === 0 ? (
        <View style={styles.emptyOrdersContainer}>
          <View style={styles.emptyOrdersIconCircle}>
            <Svg width={52} height={52} viewBox="0 0 24 24" fill="none">
              {/* Empty package / parcel illustration */}
              <Path
                d="M21 8l-9-5-9 5 9 5 9-5z"
                stroke={COLORS.greenDark}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={COLORS.greenPale}
              />
              <Path
                d="M3 8v8l9 5 9-5V8"
                stroke={COLORS.greenDark}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 13v8"
                stroke={COLORS.greenDark}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Subtle cross accent for healthcare parcel */}
              <Path
                d="M12 5.5v3M10.5 7h3"
                stroke={COLORS.green}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </Svg>
          </View>

          <Text style={styles.emptyOrdersTitle}>No Orders</Text>
          <Text style={styles.emptyOrdersSub}>
            You haven’t placed any orders yet.{'\n'}Explore verified medicines and get express delivery.
          </Text>

          <TouchableOpacity style={styles.emptyOrdersBtn} onPress={goHome} activeOpacity={0.85}>
            <Text style={styles.emptyOrdersBtnText}>Browse Medicines</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.emptyOrdersDemoBtn} onPress={resetSampleOrders}>
            <Text style={styles.emptyOrdersDemoText}>↺ Load sample orders for preview</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 24, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.inkSoft }}>Past orders</Text>
            <TouchableOpacity onPress={clearOrders}>
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: '#EF4444' }}>Test empty state</Text>
            </TouchableOpacity>
          </View>

          {orders.map((o) => {
            const isDelivered = o.status === 'Delivered';
            return (
              <View key={o.id} style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderIdText}>{o.id}</Text>
                    <Text style={styles.orderDateText}>{o.date}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      isDelivered ? styles.statusBadgeDelivered : styles.statusBadgeTransit,
                    ]}
                  >
                    <Text
                      style={[
                        isDelivered
                          ? styles.statusBadgeDeliveredText
                          : styles.statusBadgeTransitText,
                      ]}
                    >
                      {isDelivered ? '● Delivered' : '⏳ ' + o.status}
                    </Text>
                  </View>
                </View>

                {o.items.map((item, idx) => (
                  <View key={idx} style={styles.orderItemSummary}>
                    {MEDICINE_IMAGES[item.id] ? (
                      <View style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', padding: 2, marginRight: 8, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={MEDICINE_IMAGES[item.id]} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                      </View>
                    ) : (
                      <Icon type={item.icon} size={18} />
                    )}
                    <Text style={styles.orderItemName} numberOfLines={1}>
                      {item.name} × {item.qty}
                    </Text>
                    <Text style={styles.orderItemPrice}>₹{(item.price * item.qty).toFixed(2)}</Text>
                  </View>
                ))}

                <View style={styles.orderTotalLine}>
                  <Text style={styles.orderTotalLabel}>Total Paid</Text>
                  <Text style={styles.orderTotalAmount}>₹{o.total.toFixed(2)}</Text>
                </View>

                <View style={styles.orderCardBtns}>
                  <TouchableOpacity
                    style={styles.orderBtnReorder}
                    onPress={() => reorder(o.items.map((it) => [it.id, it.qty]))}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.orderBtnReorderText}>Order again</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.orderBtnTrack}
                    onPress={() => showToast(`Tracking order ${o.id}`)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.orderBtnTrackText}>
                      {isDelivered ? 'View invoice' : 'Track delivery'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
