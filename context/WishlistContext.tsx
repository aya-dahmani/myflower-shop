"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

type WishlistContextType = {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    supabase
      .from("wishlist_items")
      .select("product_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled || !data) return;
        setWishlistIds(data.map((row) => row.product_id as string));
      });

    return () => {
      cancelled = true;
    };
  }, [user, supabase]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      throw new Error("User must be authenticated to update wishlist");
    }

    const alreadyIn = wishlistIds.includes(productId);

    if (alreadyIn) {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
    } else {
      setWishlistIds((prev) => [...prev, productId]);
      await supabase.from("wishlist_items").insert({
        user_id: user.id,
        product_id: productId,
      });
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds: user ? wishlistIds : [],
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}