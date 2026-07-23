"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

type CartItem = {
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (name: string) => void;
  updateQuantity: (name: string, quantity: number) => void;
  totalCount: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    let cancelled = false;

    supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled || !data) return;
        setItems(
          data.map((row) => ({
            name: row.product_name as string,
            price: Number(row.product_price),
            image: row.product_image as string,
            quantity: Number(row.quantity),
          }))
        );
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const addItem = async (item: Omit<CartItem, "quantity">) => {
    let nextQuantity = 1;

    setItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        nextQuantity = existing.quantity + 1;
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      nextQuantity = 1;
      return [...prev, { ...item, quantity: 1 }];
    });

    if (user) {
      await supabase.from("cart_items").upsert(
        {
          user_id: user.id,
          product_name: item.name,
          product_price: item.price,
          product_image: item.image,
          quantity: nextQuantity,
        },
        { onConflict: "user_id, product_name" }
      );
    }
  };

  const removeItem = async (name: string) => {
    setItems((prev) => prev.filter((i) => i.name !== name));

    if (user) {
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_name", name);
    }
  };

  const updateQuantity = async (name: string, quantity: number) => {
    if (quantity < 1) return removeItem(name);

    setItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, quantity } : i))
    );

    if (user) {
      await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("user_id", user.id)
        .eq("product_name", name);
    }
  };

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, totalCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}