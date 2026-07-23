"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
};

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      if (!loading) {
        Promise.resolve().then(() => {
          if (!cancelled) setLoadingOrders(false);
        });
      }
      return () => {
        cancelled = true;
      };
    }

    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;

        const parsed: Order[] = (data ?? []).map((order) => ({
          id: order.id as string,
          status: order.status as string,
          created_at: order.created_at as string,
          total: Number(order.total),
          items: (order.items as OrderItem[]).map((item) => ({
            name: item.name,
            image: item.image,
            price: Number(item.price),
            quantity: Number(item.quantity),
          })),
        }));

        setOrders(parsed);
        setLoadingOrders(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, loading, supabase]);

  if (loading || loadingOrders) {
    return (
      <main>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-ivy/50 text-sm">Loading...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <Navbar />
        <section className="mx-auto max-w-3xl px-6 py-24 text-center min-h-[50vh]">
          <h1 className="font-display text-3xl mb-3">
            Sign in to see your <span className="italic text-burgundy">orders</span>
          </h1>
          <Link
            href="/login"
            className="inline-block bg-burgundy text-cream px-7 py-3 rounded-full text-sm font-medium hover:bg-ivy transition-colors mt-6"
          >
            Sign in
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
          Your <span className="italic text-burgundy">orders</span>
        </h1>

        {orders.length === 0 && (
          <p className="text-ivy/50 text-sm">You haven&apos;t placed any orders yet.</p>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-ivy/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-ivy/50">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="font-display italic text-lg">
                    Order #{order.id.slice(0, 8)}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-blush/40 text-ivy capitalize">
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <span className="text-ivy/70">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-ivy/70">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-ivy/10">
                <span className="text-ivy/60 text-sm">Total</span>
                <span className="font-display text-xl">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}