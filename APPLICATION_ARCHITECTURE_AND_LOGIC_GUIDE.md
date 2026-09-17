# OneBuddy Medicine Delivery Application: Architectural, Functional & Logic Specification

---

## 1. Executive Architecture & System Design

### 1.1 Technology Stack & Foundation
- **Framework**: React Native with Expo (TypeScript).
- **Styling Architecture**: Vanilla React Native `StyleSheet` with platform-specific safe area handling and tailored design tokens in `src/theme/colors.ts` and `src/theme/styles.ts`.
- **State Management**: Centralized React Context pattern implemented in `src/context/AppContext.tsx`.
- **Navigation Architecture**: Custom stack-based navigation engine (`navHistory`) paired with `src/navigation/RootNavigator.tsx`.
- **Hardware Integration**: React Native `BackHandler` integration for Android system gestures and hardware back buttons.

```
┌──────────────────────────────────────────────────────────┐
│                   App.tsx (Entry Point)                  │
│                             │                            │
│                     <AppProvider>                        │
│          (Central State, Nav Stack, Calculations)        │
│                             │                            │
│                    <RootNavigator>                       │
│    (Switches View based on currentNav.screen state)      │
└──────────────┬────────────────────────────┬──────────────┘
               │                            │
    ┌──────────▼──────────┐      ┌──────────▼──────────┐
    │  Shopping Flow      │      │  User & Support     │
    │  - BrowseScreen     │      │  - OrdersScreen     │
    │  - CategoryScreen   │      │  - AccountScreen    │
    │  - GroupCategory    │      │  - HelpScreen       │
    │  - ProductScreen    │      └─────────────────────┘
    │  - CartScreen       │
    │  - DetailsScreen    │
    │  - ConfirmScreen    │
    └─────────────────────┘
```

---

## 2. Core State Management: AppContext.tsx

The file `src/context/AppContext.tsx` acts as the single source of truth for the entire application. It eliminates state divergence across disparate screens.

### 2.1 Navigation Stack Engine (`navHistory`)
```typescript
export interface NavEntry {
  screen: Screen;
  product?: string | null;
  category?: string;
  group?: string;
  subcat?: string;
}
```
- **How it Works**: Navigation is maintained as an array of `NavEntry` objects (`navHistory`). The active page is always the top-of-stack entry (`navHistory[navHistory.length - 1]`).
- **Why it was Written This Way**: Traditional third-party navigators introduce heavy overhead, nested route parameter boilerplate, and synchronization latency on web/mobile hybrid platforms. This lightweight custom stack guarantees instantaneous transitions, deterministic history rewinding, and retains contextual hierarchy (e.g. which category or subcategory was opened prior to viewing a product).
- **Actions**:
  - `goTo(screen)`: Pushes a new entry onto the stack while preserving parent metadata (`category`, `group`, `subcat`).
  - `goBack()`: Slices the last entry off the stack (`prev.slice(0, -1)`). If only 1 entry remains, it preserves the root `browse` screen to avoid black-screen crashes.
  - `goHome()`: Clears history and resets to `[{ screen: 'browse' }]`.
- **Hardware Back Handler**:
  ```typescript
  useEffect(() => {
    const onBackPress = () => {
      if (navHistory.length > 1) {
        goBack();
        return true; // Prevents default OS app exit
      }
      return false; // Allows default OS exit when on root screen
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [navHistory.length, goBack]);
  ```

---

### 2.2 Cart Engine & Pricing Logic (`computeSummary`)

The calculation engine is centralized in `computeSummary(customTotal?: number): Summary`.

```typescript
// Core pricing formula
mrpTotal = Σ (p.mrp * qty)
itemTotal = Σ (p.price * qty)
delivery = 0 (Packaging & Delivery is FREE ₹0.00)
discount = couponApplied && itemTotal > 0 ? Math.min(50, itemTotal) : 0
productSavings = max(0, mrpTotal - itemTotal)
totalSavings = productSavings + discount
payable = max(0, itemTotal + delivery - discount)
```

#### Why it is written this way:
1. **Zero Mismatch Guarantee**: Every product card calculates `lineTotal = p.price * qty`. Because `computeSummary` uses the exact same `p.price * qty` accumulation without arbitrary delivery surcharges, the sum of card amounts on the Cart page **strictly equals** the bottom view amount and the payment amount.
2. **Deterministic Rounding**: All outputs use `Math.round(val * 100) / 100` to eliminate IEEE-754 floating-point rounding errors (e.g. preventing `₹488.50000000000006`).
3. **Fail-Safe Coupon Logic**: `Math.min(50, itemTotal)` prevents negative balances if an order total is less than the coupon discount.

---

## 3. Detailed Screen Specifications

---

### Page 1: BrowseScreen.tsx (Home & Discovery)

`src/screens/BrowseScreen.tsx` serves as the main storefront and discovery hub.

#### 1. Top Brand Bar & Live Cart Indicator
- **Components**: `OneBuddyLogo.tsx`, Cart button with badge counter.
- **Logic**: If `cartCount > 0`, an absolute-positioned green pill badge displays `{cartCount}`. Clicking the cart icon invokes `openCart()`.

#### 2. Live Catalog Search Engine
- **Logic**:
  ```typescript
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
  ```
- **Behavior**: When the user enters text in the search bar, `isSearching` becomes `true`. The normal scroll content is conditionally replaced by live search results with instant highlighting. A clear icon (`✕`) resets the input.

#### 3. Delivery Location Selector
- **Components**: `LocationPickerModal.tsx`.
- **Behavior**: Clicking on the location banner opens a modal listing verified service sectors (e.g., Jubilee Hills, Madhapur, Gachibowli, Banjara Hills). Selecting a location updates `deliveryLocation` in `AppContext` and displays a toast notification.

#### 4. Medicine Categories Grid
- **Source**: `src/data/medicineCategories.ts`.
- **Logic**: Displays the 10 curated medicine categories (Fever & Pain, Cold & Allergy, Acidity, Vitamins, Baby Care, Women's Care, etc.). Clicking any category card invokes `openCategory(cat.id)`, redirecting to `CategoryScreen.tsx`.

#### 5. Health Conditions Horizontal Carousel
- **Source**: `src/data/groups.ts`.
- **Logic**: Highlights chronic care and specific health conditions (Cardiac Care, Diabetes Care, Joint & Bone, Liver Health, Eye Care). Clicking a condition invokes `openGroup(groupId, subId)`.

#### 6. Floating Cart Dock (`cartBar`)
- **Condition**: `cartCount > 0`.
- **Display**: Displays `{cartCount} items · ₹{cartTotal.toFixed(2)}` and a direct `View cart →` button.

#### 7. Bottom 4-Tab Navigation (`bottomNav`)
- **Tabs**: `Home`, `Categories`, `My Orders`, `Account`.
- **Component**: `FooterIcon.tsx`.
- **Logic**: Vector SVG icons highlight in `#15803D` (active) or `#6B7280` (inactive) without image pixelation.

---

### Page 2: CategoryScreen.tsx (Category Listing)

`src/screens/CategoryScreen.tsx` displays products belonging to a selected category.

#### 1. Header & Scoped Search
- **Header**: Custom `HeaderBar.tsx` with dynamic title and subtitle sourced from `CATEGORY_META`.
- **In-Category Search Filter**: Filters specifically within the active category's products:
  ```typescript
  const filteredIds = useMemo(() => {
    if (!query.trim()) return ids;
    const q = query.toLowerCase().trim();
    return ids.filter((id) => PRODUCTS[id].name.toLowerCase().includes(q) || ...);
  }, [ids, query]);
  ```

#### 2. Horizontal Medicine Category Sub-Strip
- **Condition**: Visible whenever viewing medicine categories (`isMedicineView`).
- **Behavior**: Allows fast horizontal hopping between medicine categories without going back to the home screen.

#### 3. Product Grid Display
- **Layout**: 2-column responsive layout (`width: '48%'`) rendering `ProductCard.tsx`.
- **Product Card Logic**:
  - Image fallback: `MEDICINE_IMAGES[id] -> product.image -> SVG Icon`.
  - Add Button / Quantity Stepper:
    - If `qty === 0`: Shows `+ Add` button.
    - If `qty > 0`: Displays interactive `–`, `{qty}`, `+` controls.

---

### Page 3: GroupCategoryScreen.tsx (Sub-Category & Health Condition)

`src/screens/GroupCategoryScreen.tsx` handles deep-dive sub-categories (e.g. Vitamins broken down into Vitamin D, Multivitamins, Iron, Calcium, Vitamin C).

#### 1. Circular Avatar Subtab Carousel
- **Components**: Horizontal strip of circular pills with real medicine images and icon fallbacks.
- **Logic**:
  - Clicking any subtab updates `currentSubcat` in `AppContext`.
  - The active subtab displays a highlighted green ring (`COLORS.green`).
  - Products re-render instantly based on `productsInGroupSubcat(currentGroup, currentSubcat)`.

---

### Page 4: ProductScreen.tsx (Product Details & Substitutes)

`src/screens/ProductScreen.tsx` provides comprehensive details for an individual product.

#### 1. Product Hero & Verification Attributes
- **High-Resolution Photo**: Renders high-resolution asset from `medicineImages.ts`.
- **Rx Badge**: If `p.rx === true`, renders `"Prescription required"`.
- **Pricing**: Shows Unit Selling Price `₹{p.price.toFixed(2)}` and crossed-out MRP `₹{mrp.toFixed(2)}`.

#### 2. Same-Formula Alternative Brand Engine
- **Logic**:
  ```typescript
  const brandAlts = p.brandGroup
    ? Object.keys(PRODUCTS).filter((pid) => pid !== id && PRODUCTS[pid].brandGroup === p.brandGroup)
    : [];
  ```
- **Why it was Written This Way**: In Indian healthcare, identical active pharmaceutical ingredients (generic salts) are marketed under different brand names at varying prices. If a product shares a `brandGroup` (e.g., Paracetamol 650mg salt), the system surfaces cost-saving substitutes (e.g., Dolo vs Calpol vs Crocin) directly on the product screen.

#### 3. Bottom Action Dock
- If `qty === 0`: Full-width `"Add to cart · ₹{p.price.toFixed(2)}"`.
- If `qty > 0`: Split dock with stepper (`– {qty} +`) and `"Go to cart · ₹{cartTotal.toFixed(2)}"`.

---

### Page 5: CartScreen.tsx (Cart, Prescriptions & Bill Sheet)

`src/screens/CartScreen.tsx` manages basket items, doctor prescription attachments, coupons, and pricing transparency.

#### 1. Empty State Guard
- If `ids.length === 0`: Renders an empty cart illustration with a `"Browse Medicines"` button directing to `goHome()`.

#### 2. Item Cards & Price Multiplication
- **Formulas**:
  - `lineTotal = p.price * qty`
  - `lineMrp = mrp * qty`
- **Visual Display**:
  - Main price: `₹{lineTotal.toFixed(2)}`
  - When `qty > 1`: Shows `(₹{p.price.toFixed(2)} × {qty})` so users clearly understand both unit rate and line total.
  - Quantity Selector: Tapping the green quantity button opens a modal allowing direct selection from 1 to 10 or removing the item.

#### 3. Substitute Savings Banner
- **Condition**: `hasSubstitute && (index === 1 || !!p.brandGroup)`.
- **UI**: Purple banner showing `"You saved X% by choosing Substitute"`, with a `"Switch Back ↻"` button to toggle between generic and branded alternatives.

#### 4. Prescription Upload Action Sheet Modal
- **Trigger**: Tapping the `"Upload a Prescription"` card opens a bottom modal sheet.
- **Options**:
  - **Camera**: Simulates photo capture (`Camera_Photo_Rx_Scan.jpg`).
  - **Photo Gallery**: Simulates gallery selection (`Prescription_Gallery_Doc.jpg`).
  - **Files & PDFs**: Simulates document attachment (`Doctor_Prescription_Signed.pdf`).
- **State Change**: Sets `rxUploaded = true`, updates filename label, and renders a green checkmark badge. Includes a `"Remove Attached Prescription"` option.

#### 5. Coupon Toggle (`BUDDY50`)
- **Trigger**: Tapping the coupon card invokes `toggleCoupon()`.
- **Effect**: Toggles `couponApplied`. When active, deducts ₹50 from the order total and updates UI labels.

#### 6. Fixed Bottom Dock & "View Bill" Sheet Modal
- **Layout**:
  - Left column (`flex: 1`): Large total `₹{s.payable.toFixed(2)}` with `"Saved ₹{s.savings.toFixed(2)}"` badge and `"View bill ›"` button.
  - Right button (`flexShrink: 0`): `"Add delivery details ›"`.
  - Platform-aware bottom safe padding prevents button truncation on devices with gesture navigation bars.
- **"View Bill" Modal Breakdown**:
  - `Item total (MRP)`: `₹{s.mrpTotal.toFixed(2)}`
  - `Special price discount`: `−₹{(s.mrpTotal - s.item).toFixed(2)}`
  - `Packaging & Delivery`: `FREE (₹0.00)`
  - `Coupon discount (BUDDY50)`: `−₹{s.discount.toFixed(2)}` (or `₹0.00`)
  - `To pay`: `₹{s.payable.toFixed(2)}`

---

### Page 6: DetailsScreen.tsx (Patient & Payment Checkout)

`src/screens/DetailsScreen.tsx` handles delivery address, patient demographics, payment selection, and final order placement.

#### 1. Patient Demographics & Address
- Input fields for Full Name, Age, Gender, Phone Number, and Delivery Address.

#### 2. Payment Method Switcher
- **State**: `payMethod` (`'upi' | 'card' | 'netbanking'`).
- **Options**:
  1. **UPI (Instant & Free)**:
     - Includes user-uploaded PNG logos from `assets/upi/`: **PhonePe**, **Google Pay**, **Paytm**, and **BHIM UPI**.
     - Provides custom UPI ID input field with validation feedback.
  2. **Credit or Debit Card**:
     - Supported networks with official logos: **Visa**, **Mastercard**, **RuPay**.
     - Card number, expiry (`MM/YY`), and CVV fields.
  3. **Net Banking**:
     - Bank selector tiles with SVG bank logos: **HDFC**, **SBI**, **ICICI**, **Axis**, and **Kotak**.

#### 3. Unified Order Summary
- Uses `SummaryLine.tsx` with clean styling.
- All non-applicable deductions explicitly show `₹0.00`.
- `"Packaging & Delivery"` is labeled and displayed as `FREE (₹0.00)`.
- Clean layout without intrusive red remove text.

#### 4. Place Order Action
- Tapping `"Place order · ₹{s.payable.toFixed(2)}"` executes `placeOrder()`:
  - Generates unique Order ID (e.g. `#OB5421`).
  - Records items, timestamps, and total.
  - Empties the cart.
  - Transitions to `ConfirmScreen.tsx`.

---

### Page 7: ConfirmScreen.tsx (Order Confirmation & Live ETA)

`src/screens/ConfirmScreen.tsx` provides order confirmation and real-time delivery estimates.

#### 1. Order Hero & ETA Card
- Green confirmation checkmark: `"Order placed!"`.
- ETA badge: `"Arriving today · 28 MINS"`.

#### 2. "Your orders" Section
- Positioned immediately following the ETA card.
- Displays Order ID pill, item thumbnails with `medicineImages.ts` assets, item quantities, and line prices.
- Displays a `"Total Amount Paid"` summary card matching the exact paid amount.

#### 3. Navigation Actions
- `"Return to home"`: Resets navigation to home.
- `"View in My Orders"`: Directly opens `OrdersScreen.tsx`.

---

### Page 8: OrdersScreen.tsx (Order History & Instant Reorder)

`src/screens/OrdersScreen.tsx` tracks active and completed deliveries.

#### 1. Empty State
- Displays when `orders.length === 0`.
- Includes a `"Load sample orders for preview"` action to restore sample data for testing.

#### 2. Order History Cards
- Shows Order ID, date/time, delivery status badge (`Delivered` vs `In Transit`).
- Item breakdown with item totals formatted to `.toFixed(2)`.
- `"Order again"` button: Invokes `reorder(...)`, copying order items directly into the active cart and displaying a toast notification.

---

### Page 9: AccountScreen.tsx (Profile & Preferences)

`src/screens/AccountScreen.tsx` manages patient profile data and account settings.

#### 1. Inline Profile Editor
- Shows user avatar initials (`AS`), name, and phone number.
- Tapping the pencil edit button toggles edit mode, allowing in-place updating of patient name and phone number.

#### 2. Account Menu Sections
- **Healthcare & Orders**: My Orders, My Prescriptions, Saved Addresses.
- **Payments & Settings**: Payment Methods, Notifications, Help & FAQs.

---

### Page 10: HelpScreen.tsx (Support & FAQs)

`src/screens/HelpScreen.tsx` handles customer support and common questions.

#### 1. Accordion FAQ Viewer
- Categorized FAQ items (Delivery times, Prescription requirements, Payment safety, Returns).
- Tapping an item toggles its expanded state with smooth layout transitions.

#### 2. Live Chat Support Trigger
- Floating action button to simulate initiating a live chat session with a licensed pharmacist.

---

## 4. End-to-End Data Flow & Page Interconnections

```
BrowseScreen ───► CategoryScreen ───► ProductScreen
     │                    │                 │
     │                    ▼                 │
     ├─────────────► CartScreen ◄───────────┘
     │                    │
     ▼                    ▼
Bottom Tabs ──► DetailsScreen (Payment)
 (Orders,                 │
  Account)                ▼
     │              ConfirmScreen
     ▼                    │
OrdersScreen ◄────────────┘
```

---

## 5. Summary of Key Logic Rules & Principles

1. **Equality of Amounts**:
   - Every product card line price equals `price * qty`.
   - Every summary calculation matches `payable = Σ(price * qty) - discount`.
   - Packaging and delivery is consistently `FREE (₹0.00)`.
2. **Platform Safe Alignment**:
   - Top headers use `Platform.OS === 'android' ? (StatusBar.currentHeight + 8) : 12` to prevent camera hole / status bar overlap.
   - Bottom docks use `Platform.OS === 'ios' ? 24 : 16` to prevent device navigation bar cut-off.
3. **Responsive Button Layout**:
   - Fixed buttons use `flexShrink: 0` and `numberOfLines={1}` so text is never clipped on narrower mobile devices.
