import React from 'react';
import { FavoriteProvider } from './FavoriteContext';
import { VoucherProvider } from './VoucherContext';
import { CartProvider } from './CartContext';


export const AppProviders = ({ children }) => {
  return (
    <FavoriteProvider>
      <VoucherProvider >
        <CartProvider>
          {children}
        </CartProvider>
      </VoucherProvider >
    </FavoriteProvider>
  );
};
