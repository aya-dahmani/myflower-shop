"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Minus, Plus, Check, Truck, Leaf } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";
import Link from "next/link";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ name: product.name, price: product.price, image: product.image });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      {/* Breadcrumb */}
      <Link href="/" className="text-sm text-ivy/50 hover:text-burgundy transition-colors mb-8 inline-block">
        ← Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-3/4 rounded-[2.5rem] overflow-hidden bg-blush/40">
          {/* Replace src with your uploaded image path */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover"
          />
          {product.tag && (
            <span className="absolute top-4 left-4 bg-cream text-ivy text-xs font-medium px-3 py-1.5 rounded-full">
              {product.tag}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3">
            {product.name}
          </h1>
          <p className="text-2xl text-burgundy font-medium mb-6">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-ivy/70 leading-relaxed mb-8">{product.description}</p>

          {/* Details list */}
          <ul className="space-y-2 mb-8">
            {product.details.map((d) => (
              <li key={d} className="flex items-center gap-2 text-sm text-ivy/70">
                <span className="w-1 h-1 rounded-full bg-burgundy" />
                {d}
              </li>
            ))}
          </ul>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-4 border border-ivy/15 rounded-full px-4 py-2.5">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <span className="text-sm w-4 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-burgundy text-cream py-3.5 rounded-full text-sm font-medium hover:bg-ivy transition-colors flex items-center justify-center gap-2"
            >
              {added ? (
                <>
                  <Check size={16} />
                  Added to cart
                </>
              ) : (
                `Add to cart · $${(product.price * quantity).toFixed(2)}`
              )}
            </button>

            <button
              aria-label="Add to wishlist"
              className="p-3.5 rounded-full border border-ivy/15 hover:bg-blush/40 transition-colors"
            >
              <Heart size={18} strokeWidth={1.8} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-ivy/10">
            <div className="flex items-center gap-2 text-xs text-ivy/60">
              <Truck size={16} />
              Same-day delivery
            </div>
            <div className="flex items-center gap-2 text-xs text-ivy/60">
              <Leaf size={16} />
              Cut fresh to order
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}