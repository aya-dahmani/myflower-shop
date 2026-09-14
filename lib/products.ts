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

export const fallbackBestSellers: Product[] = [
  {
    id: "sunset-tulip",
    slug: "sunset-tulip",
    name: "Sunset Tulip",
    price: 42,
    image: "/images/products/sunset-tulip.jpg",
    tag: "Best seller",
    description: "A warm, glowing arrangement of sunset-colored tulips.",
    details: [],
    seller_id: null,
    category: "bouquets",
    is_featured: true,
  },
  {
    id: "snake-plant",
    slug: "snake-plant",
    name: "Snake Plant",
    price: 36,
    image: "/images/products/snake-plant.jpg",
    tag: "Best seller",
    description: "A sculptural snake plant for an easy, elegant touch of green.",
    details: [],
    seller_id: null,
    category: "plants",
    is_featured: true,
  },
  {
    id: "ivory-rose",
    slug: "ivory-rose",
    name: "Ivory Rose",
    price: 48,
    image: "/images/products/ivory-rose.jpg",
    tag: "Best seller",
    description: "Soft ivory roses arranged with a timeless, graceful finish.",
    details: [],
    seller_id: null,
    category: "bouquets",
    is_featured: true,
  },
];