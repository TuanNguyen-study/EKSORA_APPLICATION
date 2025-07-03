import React from 'react';
import { FavoriteProvider } from './FavoriteContext';
import { VoucherProvider } from './VoucherContext';

export const AppProviders = ({ children }) => {
  return (
    <FavoriteProvider>
      <VoucherProvider >
        {children}
      </VoucherProvider >
    </FavoriteProvider>
  );
};
