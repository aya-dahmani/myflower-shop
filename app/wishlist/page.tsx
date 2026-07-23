"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/lib/products";

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const { user } = useAuth();
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!user || wishlistIds.length === 0) {
      return;
    }

    let cancelled = false;

    supabase
      .from("products")
      .select("*")
      .in("id", wishlistIds)
      .then(({ data }) => {
        if (!cancelled && data) setProducts(data as Product[]);
      });

    return () => {
      cancelled = true;
    };
  }, [wishlistIds, user, supabase]);

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 py-16 min-h-[60vh]">
        <h1 className="font-display text-4xl mb-10">
          Your <span className="italic text-burgundy">wishlist</span>
        </h1>
        <ProductGrid products={products} />
      </section>
      <Footer />
    </main>
  );
}