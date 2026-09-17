import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../theme/styles';
import { COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';

export default function AccountScreen() {
  const { goHome, goBack, goTo, openOrders, orders, showToast } = useApp();

  const [userName, setUserName] = useState('Aarav Sharma');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('Aarav Sharma');
  const [tempPhone, setTempPhone] = useState('+91 98765 43210');

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AS';

  const menuSections = [
    {
      title: 'Healthcare & Orders',
      items: [
        {
          icon: '📦',
          label: 'My Orders',
          sub: `${orders.length} placed`,
          onPress: openOrders,
        },
        {
          icon: '📋',
          label: 'My Prescriptions',
          sub: '1 active',
          onPress: () => showToast('1 verified prescription on file'),
        },
        {
          icon: '📍',
          label: 'Saved Addresses',
          sub: 'Home, Office',
          onPress: () => showToast('Managing delivery addresses'),
        },
      ],
    },
    {
      title: 'Payments & Settings',
      items: [
        {
          icon: '💳',
          label: 'Payment Methods',
          sub: 'UPI, Cards',
          onPress: () => showToast('Managing payment options'),
        },
        {
          icon: '🔔',
          label: 'Notifications',
          sub: 'Order updates & offers',
          onPress: () => showToast('Notification settings'),
        },
        {
          icon: '❓',
          label: 'Help & FAQs',
          sub: 'Customer support',
          onPress: () => goTo('help'),
        },
      ],
    },
  ];

  return (
    <View style={styles.screen}>
      <HeaderBar title="My Account" onBack={goBack} onHelp={() => goTo('help')} />

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 24, paddingTop: 10 }}>
        {/* Profile Card with Edit Option next to Name */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{initials}</Text>
          </View>

          <View style={{ flex: 1 }}>
            {!isEditing ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {userName}
                  </Text>
                  <TouchableOpacity
                    style={styles.profileEditBtn}
                    onPress={() => {
                      setTempName(userName);
                      setTempPhone(userPhone);
                      setIsEditing(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.profileEditBtnText}>✏️ Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.profilePhone}>{userPhone}</Text>
                <View style={styles.profileBadge}>
                  <Text style={styles.profileBadgeText}>✓ VERIFIED PATIENT</Text>
                </View>
              </>
            ) : (
              <View style={{ gap: 6 }}>
                <TextInput
                  style={styles.profileEditInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Full name"
                  placeholderTextColor={COLORS.inkSoft}
                />
                <TextInput
                  style={styles.profileEditInput}
                  value={tempPhone}
                  onChangeText={setTempPhone}
                  placeholder="Phone number"
                  placeholderTextColor={COLORS.inkSoft}
                  keyboardType="phone-pad"
                />
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                  <TouchableOpacity
                    style={styles.profileSaveBtn}
                    onPress={() => {
                      if (tempName.trim()) setUserName(tempName.trim());
                      if (tempPhone.trim()) setUserPhone(tempPhone.trim());
                      setIsEditing(false);
                      showToast('Profile updated');
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.profileSaveBtnText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.profileCancelBtn}
                    onPress={() => setIsEditing(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.profileCancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.accountStats}>
          <TouchableOpacity style={styles.accountStatBox} onPress={openOrders} activeOpacity={0.8}>
            <Text style={styles.accountStatNum}>{orders.length}</Text>
            <Text style={styles.accountStatLabel}>Total Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accountStatBox} onPress={() => showToast('1 Active prescription')} activeOpacity={0.8}>
            <Text style={styles.accountStatNum}>1</Text>
            <Text style={styles.accountStatLabel}>Prescriptions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.accountStatBox} onPress={() => showToast('2 Saved addresses')} activeOpacity={0.8}>
            <Text style={styles.accountStatNum}>2</Text>
            <Text style={styles.accountStatLabel}>Addresses</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Groups - Terms & Privacy Removed, SVG Arrow for Guaranteed Alignment */}
        {menuSections.map((sec, sIdx) => (
          <View key={sIdx} style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.inkSoft, marginBottom: 8, paddingHorizontal: 4 }}>
              {sec.title}
            </Text>
            <View style={styles.accountMenuGroup}>
              {sec.items.map((item, iIdx) => (
                <TouchableOpacity
                  key={iIdx}
                  style={[
                    styles.accountMenuItem,
                    iIdx === sec.items.length - 1 && { borderBottomWidth: 0 },
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.accountMenuIcon}>{item.icon}</Text>
                  <Text style={styles.accountMenuLabel}>{item.label}</Text>
                  {item.sub && <Text style={styles.accountMenuSub}>{item.sub}</Text>}
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M9 18l6-6-6-6"
                      stroke={COLORS.inkSoft}
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => showToast('Logged out of OneBuddy')}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutBtnText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
