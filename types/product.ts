
// types/product.ts
export interface Product {
  id: number;
  name: string;
  material: string;
  price: number;
  image: string;
  badge?: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
}