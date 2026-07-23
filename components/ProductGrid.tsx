"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

export default function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const router = useRouter();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ name: product.name, price: product.price, image: product.image });
    setJustAdded(product.name);
    setTimeout(() => setJustAdded(null), 1500);
  };

  if (products.length === 0) {
    return (
      <p className="text-ivy/50 text-sm py-10">
        No products in this category yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.slug} className="group">
          <Link
            href={`/products/${product.slug}`}
            className="block relative aspect-[3/4] rounded-3xl overflow-hidden bg-blush/40 mb-4"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {product.tag && (
              <span className="absolute top-3 left-3 bg-cream text-ivy text-[11px] font-medium px-3 py-1 rounded-full">
                {product.tag}
              </span>
            )}

            <button
              aria-label="Add to wishlist"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product.id).catch(() => router.push("/login"));
              }}
              className="absolute top-3 right-3 bg-cream/90 p-2 rounded-full hover:bg-cream transition-colors"
            >
              <Heart
                size={15}
                strokeWidth={1.8}
                className={isWishlisted(product.id) ? "text-burgundy" : "text-ivy"}
                fill={isWishlisted(product.id) ? "currentColor" : "none"}
              />
            </button>

            <button
              onClick={(e) => handleAddToCart(e, product)}
              className="absolute bottom-3 left-3 right-3 bg-ivy text-cream text-sm font-medium py-2.5 rounded-full flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {justAdded === product.name ? (
                <>
                  <Check size={15} />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag size={15} />
                  Add to cart
                </>
              )}
            </button>
          </Link>

          <Link href={`/products/${product.slug}`}>
            <p className="font-display italic text-lg leading-none mb-1 hover:text-burgundy transition-colors">
              {product.name}
            </p>
          </Link>
          <p className="text-ivy/70 text-sm">${product.price}</p>
        </div>
      ))}
    </div>
  );
}