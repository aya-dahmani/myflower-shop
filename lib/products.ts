export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  tag: string | null;
  description: string;
  details: string[];
  seller_id: string | null;
  category: "bouquets" | "arrangements" | "plants" | "gifts";
  is_featured: boolean;
};