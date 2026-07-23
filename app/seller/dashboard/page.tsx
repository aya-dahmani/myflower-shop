"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SellerProductForm from "@/components/SellerProductForm";
import EditProductModal from "@/components/EditProductModal";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Star } from "lucide-react";
import type { Product } from "@/lib/products";

export default function SellerDashboard() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = useCallback(async (): Promise<void> => {
    if (!user) return;

    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    setProducts((data as Product[]) ?? []);
  }, [user, supabase]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    Promise.resolve().then(async () => {
      if (!cancelled) await loadProducts();
    });

    return () => {
      cancelled = true;
    };
  }, [user, loadProducts]);

  const handleDelete = async (id: string): Promise<void> => {
    await supabase.from("products").delete().eq("id", id);
    await loadProducts();
  };

  const toggleFeatured = async (product: Product): Promise<void> => {
    await supabase
      .from("products")
      .update({ is_featured: !product.is_featured })
      .eq("id", product.id);
    await loadProducts();
  };

  return (
    <main>
      <Navbar />
      <section className="mx-auto min-h-[60vh] max-w-7xl px-6 py-16">
        <span className="mb-3 inline-block text-xs font-medium uppercase tracking-[0.2em] text-burgundy">
          Seller
        </span>

        <h1 className="mb-10 text-4xl font-display">
          Welcome,{" "}
          <span className="italic text-burgundy">
            {profile?.full_name || "seller"}
          </span>
        </h1>

        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <SellerProductForm onProductAdded={() => void loadProducts()} />

          <div>
            <h3 className="mb-4 text-xl font-display italic">
              Your products ({products.length})
            </h3>

            <div className="space-y-3">
              {products.length === 0 && (
                <p className="text-sm text-ivy/50">
                  You have not added any products yet.
                </p>
              )}

              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 rounded-2xl border border-ivy/10 p-3"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="mb-1 font-display italic leading-none">
                      {product.name}
                    </p>
                    <p className="text-xs text-ivy/60">${product.price}</p>
                  </div>
                  <button
                    onClick={() => void toggleFeatured(product)}
                    aria-label="Toggle best seller"
                    title={product.is_featured ? "Remove from Best Sellers" : "Add to Best Sellers"}
                    className={`p-2 transition-colors ${
                      product.is_featured
                        ? "text-burgundy"
                        : "text-ivy/30 hover:text-burgundy"
                    }`}
                  >
                    <Star size={16} fill={product.is_featured ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => setEditingProduct(product)}
                    aria-label="Edit product"
                    className="p-2 text-ivy/40 transition-colors hover:text-burgundy"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => void handleDelete(product.id)}
                    aria-label="Delete product"
                    className="p-2 text-ivy/40 transition-colors hover:text-burgundy"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdated={() => void loadProducts()}
        />
      )}
    </main>
  );
}