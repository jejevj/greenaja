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

export type VoucherType = 'percent' | 'flat' | 'ongkir';
export type VoucherStatus = 'active' | 'used' | 'expired';
export type Voucher = {
  id: string;
  code: string;
  title: string;
  description: string;
  type: VoucherType;
  value: number;           // persen atau rupiah
  minPurchase: number;
  maxDiscount?: number;    // cap untuk tipe percent
  expiry: string;          // 'DD MMM YYYY'
  status: VoucherStatus;
  usedAt?: string;
};

interface AppState {
  orders:       Order[];
  addresses:    Address[];
  vouchers:     Voucher[];
  favFarmers:   number;    // dummy count
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
  activeVoucherCount: number;
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

const SEED_ADDRESSES: Address[] = [
  {
    id: '1', label: 'Rumah', name: 'Budi Santoso', phone: '08123456789',
    address: 'Jl. Melati No. 12, RT 03/RW 05', city: 'Bogor, Jawa Barat 16151',
    isPrimary: true, lat: -6.5971, lng: 106.8060,
  },
];

const SEED_VOUCHERS: Voucher[] = [
  {
    id: 'v1', code: 'GREENSEGAR10', title: 'Diskon 10% Sayuran Segar',
    description: 'Dapatkan potongan 10% untuk semua produk kategori sayuran segar. Berlaku untuk pembelian pertama bulan ini.',
    type: 'percent', value: 10, minPurchase: 50000, maxDiscount: 15000,
    expiry: '30 Jun 2026', status: 'active',
  },
  {
    id: 'v2', code: 'ONGKIRGRATIS', title: 'Gratis Ongkos Kirim',
    description: 'Nikmati gratis ongkir ke seluruh wilayah Jabodetabek. Tidak ada minimum pembelian. Berlaku 1x per akun.',
    type: 'ongkir', value: 0, minPurchase: 0,
    expiry: '25 Jun 2026', status: 'active',
  },
  {
    id: 'v3', code: 'HEMAT20RB', title: 'Potongan Rp 20.000',
    description: 'Potongan langsung Rp 20.000 untuk setiap pembelian di atas Rp 100.000. Berlaku semua kategori produk.',
    type: 'flat', value: 20000, minPurchase: 100000,
    expiry: '15 Jul 2026', status: 'active',
  },
  {
    id: 'v4', code: 'WELCOME5', title: 'Welcome Bonus 5%',
    description: 'Bonus selamat datang untuk member baru GreenAja. Sudah digunakan pada pesanan pertamamu.',
    type: 'percent', value: 5, minPurchase: 0, maxDiscount: 10000,
    expiry: '01 Jun 2026', status: 'used', usedAt: '15 Mei 2026',
  },
  {
    id: 'v5', code: 'RAMADAN25', title: 'Spesial Ramadan 25%',
    description: 'Voucher spesial Ramadan sudah tidak berlaku. Nantikan promo berikutnya!',
    type: 'percent', value: 25, minPurchase: 75000, maxDiscount: 30000,
    expiry: '10 Apr 2026', status: 'expired',
  },
];

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders,    setOrders]    = useState<Order[]>(DUMMY_ORDERS);
  const [addresses, setAddresses] = useState<Address[]>(SEED_ADDRESSES);
  const [vouchers]                = useState<Voucher[]>(SEED_VOUCHERS);
  const favFarmers                = 4; // dummy

  const addAddress = (a: Address) =>
    setAddresses(prev => [...prev, a]);

  const removeAddress = (id: string) =>
    setAddresses(prev => {
      const next = prev.filter(a => a.id !== id);
      if (prev.find(a => a.id === id)?.isPrimary && next.length > 0) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });

  const setPrimary = (id: string) =>
    setAddresses(prev => prev.map(a => ({ ...a, isPrimary: a.id === id })));

  const activeOrderCount  = orders.filter(o => o.status === 'packing' || o.status === 'shipping').length;
  const needReviewCount   = orders.filter(o => o.status === 'delivered' && !o.reviewed).length;
  const hasAddress        = addresses.length > 0;
  const primaryAddress    = addresses.find(a => a.isPrimary) ?? addresses[0] ?? null;
  const activeVoucherCount = vouchers.filter(v => v.status === 'active').length;

  const profileBadgeCount = activeOrderCount + needReviewCount;
  const profileBadgeAlert = !hasAddress;

  return (
    <AppContext.Provider value={{
      orders, addresses, vouchers, favFarmers,
      setOrders, setAddresses, addAddress, removeAddress, setPrimary,
      activeOrderCount, needReviewCount, hasAddress, primaryAddress,
      activeVoucherCount,
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
