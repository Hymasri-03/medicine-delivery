import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../theme/styles';
import { COLORS } from '../theme/colors';
import { GROUPS, SUBCAT_ICON, SUBCAT_IMAGE } from '../data/groups';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';

export default function GroupCategoryScreen() {
  const {
    currentGroup,
    currentSubcat,
    setCurrentSubcat,
    productsInGroupSubcat,
    cartCount,
    cartTotal,
    goBack,
    goTo,
    openCart,
    showToast,
  } = useApp();

  const g = GROUPS[currentGroup] || GROUPS.vitamins;
  const tabs = [{ id: 'all', name: 'All' }, ...(g?.subcats || [])];
  const ids = productsInGroupSubcat(currentGroup || 'vitamins', currentSubcat);

  return (
    <View style={styles.screen}>
      <HeaderBar title={g.title} onBack={goBack} onHelp={() => goTo('help')} onCart={openCart} cartCount={cartCount} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subtabStrip}>
        {tabs.map((t) => {
          const active = t.id === currentSubcat;
          const icon = t.id === 'all' ? 'box' : SUBCAT_ICON[t.id];
          return (
            <TouchableOpacity key={t.id} style={styles.subtab} onPress={() => setCurrentSubcat(t.id)}>
              <View style={[styles.subtabAvatar, active && styles.subtabAvatarActive, { overflow: 'hidden', backgroundColor: '#FFFFFF' }]}>
                {SUBCAT_IMAGE[t.id] ? (
                  <Image
                    source={typeof SUBCAT_IMAGE[t.id] === 'string' ? { uri: SUBCAT_IMAGE[t.id] } : SUBCAT_IMAGE[t.id]}
                    style={{ width: '88%', height: '88%' }}
                    resizeMode="contain"
                  />
                ) : (
                  <Icon type={icon} size={20} />
                )}
              </View>
              <Text style={[styles.subtabLabel, active && styles.subtabLabelActive]} numberOfLines={2}>
                {t.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 16, paddingTop: 12 }}>
        <View style={styles.grid2}>
          {ids.map((id) => (
            <View key={id} style={{ width: '48%' }}>
              <ProductCard id={id} accent={COLORS.green} />
            </View>
          ))}
        </View>
      </ScrollView>

      {cartCount > 0 && (
        <TouchableOpacity style={styles.cartBar} onPress={openCart}>
          <View>
            <Text style={styles.cartBarLine}>
              {cartCount} {cartCount === 1 ? 'item' : 'items'} · ₹{cartTotal.toFixed(2)}
            </Text>
            <Text style={styles.cartBarSub}>Tap to review & checkout</Text>
          </View>
          <View style={styles.cartBarBtn}>
            <Text style={styles.cartBarBtnText}>View cart →</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
