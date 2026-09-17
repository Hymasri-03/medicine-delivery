import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

interface OneBuddyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function OneBuddyLogo({ size = 'md' }: OneBuddyLogoProps) {
  const titleSize = size === 'sm' ? 20 : size === 'lg' ? 26 : 22;
  const subSize = size === 'sm' ? 12 : size === 'lg' ? 15 : 13.5;

  return (
    <View style={styles.container}>
      {/* Brand Name: OneBuddy without logo image */}
      <View style={styles.brandRow}>
        <Text style={[styles.brandOne, { fontSize: titleSize }]}>One</Text>
        <Text style={[styles.brandBuddy, { fontSize: titleSize }]}>Buddy</Text>
      </View>
      {/* Followed by Medicine Delivery in black color */}
      <Text style={[styles.deliveryText, { fontSize: subSize }]}>
        Medicine Delivery
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandOne: {
    fontWeight: '800',
    color: COLORS.ink,
    letterSpacing: -0.5,
  },
  brandBuddy: {
    fontWeight: '900',
    color: COLORS.green,
    letterSpacing: -0.5,
  },
  deliveryText: {
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
});
