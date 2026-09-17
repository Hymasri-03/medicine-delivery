import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../theme/styles';
import { PRODUCTS } from '../data/products';
import { MEDICINE_IMAGES } from '../data/medicineImages';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';
import Icon from '../components/Icon';

export default function ProductScreen() {
  const { currentProduct, cart, addToCart, openProduct, cartCount, cartTotal, goBack, goTo, openCart } = useApp();
  const [heroImgError, setHeroImgError] = useState(false);

  if (!currentProduct) return null;
  const id = currentProduct;
  const p = PRODUCTS[id];
  const mrp = p.mrp ?? p.price;
  const localImage = MEDICINE_IMAGES[id];

  const brandAlts = p.brandGroup
    ? Object.keys(PRODUCTS).filter((pid) => pid !== id && PRODUCTS[pid].brandGroup === p.brandGroup)
    : [];
  const similarIds = brandAlts.length
    ? brandAlts
    : Object.keys(PRODUCTS)
        .filter((pid) => pid !== id && p.category && PRODUCTS[pid].category === p.category)
        .slice(0, 3);
  const similarTitle = brandAlts.length ? 'Same formula, other brands' : 'Similar products';
  const qty = cart[id] || 0;

  return (
    <View style={styles.screen}>
      <HeaderBar title="Product details" onBack={goBack} onHelp={() => goTo('help')} onCart={openCart} cartCount={cartCount} />

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={[styles.pdHero, { backgroundColor: '#FFFFFF' }]}>
          {localImage ? (
            <Image
              source={localImage}
              style={styles.pdHeroPhoto}
              resizeMode="contain"
            />
          ) : p.image && !heroImgError ? (
            <Image
              source={{ uri: p.image }}
              style={styles.pdHeroPhoto}
              resizeMode="cover"
              onError={() => setHeroImgError(true)}
            />
          ) : (
            <Icon type={p.icon} size={60} />
          )}
        </View>
        {p.rx && <Text style={styles.pdRxTag}>Prescription required</Text>}
        <Text style={styles.pdName}>{p.name}</Text>
        <Text style={styles.pdGeneric}>{p.manufacturer || p.generic}</Text>
        <View style={styles.pdPriceRow}>
          <Text style={styles.pdPrice}>₹{p.price}</Text>
          {mrp > p.price && <Text style={styles.pcardStrike}>₹{mrp}</Text>}
        </View>
        <Text style={styles.pdDesc}>{p.desc}</Text>

        {similarIds.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{similarTitle}</Text>
            {similarIds.map((sid) => {
              const sp = PRODUCTS[sid];
              return (
                <TouchableOpacity key={sid} style={styles.similarRow} onPress={() => openProduct(sid)}>
                  <View style={[styles.similarImg, { overflow: 'hidden', backgroundColor: '#FFFFFF' }]}>
                    {MEDICINE_IMAGES[sid] ? (
                      <Image
                        source={MEDICINE_IMAGES[sid]}
                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                        resizeMode="contain"
                      />
                    ) : sp.image ? (
                      <Image
                        source={{ uri: sp.image }}
                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Icon type={sp.icon} size={18} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.similarName}>{sp.name}</Text>
                    <Text style={styles.similarMeta}>{sp.generic || sp.manufacturer}</Text>
                  </View>
                  <Text style={styles.pdPrice}>₹{sp.price}</Text>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      <View style={styles.bottomDock}>
        {qty === 0 ? (
          <TouchableOpacity style={styles.primaryBtn} onPress={() => addToCart(id, 1)}>
            <Text style={styles.primaryBtnText}>Add to cart · ₹{p.price.toFixed(2)}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.dockSplit}>
            <View style={styles.qtyStepperLg}>
              <TouchableOpacity onPress={() => addToCart(id, -1)} hitSlop={8}>
                <Text style={styles.qtyStepperLgBtn}>–</Text>
              </TouchableOpacity>
              <Text style={styles.qtyStepperLgVal}>{qty}</Text>
              <TouchableOpacity onPress={() => addToCart(id, 1)} hitSlop={8}>
                <Text style={styles.qtyStepperLgBtn}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={openCart}>
              <Text style={styles.primaryBtnText}>Go to cart · ₹{cartTotal.toFixed(2)}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
