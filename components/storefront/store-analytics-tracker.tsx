'use client';

import { useEffect, useRef } from 'react';

import { trackStorePageView } from '@/lib/api/store-client';

type StoreAnalyticsTrackerProps = {
  storeId: string;
  productId?: string;
};

export function StoreAnalyticsTracker({ storeId, productId }: StoreAnalyticsTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) {
      return;
    }

    tracked.current = true;
    void trackStorePageView(storeId, productId);
  }, [productId, storeId]);

  return null;
}
