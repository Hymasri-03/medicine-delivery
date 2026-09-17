import React, { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../theme/colors';
import { PRODUCTS } from '../data/products';
import { MEDICINE_IMAGES } from '../data/medicineImages';
import { useApp } from '../context/AppContext';
import Icon from '../components/Icon';
import SummaryLine from '../components/SummaryLine';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {
  SearchIcon,
  CloseIcon,
  ChevronDownIcon,
  CouponPercentIcon,
  PrescriptionDocIcon,
} from '../components/UiIcons';

export default function CartScreen() {
  const {
    cart,
    cartCount,
    cartTotal,
    cartHasRx,
    rxUploaded,
    rxFileUri,
    rxFileName,
    rxFileType,
    attachRx,
    removeRx,
    addToCart,
    computeSummary,
    couponApplied,
    toggleCoupon,
    goBack,
    goTo,
    goHome,
    showToast,
  } = useApp();

  const ids = Object.keys(cart).filter((id) => cart[id] > 0);
  const s = computeSummary();

  // State for View Bill Modal
  const [showBillModal, setShowBillModal] = useState(false);

  // State for Quantity Picker Modal
  const [qtyModalItem, setQtyModalItem] = useState<string | null>(null);

  // State for Upload Prescription Action Sheet & Full Preview
  const [showRxModal, setShowRxModal] = useState(false);
  const [showRxPreview, setShowRxPreview] = useState(false);

  // Real Camera Capture from Phone
  const handleCameraCapture = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showToast('Camera permission is required to click prescription photos');
        return;
      }
      setShowRxModal(false);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `Rx_Camera_${Date.now()}.jpg`;
        attachRx(asset.uri, fileName, 'image');
        showToast('Prescription captured from Camera!');
      }
    } catch (err) {
      console.error('Camera capture error:', err);
      showToast('Could not open camera on this device');
    }
  };

  // Real Photo Gallery Picker from Phone
  const handleGalleryPick = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast('Gallery permission is required to choose prescription photos');
        return;
      }
      setShowRxModal(false);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `Rx_Gallery_${Date.now()}.jpg`;
        attachRx(asset.uri, fileName, 'image');
        showToast('Prescription selected from Gallery!');
      }
    } catch (err) {
      console.error('Gallery pick error:', err);
      showToast('Could not open photo gallery');
    }
  };

  // Real Device Document / PDF / File Picker from Phone
  const handleDocumentPick = async () => {
    try {
      setShowRxModal(false);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const isImg = asset.mimeType?.startsWith('image/') || (asset.name && /\.(jpg|jpeg|png|webp)$/i.test(asset.name));
        attachRx(asset.uri, asset.name || 'Prescription_Document.pdf', isImg ? 'image' : 'file');
        showToast('Prescription document attached!');
      }
    } catch (err) {
      console.error('Document pick error:', err);
      showToast('Could not open document picker');
    }
  };

  const handleRemoveRx = () => {
    setShowRxModal(false);
    setShowRxPreview(false);
    removeRx();
    showToast('Prescription removed');
  };

  // Fallback if empty cart
  if (ids.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
        {/* Custom Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 34) : 12,
            paddingBottom: 12,
            backgroundColor: COLORS.card,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.line,
          }}
        >
          <TouchableOpacity
            onPress={goBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 19l-7-7 7-7"
                stroke={COLORS.ink}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.ink, textAlign: 'center', flex: 1 }}>Cart</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: COLORS.greenLight,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Svg width={38} height={38} viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM20 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                fill={COLORS.greenDark}
              />
              <Path
                d="M1 1.5h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6.5H6"
                stroke={COLORS.greenDark}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.ink, marginBottom: 6 }}>
            Your cart is empty
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.inkSoft,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 18,
            }}
          >
            Explore verified medicines, healthcare products and get doorstep delivery.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.greenDark,
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 12,
            }}
            onPress={goHome}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>Browse Medicines</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* ── Top Header Matching OneBuddy Theme ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 34) : 12,
          paddingBottom: 12,
          backgroundColor: COLORS.card,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.line,
        }}
      >
        <TouchableOpacity
          onPress={goBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
          style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 19l-7-7 7-7"
              stroke={COLORS.ink}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.ink, textAlign: 'center', flex: 1 }}>Cart</Text>

        <TouchableOpacity
          onPress={goHome}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: COLORS.greenLight,
            borderWidth: 1,
            borderColor: COLORS.greenBorder,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.7}
        >
          <SearchIcon size={18} color={COLORS.greenDark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Item Count ── */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: '800',
            color: COLORS.ink,
            marginBottom: 12,
          }}
        >
          {cartCount} {cartCount === 1 ? 'item' : 'items'}
        </Text>

        {/* ── Cart Products List ── */}
        {ids.map((id, index) => {
          const p = PRODUCTS[id];
          if (!p) return null;
          const qty = cart[id];
          const mrp = p.mrp ?? p.price;
          const lineTotal = p.price * qty;
          const lineMrp = mrp * qty;
          const pct = mrp > p.price ? Math.round((1 - p.price / mrp) * 100) : 15;
          const localImage = MEDICINE_IMAGES[id];
          const hasSubstitute = index === 1 || !!p.brandGroup;

          return (
            <View
              key={id}
              style={{
                marginBottom: 14,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: hasSubstitute ? '#C084FC' : COLORS.line,
                backgroundColor: COLORS.card,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              {/* Substitute Banner */}
              {hasSubstitute && (
                <View
                  style={{
                    backgroundColor: '#9333EA',
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
                    You saved {pct > 0 ? pct : 47}.0% by choosing Substitute
                  </Text>
                </View>
              )}

              {/* Main Card Body */}
              <View style={{ padding: 14 }}>
                {/* Top Row: Image + Name/Mfg + Delete Button */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: COLORS.line,
                      backgroundColor: '#FFFFFF',
                      padding: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {localImage ? (
                      <Image
                        source={localImage}
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
                      <Icon type={p.icon} size={26} />
                    )}
                  </View>

                  <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <Text
                      style={{
                        fontSize: 14.5,
                        fontWeight: '700',
                        color: COLORS.ink,
                        lineHeight: 19,
                      }}
                      numberOfLines={2}
                    >
                      {p.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: COLORS.inkSoft,
                        marginTop: 3,
                      }}
                      numberOfLines={1}
                    >
                      {p.manufacturer || p.generic || 'USV Pvt Ltd'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => addToCart(id, -qty)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: COLORS.bg,
                      borderWidth: 1,
                      borderColor: COLORS.line,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 13, color: COLORS.inkSoft, fontWeight: '800' }}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Bottom Row: MRP & Price + Quantity Selector */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginTop: 12,
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#94A3B8',
                          textDecorationLine: 'line-through',
                          marginRight: 6,
                        }}
                      >
                        MRP ₹{lineMrp.toFixed(2)}
                      </Text>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.greenDark }}>
                        {pct}% OFF
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: '800',
                          color: COLORS.ink,
                          marginRight: 6,
                        }}
                      >
                        ₹{lineTotal.toFixed(2)}
                      </Text>
                      {qty > 1 && (
                        <Text
                          style={{
                            fontSize: 12,
                            color: COLORS.inkSoft,
                            fontWeight: '600',
                            marginRight: 6,
                          }}
                        >
                          (₹{p.price.toFixed(2)} × {qty})
                        </Text>
                      )}
                      <View
                        style={{
                          backgroundColor: COLORS.greenPale,
                          borderWidth: 1,
                          borderColor: COLORS.greenBorder,
                          paddingVertical: 2.5,
                          paddingHorizontal: 7,
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ fontSize: 11, color: COLORS.greenForest, fontWeight: '600' }}>
                          {p.pack || 'Strip of 10 Units'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Quantity Selector using actual OneBuddy Green palette */}
                  <TouchableOpacity
                    onPress={() => setQtyModalItem(id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: COLORS.greenDark,
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                    }}
                    activeOpacity={0.8}
                  >
                    <View
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 7,
                        minWidth: 42,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.greenDark }}>
                        {qty}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: COLORS.greenDark,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ChevronDownIcon size={12} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Replaced item preview */}
                {hasSubstitute && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: COLORS.bg,
                      padding: 10,
                      borderRadius: 10,
                      marginTop: 12,
                      borderWidth: 1,
                      borderColor: COLORS.line,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          backgroundColor: '#FFFFFF',
                          borderWidth: 1,
                          borderColor: COLORS.line,
                          padding: 2,
                          marginRight: 8,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Image
                          source={
                            MEDICINE_IMAGES['vs-neurobion'] ||
                            require('../../assets/medicines/vs-neurobion.png')
                          }
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 10.5, color: COLORS.inkSoft, fontWeight: '500' }}>
                          Replaced
                        </Text>
                        <Text
                          style={{ fontSize: 12, fontWeight: '700', color: COLORS.ink }}
                          numberOfLines={1}
                        >
                          Neurobion Forte Tablet 30
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => showToast('Switched back to original brand')}
                      activeOpacity={0.7}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text
                        style={{
                          fontSize: 12.5,
                          fontWeight: '800',
                          color: COLORS.greenDark,
                          marginRight: 2,
                        }}
                      >
                        Switch Back
                      </Text>
                      <Text style={{ fontSize: 14, color: COLORS.greenDark, fontWeight: '800' }}>
                        ↻
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {/* ── Add more medicines Link ── */}
        <TouchableOpacity
          onPress={goHome}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            marginTop: 4,
            marginBottom: 10,
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.greenDark }}>
            Add more medicines
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.greenDark }}>+</Text>
        </TouchableOpacity>

        {/* ── Upload a Prescription Card (Real Camera, Gallery & File Integration) ── */}
        <TouchableOpacity
          onPress={() => {
            if (rxUploaded && rxFileType === 'image' && rxFileUri) {
              setShowRxPreview(true);
            } else {
              setShowRxModal(true);
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.card,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: rxUploaded ? COLORS.green : COLORS.line,
            padding: 14,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 3,
            elevation: 1,
          }}
          activeOpacity={0.8}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: rxUploaded ? COLORS.greenLight : '#FFF7ED',
              borderWidth: 1,
              borderColor: rxUploaded ? COLORS.greenBorder : '#FED7AA',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {rxUploaded && rxFileType === 'image' && rxFileUri ? (
              <Image
                source={{ uri: rxFileUri }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : rxUploaded ? (
              <Text style={{ fontSize: 26 }}>📄</Text>
            ) : (
              <PrescriptionDocIcon size={26} color="#EA580C" />
            )}
          </View>

          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.ink }}>
                {rxUploaded ? 'Prescription Attached' : 'Upload a Prescription'}
              </Text>
              {rxUploaded && (
                <View
                  style={{
                    backgroundColor: COLORS.greenLight,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginLeft: 6,
                  }}
                >
                  <Text style={{ fontSize: 10.5, fontWeight: '700', color: COLORS.greenDark }}>
                    Attached
                  </Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 3, lineHeight: 16 }} numberOfLines={1}>
              {rxUploaded
                ? `${rxFileName || 'Prescription file'} (Tap to view or change)`
                : 'Take a photo or upload from Gallery/Files'}
            </Text>
          </View>

          {rxUploaded ? (
            <TouchableOpacity
              onPress={() => setShowRxModal(true)}
              style={{
                backgroundColor: COLORS.greenPale,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: COLORS.greenBorder,
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.greenDark }}>
                Manage
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ fontSize: 20, color: COLORS.inkSoft, fontWeight: '600' }}>›</Text>
          )}
        </TouchableOpacity>

        {/* ── Apply Coupon Card ── */}
        <TouchableOpacity
          onPress={toggleCoupon}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: couponApplied ? COLORS.green : COLORS.line,
            padding: 14,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 3,
            elevation: 1,
          }}
          activeOpacity={0.8}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: couponApplied ? COLORS.greenLight : COLORS.bg,
              borderWidth: 1,
              borderColor: couponApplied ? COLORS.greenBorder : COLORS.line,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CouponPercentIcon size={22} color={couponApplied ? COLORS.greenDark : COLORS.inkSoft} />
          </View>

          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: couponApplied ? COLORS.greenDark : COLORS.ink,
                }}
              >
                {couponApplied ? 'Coupon BUDDY50 Applied' : 'Apply coupon'}
              </Text>
              {couponApplied && (
                <View
                  style={{
                    backgroundColor: COLORS.greenLight,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginLeft: 6,
                  }}
                >
                  <Text style={{ fontSize: 10.5, fontWeight: '700', color: COLORS.greenDark }}>
                    −₹{s.discount.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                fontSize: 12,
                color: couponApplied ? COLORS.greenDark : COLORS.inkSoft,
                marginTop: 2,
              }}
            >
              {couponApplied
                ? `You saved ₹${s.discount.toFixed(2)} on this order (Tap to remove)`
                : 'Save ₹50 with BUDDY50 on medicines'}
            </Text>
          </View>

          <Text style={{ fontSize: 20, color: COLORS.inkSoft, fontWeight: '600' }}>›</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Fixed Bottom Bar ── */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.line,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 24 : 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 8,
        }}
      >
        {/* Left Side: Price & View Bill */}
        <View style={{ flex: 1, marginRight: 10, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 19, fontWeight: '800', color: COLORS.ink }}>
              ₹{s.payable.toFixed(2)}
            </Text>
            {s.savings > 0 && (
              <View
                style={{
                  backgroundColor: COLORS.greenLight,
                  paddingHorizontal: 5,
                  paddingVertical: 1.5,
                  borderRadius: 4,
                  marginLeft: 6,
                }}
              >
                <Text style={{ fontSize: 10.5, fontWeight: '700', color: COLORS.greenDark }}>
                  Saved ₹{s.savings.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setShowBillModal(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.greenDark, marginTop: 2 }}>
              View bill ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Right Side: Primary Green Action Button */}
        <TouchableOpacity
          onPress={() => goTo('details')}
          style={{
            backgroundColor: COLORS.greenDark,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          activeOpacity={0.85}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: 14,
              textAlign: 'center',
            }}
            numberOfLines={1}
          >
            Add delivery details ›
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Prescription Upload Action Sheet Modal ── */}
      <Modal visible={showRxModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowRxModal(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: COLORS.card,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 22,
                  paddingBottom: 32,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.ink }}>
                    Upload Prescription
                  </Text>
                  <TouchableOpacity onPress={() => setShowRxModal(false)}>
                    <CloseIcon size={20} color={COLORS.inkSoft} />
                  </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 20, lineHeight: 18 }}>
                  Attach a clear picture or document of your prescription written by a registered doctor.
                </Text>

                {/* Option 1: Camera (Launches real device camera) */}
                <TouchableOpacity
                  onPress={handleCameraCapture}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: COLORS.bg,
                    borderWidth: 1,
                    borderColor: COLORS.line,
                    marginBottom: 12,
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 26, marginRight: 14 }}>📷</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.ink }}>
                      Camera
                    </Text>
                    <Text style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2 }}>
                      Open phone camera to take a photo of doctor's prescription
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, color: COLORS.greenDark }}>›</Text>
                </TouchableOpacity>

                {/* Option 2: Gallery (Launches real phone photo gallery) */}
                <TouchableOpacity
                  onPress={handleGalleryPick}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: COLORS.bg,
                    borderWidth: 1,
                    borderColor: COLORS.line,
                    marginBottom: 12,
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 26, marginRight: 14 }}>🖼️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.ink }}>
                      Photo Gallery
                    </Text>
                    <Text style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2 }}>
                      Select photo or scan saved in your phone gallery
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, color: COLORS.greenDark }}>›</Text>
                </TouchableOpacity>

                {/* Option 3: Document / PDF (Launches real device file picker) */}
                <TouchableOpacity
                  onPress={handleDocumentPick}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 14,
                    borderRadius: 12,
                    backgroundColor: COLORS.bg,
                    borderWidth: 1,
                    borderColor: COLORS.line,
                    marginBottom: 16,
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 26, marginRight: 14 }}>📁</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.ink }}>
                      Files & PDFs
                    </Text>
                    <Text style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2 }}>
                      Select prescription PDF or document from phone files
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, color: COLORS.greenDark }}>›</Text>
                </TouchableOpacity>

                {rxUploaded && (
                  <TouchableOpacity
                    onPress={handleRemoveRx}
                    style={{
                      paddingVertical: 12,
                      borderRadius: 10,
                      backgroundColor: '#FEE2E2',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#DC2626', fontWeight: '700', fontSize: 14 }}>
                      Remove Attached Prescription
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── Prescription Full Photo Preview Modal ── */}
      <Modal visible={showRxPreview} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.85)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
          }}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 420,
              backgroundColor: COLORS.card,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.line,
              }}
            >
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.ink }} numberOfLines={1}>
                  {rxFileName || 'Doctor Prescription'}
                </Text>
                <Text style={{ fontSize: 11.5, color: COLORS.inkSoft, marginTop: 2 }}>
                  Captured / Selected from phone
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowRxPreview(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <CloseIcon size={20} color={COLORS.inkSoft} />
              </TouchableOpacity>
            </View>

            {rxFileUri ? (
              <View style={{ width: '100%', height: 360, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  source={{ uri: rxFileUri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              </View>
            ) : (
              <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 40, marginBottom: 8 }}>📄</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.ink }}>{rxFileName}</Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', padding: 14, gap: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setShowRxPreview(false);
                  setShowRxModal(true);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: COLORS.bg,
                  borderWidth: 1,
                  borderColor: COLORS.line,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.ink }}>Replace</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleRemoveRx}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: '#FEE2E2',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#DC2626' }}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── View Bill Breakdown Modal ── */}
      <Modal visible={showBillModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowBillModal(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: COLORS.card,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 20,
                  paddingBottom: 28,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.ink }}>
                    Bill Details
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowBillModal(false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <CloseIcon size={20} color={COLORS.inkSoft} />
                  </TouchableOpacity>
                </View>

                {/* Line Items with accurate amounts */}
                <SummaryLine
                  label="Item total (MRP)"
                  value={`₹${s.mrpTotal.toFixed(2)}`}
                />

                <SummaryLine
                  label="Special price discount"
                  value={s.mrpTotal > s.item ? `−₹${(s.mrpTotal - s.item).toFixed(2)}` : '₹0.00'}
                  isGreen={s.mrpTotal > s.item}
                  valueColor={s.mrpTotal > s.item ? COLORS.greenDark : COLORS.inkSoft}
                />

                <SummaryLine
                  label="Packaging & Delivery"
                  value={s.delivery === 0 ? 'FREE (₹0.00)' : `₹${s.delivery.toFixed(2)}`}
                  isGreen={s.delivery === 0}
                  valueColor={s.delivery === 0 ? COLORS.greenDark : COLORS.ink}
                />

                <SummaryLine
                  label={couponApplied ? "Coupon discount (BUDDY50)" : "Coupon discount"}
                  value={s.discount > 0 ? `−₹${s.discount.toFixed(2)}` : '₹0.00'}
                  isGreen={s.discount > 0}
                  valueColor={s.discount > 0 ? COLORS.greenDark : COLORS.inkSoft}
                />

                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: COLORS.line,
                    marginVertical: 10,
                  }}
                />

                <SummaryLine
                  label="To pay"
                  value={`₹${s.payable.toFixed(2)}`}
                  total
                />

                {/* Savings Callout */}
                {s.savings > 0 && (
                  <View
                    style={{
                      backgroundColor: COLORS.greenLight,
                      borderRadius: 12,
                      padding: 12,
                      marginTop: 14,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: COLORS.greenBorder,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.greenForest }}>
                      🎉 You saved ₹{s.savings.toFixed(2)} on this order!
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.greenDark,
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                    marginTop: 16,
                  }}
                  onPress={() => setShowBillModal(false)}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 15 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── Quantity Selector Modal ── */}
      <Modal visible={!!qtyModalItem} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setQtyModalItem(null)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.45)',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: '90%',
                  backgroundColor: COLORS.card,
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: COLORS.line,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.ink }}>
                    Select Quantity
                  </Text>
                  <TouchableOpacity onPress={() => setQtyModalItem(null)}>
                    <CloseIcon size={18} color={COLORS.inkSoft} />
                  </TouchableOpacity>
                </View>

                <Text
                  style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 16 }}
                  numberOfLines={1}
                >
                  {qtyModalItem && PRODUCTS[qtyModalItem]?.name}
                </Text>

                {/* 1-10 Grid buttons */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isSelected = qtyModalItem ? cart[qtyModalItem] === num : false;
                    return (
                      <TouchableOpacity
                        key={num}
                        onPress={() => {
                          if (qtyModalItem) {
                            const delta = num - (cart[qtyModalItem] || 0);
                            addToCart(qtyModalItem, delta);
                          }
                          setQtyModalItem(null);
                        }}
                        style={{
                          width: '17%',
                          aspectRatio: 1,
                          borderRadius: 10,
                          backgroundColor: isSelected ? COLORS.greenDark : COLORS.bg,
                          borderWidth: 1,
                          borderColor: isSelected ? COLORS.greenDark : COLORS.line,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '700',
                            color: isSelected ? '#FFFFFF' : COLORS.ink,
                          }}
                        >
                          {num}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Delete / Remove Option */}
                <TouchableOpacity
                  onPress={() => {
                    if (qtyModalItem) {
                      addToCart(qtyModalItem, -cart[qtyModalItem]);
                    }
                    setQtyModalItem(null);
                  }}
                  style={{
                    marginTop: 16,
                    paddingVertical: 12,
                    borderRadius: 10,
                    backgroundColor: '#FEE2E2',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#DC2626' }}>
                    Remove from Cart
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
