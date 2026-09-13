export interface StoreInfo {
  organization: string;
  store: string;
  currency: string; // "$" | "so'm"
  banners: { id: number; image: string; title: string }[];
}

export interface ProductUnit {
  unit_id: number | null;
  unit_name: string;
  multiplier: number;
  price: number;
  original_price: number | null;
  currency: string; // "" => so'm
  cur_price: number;
  cur_original_price: number | null;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  original_price: number | null;
  currency: string;
  cur_price: number;
  cur_original_price: number | null;
  stock: number | null;
  in_stock: boolean;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  category_id: number | null;
  category_name: string | null;
  category_parent_id: number | null;
  category_parent_name: string | null;
  image: string | null;
  stock_type: string;
  stock: number | null;
  in_stock: boolean;
  has_variants: boolean;
  variants: ProductVariant[];
  units: ProductUnit[];
  discount_percent: number;
  product_type: string;
}

export interface ProductsResponse {
  store: string;
  results: Product[];
  show_stock: boolean;
  show_images: boolean;
  category_images: { id: number; image: string }[];
}

export interface CustomerLogin {
  customer_code: string;
  name: string;
  phone: string;
  price_type: string;
  price_type_display: string;
}

export interface CustomerAccount {
  customer: {
    code: string;
    name: string;
    phone: string;
    balance: number;
    debt: number;
    currency_debts: Record<string, number>;
    credit: number;
    price_type: string;
    price_type_display: string;
  };
  sales: SaleRow[];
  online_orders: OrderRow[];
  payments: PaymentRow[];
  manual_debts: { amount: number; note: string; label: string; created_at: string }[];
}

export interface OrderItem {
  name: string;
  unit: string;
  qty: number;
  price: number;
  total: number;
  serial: unknown;
}

export interface OrderRow {
  order_no: string;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export interface SaleRow {
  receipt_number: string;
  total: number;
  paid: number;
  debt: number;
  debt_currency: string;
  debt_currency_amount?: number;
  debt_rate?: number;
  payment_method: string;
  payment_breakdown?: { method: string; amount: number }[];
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface SerialSpec {
  imei?: string;
  storage?: string;
  color?: string;
  region?: string;
  battery?: number;
}

export interface PaymentRow {
  amount: number;
  paid_currency: string;
  rate: number | null;
  note: string;
  created_at: string;
}

export interface CartLine {
  key: string; // productId or productId:variantId
  product_id: number;
  variant_id?: number;
  unit_id?: number;
  name: string;
  variant_name?: string;
  image: string | null;
  qty: number;
  price: number; // base currency numeric
  currency: string; // display currency code, "" => so'm
  cur_price: number; // price in display currency
  maxQty?: number; // available stock cap; undefined = untracked/unlimited
}
