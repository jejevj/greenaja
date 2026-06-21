import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Address = {
  id: string; label: string; name: string; phone: string;
  address: string; city: string; lat: number; lng: number;
};

export type OrderStatus = 'packing' | 'shipping' | 'delivered' | 'confirmed';
export type Order = {
  id: string; date: string; status: OrderStatus;
  items: { name: string; qty: number }[];
  total: number; reviewed?: boolean; reviewRating?: number;
};

interface AppState {
  orders:      Order[];
  addresses:   Address[];
  setOrders:   (o: Order[])   => void;
  setAddresses:(a: Address[]) => void;
  // computed
  activeOrderCount: number;   // packing | shipping
  needReviewCount:  number;   // delivered & belum review
  hasAddress:       boolean;
  // total badge utk icon profil
  profileBadgeCount: number;  // angka kuning/hijau
  profileBadgeAlert: boolean; // true = merah (alamat kosong)
}

const DUMMY_ORDERS: Order[] = [
  {
    id: 'GRN-20260622-8471', date: '22 Jun 2026', status: 'packing',
    items: [{ name: 'Bayam Segar', qty: 2 }, { name: 'Tomat Organik', qty: 1 }],
    total: 42000,
  },
  {
    id: 'GRN-20260618-3102', date: '18 Jun 2026', status: 'delivered',
    reviewed: true, reviewRating: 5,
    items: [{ name: 'Kangkung Segar', qty: 3 }],
    total: 27500,
  },
  {
    id: 'GRN-20260610-5577', date: '10 Jun 2026', status: 'delivered',
    reviewed: false,
    items: [{ name: 'Brokoli Organik', qty: 1 }],
    total: 35000,
  },
];

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders,    setOrders]    = useState<Order[]>(DUMMY_ORDERS);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const activeOrderCount = orders.filter(o => o.status === 'packing' || o.status === 'shipping').length;
  const needReviewCount  = orders.filter(o => o.status === 'delivered' && !o.reviewed).length;
  const hasAddress       = addresses.length > 0;

  // Badge angka = pesanan aktif + perlu review; merah jika alamat kosong
  const badgeTotal    = activeOrderCount + needReviewCount;
  const profileBadgeCount = badgeTotal;
  const profileBadgeAlert = !hasAddress; // merah jika belum ada alamat

  return (
    <AppContext.Provider value={{
      orders, addresses, setOrders, setAddresses,
      activeOrderCount, needReviewCount, hasAddress,
      profileBadgeCount, profileBadgeAlert,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
