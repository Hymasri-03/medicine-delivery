import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'react-native';
import { styles } from '../theme/styles';
import { COLORS } from '../theme/colors';
import { CATEGORY_META, CHIP_ORDER } from '../data/categories';
import { GROUPS, SUBCAT_ICON, SUBCAT_IMAGE } from '../data/groups';
import { MEDICINE_CATEGORIES } from '../data/medicineCategories';
import { PRODUCTS } from '../data/products';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import OneBuddyLogo from '../components/OneBuddyLogo';
import MedicineCategoryCard from '../components/MedicineCategoryCard';
import FooterIcon from '../components/FooterIcon';
import ProductCard from '../components/ProductCard';
import { CartIcon, SearchIcon, PinIcon, CloseIcon, ChevronDownIcon } from '../components/UiIcons';
import LocationPickerModal from '../components/LocationPickerModal';

export default function BrowseScreen() {
  const {
    cartCount,
    cartTotal,
    currentCategory,
    openCategory,
    openGroup,
    openCart,
    openOrders,
    openAccount,
    reorder,
    goHome,
    showToast,
    deliveryLocation,
    setDeliveryLocation,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Searching all products across catalog
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return Object.entries(PRODUCTS).filter(([, p]) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.generic && p.generic.toLowerCase().includes(q)) ||
        (p.manufacturer && p.manufacturer.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.desc && p.desc.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <View style={styles.screen}>
      {/* Top Brand Bar */}
      <View style={styles.brandTopBar}>
        <OneBuddyLogo size="md" />

        <View style={styles.topActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={openCart} activeOpacity={0.7}>
            <CartIcon size={19} color={COLORS.greenDark} />
            {!!cartCount && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 16, paddingTop: 12 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <SearchIcon size={18} color={COLORS.inkSoft} />
          <TextInput
            placeholder="Search medicines, syrups, injections, care…"
            placeholderTextColor={COLORS.inkSoft}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {isSearching && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={10} activeOpacity={0.7}>
              <CloseIcon size={16} color={COLORS.inkSoft} />
            </TouchableOpacity>
          )}
        </View>

        {/* Location Selector */}
        <TouchableOpacity
          style={styles.locationPill}
          onPress={() => setShowLocationModal(true)}
          activeOpacity={0.7}
        >
          <PinIcon size={16} color={COLORS.greenDark} />
          <Text style={styles.locationText} numberOfLines={1}>
            {deliveryLocation}
          </Text>
          <ChevronDownIcon size={14} color={COLORS.greenDark} />
        </TouchableOpacity>

        {/* ── Search Results ── */}
        {isSearching ? (
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.sectionTitle,
                { fontSize: 13, color: COLORS.inkSoft, marginBottom: 10 },
              ]}
            >
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "
              {searchQuery.trim()}"
            </Text>

            {searchResults.length === 0 ? (
              <View
                style={{
                  paddingVertical: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SearchIcon size={44} color={COLORS.inkSoft} />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: COLORS.ink,
                    marginTop: 12,
                    marginBottom: 4,
                  }}
                >
                  No medicines found
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.inkSoft, textAlign: 'center' }}>
                  Try a different name, generic salt or category
                </Text>
              </View>
            ) : (
              <View style={styles.grid2}>
                {searchResults.map(([id]) => (
                  <View key={id} style={{ width: '48%' }}>
                    <ProductCard id={id} />
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            {/* First Order Promotional Banner */}
            <View style={styles.offerCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.offerCardTag}>FIRST ORDER OFFER</Text>
                <Text style={styles.offerCardTitle}>50% off, up to ₹100</Text>
                <Text style={styles.offerCardSub}>Valid on Medicines, Healthcare & Care</Text>
              </View>
              <TouchableOpacity
                style={styles.offerCardBtn}
                onPress={() => showToast('Coupon BUDDY50 applied at checkout!')}
                activeOpacity={0.85}
              >
                <Text style={styles.offerCardBtnText}>BUDDY50</Text>
              </TouchableOpacity>
            </View>

            {/* ── All Categories (Chip Filter) FIRST ── */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipRow}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {CHIP_ORDER.map((cid) => (
                <TouchableOpacity
                  key={cid}
                  style={[styles.chip, currentCategory === cid && styles.chipActive]}
                  onPress={() => {
                    if (cid === 'vitamins') openGroup('vitamins', 'all');
                    else if (cid === 'diabetes') openGroup('diabetes', 'all');
                    else openCategory(cid);
                  }}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.chipText, currentCategory === cid && styles.chipTextActive]}>
                    {CATEGORY_META[cid].chip}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* ── Medicine Categories SECOND ── */}
            <View style={{ marginBottom: 4 }}>
              <View style={styles.sectionTitleRow}>
                <Text style={[styles.sectionTitle, { fontSize: 14, marginBottom: 8 }]}>
                  Medicine Categories
                </Text>
                <TouchableOpacity onPress={() => openCategory('medicines')}>
                  <Text style={styles.linkText}>View all</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {MEDICINE_CATEGORIES.map((cat) => (
                  <MedicineCategoryCard
                    key={cat.id}
                    category={cat}
                    onPress={() =>
                      cat.id === 'vitamins'
                        ? openGroup('vitamins', 'all')
                        : openCategory(cat.id)
                    }
                    width={120}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Order Again Section */}
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Order again</Text>
              <TouchableOpacity onPress={openOrders}>
                <Text style={styles.linkText}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              <TouchableOpacity
                style={styles.reorderCard}
                onPress={() => reorder([['vitd3', 2], ['ors', 3]])}
                activeOpacity={0.8}
              >
                <Text style={styles.reorderTitle}>Order #OB4471</Text>
                <Text style={styles.reorderSub} numberOfLines={2}>
                  Vitamin D3 60K · 2 packs, ORS Sachets
                </Text>
                <View style={styles.againBtn}>
                  <Text style={styles.againBtnText}>Order again</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reorderCard}
                onPress={() => reorder([['ndl-insulin', 1], ['san-sanitizer', 1]])}
                activeOpacity={0.8}
              >
                <Text style={styles.reorderTitle}>Order #OB4102</Text>
                <Text style={styles.reorderSub} numberOfLines={2}>
                  Insulin pen needles, Sanitizer 500ml
                </Text>
                <View style={styles.againBtn}>
                  <Text style={styles.againBtnText}>Order again</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>

            {/* Subcategory Showcase */}
            {Object.entries(GROUPS).map(([gid, g]) => (
              <View key={gid} style={styles.groupCard}>
                <Text style={styles.groupCardTitle}>{g.title}</Text>
                <View style={styles.groupGrid}>
                  {g.subcats.map((sc) => (
                    <TouchableOpacity
                      key={sc.id}
                      style={styles.groupTile}
                      onPress={() => openGroup(gid, sc.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.groupTileImg, { backgroundColor: '#FFFFFF' }]}>
                        {SUBCAT_IMAGE[sc.id] ? (
                          <Image
                            source={
                              typeof SUBCAT_IMAGE[sc.id] === 'string'
                                ? { uri: SUBCAT_IMAGE[sc.id] }
                                : SUBCAT_IMAGE[sc.id]
                            }
                            style={styles.groupTilePhoto}
                            resizeMode="contain"
                          />
                        ) : (
                          <Icon type={SUBCAT_ICON[sc.id]} size={22} />
                        )}
                      </View>
                      <Text style={styles.groupTileName} numberOfLines={2}>
                        {sc.name}
                      </Text>
                      <Text style={styles.groupTileDiscount}>{sc.discount}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}
                  onPress={() => openGroup(gid, 'all')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewAllText}>View all {g.title} products</Text>
                  <Text style={{ color: COLORS.greenDark, fontWeight: '800', fontSize: 13 }}>→</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {cartCount > 0 && (
        <TouchableOpacity style={styles.cartBar} onPress={openCart} activeOpacity={0.9}>
          <View>
            <Text style={styles.cartBarLine}>
              {cartCount} {cartCount === 1 ? 'item' : 'items'} · ₹{cartTotal.toFixed(2)}
            </Text>
            <Text style={styles.cartBarSub}>Same-salt alternatives available</Text>
          </View>
          <View style={styles.cartBarBtn}>
            <Text style={styles.cartBarBtnText}>View cart →</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Location Picker Modal */}
      <LocationPickerModal
        visible={showLocationModal}
        currentLocation={deliveryLocation}
        onSelectLocation={(loc) => {
          setDeliveryLocation(loc);
          showToast(`Delivery location set to ${loc}`);
        }}
        onClose={() => setShowLocationModal(false)}
      />

      {/* Clean 4-Tab Bottom Footer with SVG Vector Icons */}
      <View style={styles.bottomNav}>
        {[
          { key: 'home' as const, label: 'Home', onPress: goHome, active: true },
          { key: 'categories' as const, label: 'Categories', onPress: () => openCategory('medicines') },
          { key: 'orders' as const, label: 'My Orders', onPress: openOrders },
          { key: 'account' as const, label: 'Account', onPress: openAccount },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.bnItem} onPress={item.onPress}>
            <FooterIcon name={item.key} active={item.active} size={22} />
            <Text style={[styles.bnLabel, item.active && styles.bnLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
