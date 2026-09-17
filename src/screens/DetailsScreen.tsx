import React, { useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from '../theme/styles';
import { COLORS } from '../theme/colors';
import { PayMethod } from '../types';
import { useApp } from '../context/AppContext';
import HeaderBar from '../components/HeaderBar';
import Field from '../components/Field';
import SummaryLine from '../components/SummaryLine';
import { UpiPayIcon, CardPayIcon, NetBankingIcon } from '../components/UiIcons';
import {
  VisaLogo,
  MastercardLogo,
  RuPayLogo,
  HdfcBankLogo,
  SbiBankLogo,
  IciciBankLogo,
  AxisBankLogo,
  KotakBankLogo,
} from '../components/PaymentLogos';

const UPI_LOGOS = {
  gpay: require('../../assets/upi/gpay.png'),
  phonepe: require('../../assets/upi/phonepe.png'),
  paytm: require('../../assets/upi/paytm.png'),
  bhim: require('../../assets/upi/bhim.png'),
};

export default function DetailsScreen() {
  const {
    computeSummary,
    payMethod,
    setPayMethod,
    couponApplied,
    toggleCoupon,
    placeOrder,
    goBack,
    goTo,
    showToast,
  } = useApp();

  const s = computeSummary();

  // Sub-method states
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>(
    'phonepe'
  );
  const [upiId, setUpiId] = useState('');
  const [selectedCardType, setSelectedCardType] = useState<'visa' | 'mastercard' | 'rupay'>('visa');
  const [cardNumber, setCardNumber] = useState('4532 8219 0421 8820');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('842');
  const [selectedBank, setSelectedBank] = useState<'hdfc' | 'sbi' | 'icici' | 'axis' | 'kotak'>(
    'hdfc'
  );

  return (
    <View style={[styles.screen, { backgroundColor: COLORS.bg }]}>
      <HeaderBar
        title="Patient & payment"
        sub="Who is this order for?"
        onBack={goBack}
        onHelp={() => goTo('help')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 28, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <Field label="Full name" defaultValue="Aarav Sharma" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Field label="Age" defaultValue="34" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Gender" defaultValue="Male" />
          </View>
        </View>
        <Field label="Phone number" defaultValue="+91 98765 43210" />
        <Field label="Delivery address" defaultValue="Flat 402, Jubilee Residency, Hyderabad" />

        {/* ── Payment Methods Section ── */}
        <Text style={[styles.sectionTitle, { marginTop: 18, marginBottom: 10 }]}>
          Payment method
        </Text>

        {/* ── 1. UPI Payment Option ── */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: payMethod === 'upi' ? COLORS.greenDark : COLORS.line,
            marginBottom: 12,
            overflow: 'hidden',
          }}
        >
          <TouchableOpacity
            style={[
              styles.payOption,
              {
                marginBottom: 0,
                borderWidth: 0,
                backgroundColor: payMethod === 'upi' ? COLORS.greenPale : COLORS.card,
              },
            ]}
            onPress={() => setPayMethod('upi')}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: payMethod === 'upi' ? COLORS.greenLight : COLORS.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <UpiPayIcon size={22} color={payMethod === 'upi' ? COLORS.greenDark : COLORS.ink} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.payLabel}>UPI (Instant & Free)</Text>
              <Text style={styles.paySub}>Pay via PhonePe, Google Pay, Paytm & BHIM</Text>
            </View>

            <View
              style={[
                styles.radioDot,
                payMethod === 'upi' && {
                  borderColor: COLORS.greenDark,
                  backgroundColor: COLORS.greenDark,
                },
              ]}
            />
          </TouchableOpacity>

          {/* Sub-row: Real User-Uploaded UPI App Logos */}
          {payMethod === 'upi' && (
            <View
              style={{
                paddingHorizontal: 14,
                paddingBottom: 14,
                paddingTop: 8,
                backgroundColor: COLORS.greenPale,
                borderTopWidth: 1,
                borderTopColor: COLORS.greenBorder,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: COLORS.greenForest,
                  marginBottom: 10,
                }}
              >
                Choose UPI App:
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                {/* PhonePe */}
                <TouchableOpacity
                  onPress={() => setSelectedUpiApp('phonepe')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.card,
                    paddingVertical: 10,
                    paddingHorizontal: 4,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: selectedUpiApp === 'phonepe' ? COLORS.greenDark : COLORS.line,
                  }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={UPI_LOGOS.phonepe}
                    style={{ width: 44, height: 44 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: selectedUpiApp === 'phonepe' ? COLORS.greenDark : COLORS.ink,
                      marginTop: 4,
                    }}
                  >
                    PhonePe
                  </Text>
                </TouchableOpacity>

                {/* Google Pay */}
                <TouchableOpacity
                  onPress={() => setSelectedUpiApp('gpay')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.card,
                    paddingVertical: 10,
                    paddingHorizontal: 4,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: selectedUpiApp === 'gpay' ? COLORS.greenDark : COLORS.line,
                  }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={UPI_LOGOS.gpay}
                    style={{ width: 44, height: 44 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: selectedUpiApp === 'gpay' ? COLORS.greenDark : COLORS.ink,
                      marginTop: 4,
                    }}
                  >
                    Google Pay
                  </Text>
                </TouchableOpacity>

                {/* Paytm */}
                <TouchableOpacity
                  onPress={() => setSelectedUpiApp('paytm')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.card,
                    paddingVertical: 10,
                    paddingHorizontal: 4,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: selectedUpiApp === 'paytm' ? COLORS.greenDark : COLORS.line,
                  }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={UPI_LOGOS.paytm}
                    style={{ width: 44, height: 44 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: selectedUpiApp === 'paytm' ? COLORS.greenDark : COLORS.ink,
                      marginTop: 4,
                    }}
                  >
                    Paytm
                  </Text>
                </TouchableOpacity>

                {/* BHIM UPI */}
                <TouchableOpacity
                  onPress={() => setSelectedUpiApp('bhim')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.card,
                    paddingVertical: 10,
                    paddingHorizontal: 4,
                    borderRadius: 12,
                    borderWidth: 1.5,
                    borderColor: selectedUpiApp === 'bhim' ? COLORS.greenDark : COLORS.line,
                  }}
                  activeOpacity={0.8}
                >
                  <Image
                    source={UPI_LOGOS.bhim}
                    style={{ width: 44, height: 44 }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: selectedUpiApp === 'bhim' ? COLORS.greenDark : COLORS.ink,
                      marginTop: 4,
                    }}
                  >
                    BHIM UPI
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Custom UPI ID Input */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.card,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: COLORS.line,
                  paddingHorizontal: 12,
                  marginTop: 12,
                }}
              >
                <TextInput
                  placeholder="Or enter UPI ID (e.g. yourname@upi)"
                  placeholderTextColor={COLORS.inkSoft}
                  value={upiId}
                  onChangeText={setUpiId}
                  style={{
                    flex: 1,
                    paddingVertical: 9,
                    fontSize: 12.5,
                    color: COLORS.ink,
                  }}
                />
                <TouchableOpacity
                  onPress={() => showToast(upiId ? 'UPI ID verified' : 'Enter valid UPI ID')}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.greenDark }}>
                    Verify
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* ── 2. Card Payment Option ── */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: payMethod === 'card' ? COLORS.greenDark : COLORS.line,
            marginBottom: 12,
            overflow: 'hidden',
          }}
        >
          <TouchableOpacity
            style={[
              styles.payOption,
              {
                marginBottom: 0,
                borderWidth: 0,
                backgroundColor: payMethod === 'card' ? COLORS.greenPale : COLORS.card,
              },
            ]}
            onPress={() => setPayMethod('card')}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: payMethod === 'card' ? COLORS.greenLight : COLORS.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <CardPayIcon size={22} color={payMethod === 'card' ? COLORS.greenDark : COLORS.ink} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.payLabel}>Credit or Debit Card</Text>
              <Text style={styles.paySub}>Visa, Mastercard, RuPay & more</Text>
            </View>

            <View
              style={[
                styles.radioDot,
                payMethod === 'card' && {
                  borderColor: COLORS.greenDark,
                  backgroundColor: COLORS.greenDark,
                },
              ]}
            />
          </TouchableOpacity>

          {/* Sub-row: Card Logos & Inputs */}
          {payMethod === 'card' && (
            <View
              style={{
                paddingHorizontal: 14,
                paddingBottom: 14,
                paddingTop: 8,
                backgroundColor: COLORS.greenPale,
                borderTopWidth: 1,
                borderTopColor: COLORS.greenBorder,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: COLORS.greenForest,
                  marginBottom: 8,
                }}
              >
                Supported Networks:
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() => setSelectedCardType('visa')}
                  style={{
                    padding: 4,
                    borderRadius: 8,
                    borderWidth: 1.5,
                    borderColor: selectedCardType === 'visa' ? COLORS.greenDark : COLORS.line,
                    backgroundColor: COLORS.card,
                  }}
                >
                  <VisaLogo size={34} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedCardType('mastercard')}
                  style={{
                    padding: 4,
                    borderRadius: 8,
                    borderWidth: 1.5,
                    borderColor: selectedCardType === 'mastercard' ? COLORS.greenDark : COLORS.line,
                    backgroundColor: COLORS.card,
                  }}
                >
                  <MastercardLogo size={34} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedCardType('rupay')}
                  style={{
                    padding: 4,
                    borderRadius: 8,
                    borderWidth: 1.5,
                    borderColor: selectedCardType === 'rupay' ? COLORS.greenDark : COLORS.line,
                    backgroundColor: COLORS.card,
                  }}
                >
                  <RuPayLogo size={34} />
                </TouchableOpacity>
              </View>

              {/* Card Inputs */}
              <View
                style={{
                  backgroundColor: COLORS.card,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: COLORS.line,
                  padding: 12,
                }}
              >
                <Text style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 2 }}>
                  Card Number
                </Text>
                <TextInput
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: COLORS.ink,
                    marginBottom: 10,
                    paddingVertical: 2,
                  }}
                />

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 2 }}>
                      Expiry Date
                    </Text>
                    <TextInput
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: COLORS.ink,
                        paddingVertical: 2,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, color: COLORS.inkSoft, marginBottom: 2 }}>CVV</Text>
                    <TextInput
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      secureTextEntry
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: COLORS.ink,
                        paddingVertical: 2,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* ── 3. Net Banking Option ── */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: payMethod === 'netbanking' ? COLORS.greenDark : COLORS.line,
            marginBottom: 14,
            overflow: 'hidden',
          }}
        >
          <TouchableOpacity
            style={[
              styles.payOption,
              {
                marginBottom: 0,
                borderWidth: 0,
                backgroundColor: payMethod === 'netbanking' ? COLORS.greenPale : COLORS.card,
              },
            ]}
            onPress={() => setPayMethod('netbanking')}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: payMethod === 'netbanking' ? COLORS.greenLight : COLORS.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <NetBankingIcon
                size={22}
                color={payMethod === 'netbanking' ? COLORS.greenDark : COLORS.ink}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.payLabel}>Net Banking</Text>
              <Text style={styles.paySub}>All major Indian banks with instant confirmation</Text>
            </View>

            <View
              style={[
                styles.radioDot,
                payMethod === 'netbanking' && {
                  borderColor: COLORS.greenDark,
                  backgroundColor: COLORS.greenDark,
                },
              ]}
            />
          </TouchableOpacity>

          {/* Sub-row: Bank Logos */}
          {payMethod === 'netbanking' && (
            <View
              style={{
                paddingHorizontal: 14,
                paddingBottom: 14,
                paddingTop: 8,
                backgroundColor: COLORS.greenPale,
                borderTopWidth: 1,
                borderTopColor: COLORS.greenBorder,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: COLORS.greenForest,
                  marginBottom: 10,
                }}
              >
                Popular Banks:
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 6 }}>
                {/* HDFC */}
                <TouchableOpacity
                  onPress={() => setSelectedBank('hdfc')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: COLORS.card,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: selectedBank === 'hdfc' ? COLORS.greenDark : COLORS.line,
                  }}
                  activeOpacity={0.8}
                >
                  <HdfcBankLogo size={28} />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: selectedBank === 'hdfc' ? COLORS.greenDark : COLORS.ink,
                      marginTop: 4,
                    }}
                  >
                    HDFC
                  </Text>
                </TouchableOpacity>

                {/* SBI */}
                <TouchableOpacity
                  onPress={() => setSelectedBank('sbi')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: COLORS.card,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: selectedBank === 'sbi' ? COLORS.greenDark : COLORS.line,
                  }}
                  activeOpacity={0.8}
                >
                  <SbiBankLogo size={28} />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: selectedBank === 'sbi' ? COLORS.greenDark : COLORS.ink,
                      marginTop: 4,
                    }}
                  >
                    SBI
                  </Text>
                </TouchableOpacity>

                {/* ICICI */}
                <TouchableOpacity
                  onPress={() => setSelectedBank('icici')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: COLORS.card,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: selectedBank === 'icici' ? COLORS.greenDark : COLORS.line,
                  }}
                  activeOpacity={0.8}
                >
                  <IciciBankLogo size={28} />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: selectedBank === 'icici' ? COLORS.greenDark : COLORS.ink,
                      marginTop: 4,
                    }}
                  >
                    ICICI
                  </Text>
                </TouchableOpacity>

                {/* Axis */}
                <TouchableOpacity
                  onPress={() => setSelectedBank('axis')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: COLORS.card,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: selectedBank === 'axis' ? COLORS.greenDark : COLORS.line,
                  }}
                  activeOpacity={0.8}
                >
                  <AxisBankLogo size={28} />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: selectedBank === 'axis' ? COLORS.greenDark : COLORS.ink,
                      marginTop: 4,
                    }}
                  >
                    Axis
                  </Text>
                </TouchableOpacity>

                {/* Kotak */}
                <TouchableOpacity
                  onPress={() => setSelectedBank('kotak')}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: COLORS.card,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: selectedBank === 'kotak' ? COLORS.greenDark : COLORS.line,
                  }}
                  activeOpacity={0.8}
                >
                  <KotakBankLogo size={28} />
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '700',
                      color: selectedBank === 'kotak' ? COLORS.greenDark : COLORS.ink,
                      marginTop: 4,
                    }}
                  >
                    Kotak
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* ── Order Summary (Styling matching Cart Page) ── */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: COLORS.line,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 3,
            elevation: 1,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '800',
              color: COLORS.ink,
              marginBottom: 12,
            }}
          >
            Order summary
          </Text>

          {/* Item Total MRP */}
          <SummaryLine
            label="Item total (MRP)"
            value={`₹${s.mrpTotal.toFixed(2)}`}
          />

          {/* Special Price Discount - Shows 0.00 if none */}
          <SummaryLine
            label="Special price discount"
            value={s.mrpTotal > s.item ? `−₹${(s.mrpTotal - s.item).toFixed(2)}` : '₹0.00'}
            isGreen={s.mrpTotal > s.item}
            valueColor={s.mrpTotal > s.item ? COLORS.greenDark : COLORS.inkSoft}
          />

          {/* Packaging & Delivery - Clearly visible with label and bold amount */}
          <SummaryLine
            label="Packaging & Delivery"
            value={s.delivery === 0 ? 'FREE (₹0.00)' : `₹${s.delivery.toFixed(2)}`}
            isGreen={s.delivery === 0}
            valueColor={s.delivery === 0 ? COLORS.greenDark : COLORS.ink}
          />

          {/* Coupon Discount - Clean SummaryLine without red remove text */}
          <SummaryLine
            label={couponApplied ? "Coupon discount (BUDDY50)" : "Coupon discount"}
            value={couponApplied && s.discount > 0 ? `−₹${s.discount.toFixed(2)}` : '₹0.00'}
            isGreen={couponApplied && s.discount > 0}
            valueColor={couponApplied && s.discount > 0 ? COLORS.greenDark : COLORS.inkSoft}
          />

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: COLORS.line,
              marginVertical: 8,
            }}
          />

          {/* Total Payable */}
          <SummaryLine
            label="To pay"
            value={`₹${s.payable.toFixed(2)}`}
            total
          />

          {/* Savings Banner */}
          {s.savings > 0 && (
            <View
              style={{
                backgroundColor: COLORS.greenLight,
                borderRadius: 10,
                padding: 10,
                marginTop: 12,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: COLORS.greenBorder,
              }}
            >
              <Text style={{ fontSize: 12.5, fontWeight: '800', color: COLORS.greenForest }}>
                🎉 You are saving ₹{s.savings.toFixed(2)} on this order
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Button ── */}
      <View style={[styles.bottomDock, { backgroundColor: COLORS.card, borderTopColor: COLORS.line, paddingBottom: Platform.OS === 'ios' ? 24 : 16 }]}>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: COLORS.greenDark }]}
          onPress={placeOrder}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Place order · ₹{s.payable.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
