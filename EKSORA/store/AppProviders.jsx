import React from 'react';
import { FavoriteProvider } from './FavoriteContext';
import { VoucherProvider } from './VoucherContext';
import { ReviewProvider } from './ReviewContext';
import { CartProvider } from './CartContext';



export const AppProviders = ({ children }) => {
  return (
    <FavoriteProvider>
      <VoucherProvider >
        <ReviewProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ReviewProvider>
      </VoucherProvider >
    </FavoriteProvider>
  );
};
