import React from 'react';
import { FavoriteProvider } from './FavoriteContext';
import { VoucherProvider } from './VoucherContext';
import { ReviewProvider } from './ReviewContext';

export const AppProviders = ({ children }) => {
  return (
    <FavoriteProvider>
      <VoucherProvider >
        <ReviewProvider>
          {children}
        </ReviewProvider>
      </VoucherProvider >
    </FavoriteProvider>
  );
};
