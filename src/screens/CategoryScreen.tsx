import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../theme/styles';
import { COLORS } from '../theme/colors';
import { CATEGORY_META } from '../data/categories';
import { MEDICINE_CATEGORIES } from '../data/medicineCategories';
import { PRODUCTS } from '../data/products';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';
import ProductCard from '../components/ProductCard';
import MedicineCategoryCard from '../components/MedicineCategoryCard';
import { SearchIcon, CloseIcon } from '../components/UiIcons';

export default function CategoryScreen() {
  const {
    currentCategory,
    openCategory,
    openGroup,
    productsInCategory,
    cartCount,
    cartTotal,
    goBack,
    goTo,
    openCart,
  } = useApp();

  const [query, setQuery] = useState('');

  const meta = CATEGORY_META[currentCategory] || CATEGORY_META.all;
  const ids = productsInCategory(currentCategory);
  const isMedicineView =
    currentCategory === 'medicines' ||
    MEDICINE_CATEGORIES.some((c) => c.id === currentCategory);

  const filteredIds = useMemo(() => {
    if (!query.trim()) return ids;
    const q = query.toLowerCase().trim();
    return ids.filter((id) => {
      const p = PRODUCTS[id];
      if (!p) return false;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.generic && p.generic.toLowerCase().includes(q)) ||
        (p.manufacturer && p.manufacturer.toLowerCase().includes(q)) ||
        (p.desc && p.desc.toLowerCase().includes(q))
      );
    });
  }, [ids, query]);

  return (
    <View style={styles.screen}>
      <HeaderBar
        title={meta.title}
        sub={meta.sub}
        onBack={goBack}
        onHelp={() => goTo('help')}
        onCart={openCart}
        cartCount={cartCount}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={styles.searchBar}>
          <SearchIcon size={18} color={COLORS.inkSoft} />
          <TextInput
            placeholder={`Search within ${meta.title}…`}
            placeholderTextColor={COLORS.inkSoft}
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
              <CloseIcon size={16} color={COLORS.inkSoft} />
            </TouchableOpacity>
          )}
        </View>

        {/* Medicine Categories Carousel (Shown when viewing medicines category) */}
        {isMedicineView && (
          <View style={{ marginBottom: 14 }}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { fontSize: 13.5, marginBottom: 8 }]}>
                Medicine Categories
              </Text>
              {currentCategory !== 'medicines' && (
                <TouchableOpacity onPress={() => openCategory('medicines')}>
                  <Text style={styles.linkText}>All medicines</Text>
                </TouchableOpacity>
              )}
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
                  onPress={() => cat.id === 'vitamins' ? openGroup('vitamins', 'all') : openCategory(cat.id)}
                  width={124}
                  active={currentCategory === cat.id}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={[styles.sectionTitle, { fontSize: 13, color: COLORS.inkSoft, marginBottom: 0 }]}>
            {filteredIds.length} {filteredIds.length === 1 ? 'Product' : 'Products'}
          </Text>
        </View>

        {filteredIds.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
            <SearchIcon size={40} color={COLORS.inkSoft} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.ink, marginBottom: 4, marginTop: 8 }}>
              No products found
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.inkSoft }}>
              Try searching with another name or browse all medicines
            </Text>
          </View>
        ) : (
          <View style={styles.grid2}>
            {filteredIds.map((id) => (
              <View key={id} style={{ width: '48%' }}>
                <ProductCard id={id} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {cartCount > 0 && (
        <TouchableOpacity style={styles.cartBar} onPress={openCart} activeOpacity={0.9}>
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
