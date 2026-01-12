import React from 'react';
import FarmMarket from '@/components/dashboard/FarmMarket';

export const metadata = {
  title: 'Farm Market | KrishiBot',
  description: 'Buy seeds, fertilizers, and tools from local sellers.',
};

export default function MarketPage() {
  return (
    <div className="h-full w-full">
      <FarmMarket />
    </div>
  );
}
