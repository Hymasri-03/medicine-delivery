# OneBuddy — Medicine Delivery (React Native / Expo)

A fully native conversion of the medicine-delivery mockup — no WebView,
built from real `View` / `Text` / `TouchableOpacity` components with
`react-native-svg` for the product illustrations.

## Run it

```
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator), or scan the QR
code with Expo Go on your phone.

## File map

```
App.tsx                          entry point — wraps everything in AppProvider

src/
  types.ts                       shared TypeScript types

  theme/
    colors.ts                    color tokens
    styles.ts                    shared StyleSheet, used by every screen/component

  data/
    products.ts                  the product catalog
    categories.ts                legacy chip categories (Injections, Needles, …)
    groups.ts                    grouped categories (Vitamins, Diabetes Care, Health)
    trending.ts                  trending-search suggestions

  context/
    AppContext.tsx                all app state (cart, navigation stack, screen
                                  params) + actions, exposed via useApp()

  components/
    Icon.tsx                     product illustrations (original vector art)
    QtyControl.tsx                ADD button / qty stepper
    HeaderBar.tsx                 shared top app bar
    ProductCard.tsx               product card used in grids/strips
    SummaryLine.tsx               price/summary row
    Field.tsx                     labelled text input
    ToastOverlay.tsx              bottom toast bubble

  navigation/
    RootNavigator.tsx             switches screens based on app state

  screens/
    BrowseScreen.tsx              home: search, chips, popular items, grouped cards
    CategoryScreen.tsx            legacy chip-category listing
    GroupCategoryScreen.tsx       Vitamins/Diabetes/Health listing with sub-tabs
    ProductScreen.tsx             product detail + same-formula alternatives
    CartScreen.tsx                cart + mandatory prescription upload
    DetailsScreen.tsx             patient details + payment method
    ConfirmScreen.tsx             order-placed confirmation
    HelpScreen.tsx                help & FAQs
```

Screen switching is done with a simple back-stack in `AppContext`
(`navStack: Screen[]`) rather than a navigation library, so there's
nothing extra to install beyond `react-native-svg`.
