import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Address = {
  id: string; label: string; name: string; phone: string;
  address: string; city: string; isPrimary: boolean;
  lat?: number; lng?: number;
};

export type OrderStatus = 'packing' | 'shipping' | 'delivered' | 'confirmed';
export type Order = {
  id: string; date: string; status: OrderStatus;
  items: { name: string; qty: number }[];
  total: number; reviewed?: boolean; reviewRating?: number;
};

interface AppState {
  orders:       Order[];
  addresses:    Address[];
  setOrders:    (o: Order[]) => void;
  setAddresses: (a: Address[]) => void;
  addAddress:   (a: Address) => void;
  removeAddress:(id: string) => void;
  setPrimary:   (id: string) => void;
  // computed
  activeOrderCount:  number;
  needReviewCount:   number;
  hasAddress:        boolean;
  primaryAddress:    Address | null;
  profileBadgeCount: number;
  profileBadgeAlert: boolean;
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

// Seed 1 alamat contoh agar tidak selalu kosong di dev
const SEED_ADDRESSES: Address[] = [
  {
    id: '1', label: 'Rumah', name: 'Budi Santoso', phone: '08123456789',
    address: 'Jl. Melati No. 12, RT 03/RW 05', city: 'Bogor, Jawa Barat 16151',
    isPrimary: true, lat: -6.5971, lng: 106.8060,
  },
];

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders,    setOrders]    = useState<Order[]>(DUMMY_ORDERS);
  const [addresses, setAddresses] = useState<Address[]>(SEED_ADDRESSES);

  const addAddress = (a: Address) =>
    setAddresses(prev => [
      ...prev.map(x => ({ ...x, isPrimary: false })), // hapus primary lama jika tambah yg baru as primary
      a,
    ]);

  const removeAddress = (id: string) =>
    setAddresses(prev => {
      const next = prev.filter(a => a.id !== id);
      // jika yang dihapus adalah primary, auto-set primary ke index 0
      if (prev.find(a => a.id === id)?.isPrimary && next.length > 0) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });

  const setPrimary = (id: string) =>
    setAddresses(prev => prev.map(a => ({ ...a, isPrimary: a.id === id })));

  const activeOrderCount = orders.filter(o => o.status === 'packing' || o.status === 'shipping').length;
  const needReviewCount  = orders.filter(o => o.status === 'delivered' && !o.reviewed).length;
  const hasAddress       = addresses.length > 0;
  const primaryAddress   = addresses.find(a => a.isPrimary) ?? addresses[0] ?? null;

  const badgeTotal       = activeOrderCount + needReviewCount;
  const profileBadgeCount = badgeTotal;
  const profileBadgeAlert = !hasAddress;

  return (
    <AppContext.Provider value={{
      orders, addresses, setOrders, setAddresses,
      addAddress, removeAddress, setPrimary,
      activeOrderCount, needReviewCount, hasAddress, primaryAddress,
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
