"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setPlacing(true);
    setError(null);

    const { error: insertError } = await supabase.from("orders").insert({
      user_id: user.id,
      items: items,
      total: totalPrice,
    });

    if (insertError) {
      setError(insertError.message);
      setPlacing(false);
      return;
    }

    // Vide le panier après la commande
    await supabase.from("cart_items").delete().eq("user_id", user.id);

    router.push("/orders");
  };

  if (items.length === 0) {
    return (
      <main>
        <Navbar />
        <section className="mx-auto max-w-3xl px-6 py-24 text-center min-h-[50vh]">
          <h1 className="font-display text-3xl mb-3">
            Your cart is <span className="italic text-burgundy">empty</span>
          </h1>
          <p className="text-ivy/60 mb-8">Looks like you have not added any flowers yet.</p>
          <Link
            href="/"
            className="inline-block bg-burgundy text-cream px-7 py-3 rounded-full text-sm font-medium hover:bg-ivy transition-colors"
          >
            Start shopping
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 py-16 min-h-[60vh]">
        <h1 className="font-display text-4xl mb-10">
          Your <span className="italic text-burgundy">cart</span>
        </h1>

        <div className="space-y-6 mb-10">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-5 border-b border-ivy/10 pb-6"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-blush/40 shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <p className="font-display italic text-lg leading-none mb-1">{item.name}</p>
                <p className="text-ivy/60 text-sm">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3 border border-ivy/15 rounded-full px-3 py-1.5">
                <button
                  onClick={() => updateQuantity(item.name, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.name, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => removeItem(item.name)}
                aria-label="Remove item"
                className="p-2 text-ivy/40 hover:text-burgundy transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <div className="flex items-center justify-between mb-8">
          <span className="text-ivy/60">Subtotal</span>
          <span className="font-display text-2xl">${totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={placing}
          className="w-full bg-burgundy text-cream py-4 rounded-full text-sm font-medium hover:bg-ivy transition-colors disabled:opacity-60"
        >
          {placing ? "Placing order..." : "Checkout"}
        </button>
      </section>
      <Footer />
    </main>
  );
}