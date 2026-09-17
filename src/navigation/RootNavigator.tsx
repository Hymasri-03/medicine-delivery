import React from 'react';
import { useApp } from '../context/AppContext';
import BrowseScreen from '../screens/BrowseScreen';
import CategoryScreen from '../screens/CategoryScreen';
import GroupCategoryScreen from '../screens/GroupCategoryScreen';
import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ConfirmScreen from '../screens/ConfirmScreen';
import HelpScreen from '../screens/HelpScreen';
import OrdersScreen from '../screens/OrdersScreen';
import AccountScreen from '../screens/AccountScreen';

export default function RootNavigator() {
  const { screen } = useApp();

  switch (screen) {
    case 'category':
      return <CategoryScreen />;
    case 'groupcategory':
      return <GroupCategoryScreen />;
    case 'product':
      return <ProductScreen />;
    case 'cart':
      return <CartScreen />;
    case 'details':
      return <DetailsScreen />;
    case 'confirm':
      return <ConfirmScreen />;
    case 'help':
      return <HelpScreen />;
    case 'orders':
      return <OrdersScreen />;
    case 'account':
      return <AccountScreen />;
    default:
      return <BrowseScreen />;
  }
}
