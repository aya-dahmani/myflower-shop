"use client";

import Link from "next/link";
import { ShoppingBag, Menu, User, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

const links = [
  { name: "Home", href: "/#home" },
  { name: "Shopping", href: "/#shop-by-category" },
  { name: "Best Sellers", href: "/#best-sellers" },
  { name: "Why Us", href: "/#why-choose-us" },
    { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalCount } = useCart();
  const { user, profile, signOut } = useAuth();
  const { wishlistIds } = useWishlist();

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-ivy/10">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path
              d="M15 4C15 4 11 9 11 13a4 4 0 0 0 8 0c0-4-4-9-4-9Z"
              stroke="#7A2E38"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d="M15 17c0 6-5 9-5 9s-1-6 5-9Z"
              stroke="#1F3A2E"
              strokeWidth="1.4"
              fill="none"
            />
            <path
              d="M15 17c0 6 5 9 5 9s1-6-5-9Z"
              stroke="#1F3A2E"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>
          <span className="font-display italic text-2xl tracking-tight">
            Petal & Stem
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group relative text-sm font-medium tracking-wide text-ivy/80 transition-colors duration-200 hover:text-burgundy"
            >
              {link.name}
              <svg
                className="absolute -bottom-2 left-0 w-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                height="6"
                viewBox="0 0 40 6"
              >
                <path
                  d="M0 3C8 0.5 14 5.5 20 3C26 0.5 32 5.5 40 3"
                  stroke="#7A2E38"
                  strokeWidth="1.2"
                  fill="none"
                />
              </svg>
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative group">
              <button
                aria-label="Account"
                className="p-2 rounded-full hover:bg-blush/40 transition-colors flex items-center gap-1.5"
              >
                <User size={19} strokeWidth={1.6} />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-ivy/10 rounded-2xl shadow-md py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <p className="px-4 py-2 text-xs text-ivy/50 border-b border-ivy/10 mb-1">
                  {profile?.full_name || user.email}
                </p>
                {profile?.role === "seller" && (
                  <Link
                    href="/seller/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-cream transition-colors"
                  >
                    Seller dashboard
                  </Link>
                )}
                <Link
                  href="/orders"
                  className="block px-4 py-2 text-sm hover:bg-cream transition-colors"
                >
                  My orders
                </Link>
                <button
                  onClick={signOut}
                  className="w-full text-left px-4 py-2 text-sm text-burgundy hover:bg-cream transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              aria-label="Account"
              className="p-2 rounded-full hover:bg-blush/40 transition-colors"
            >
              <User size={19} strokeWidth={1.6} />
            </Link>
          )}

          {user && (
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="p-2 rounded-full hover:bg-blush/40 transition-colors relative"
            >
              <Heart size={19} strokeWidth={1.6} />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-burgundy text-cream text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
          )}

          <Link
            href="/cart"
            aria-label="Cart"
            className="p-2 rounded-full hover:bg-blush/40 transition-colors relative"
          >
            <ShoppingBag size={19} strokeWidth={1.6} />
            {totalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-burgundy text-cream text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Menu"
            className="md:hidden p-2 rounded-full hover:bg-blush/40 transition-colors"
            onClick={() => setOpen(!open)}
          >
            <Menu size={20} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-4">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="py-2 text-sm font-medium text-ivy/80 transition-colors hover:text-burgundy border-b border-ivy/5"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <p className="py-2 text-xs text-ivy/50">
                {profile?.full_name || user.email}
              </p>
              {profile?.role === "seller" && (
                <Link
                  href="/seller/dashboard"
                  className="py-2 text-sm font-medium text-ivy/80 hover:text-ivy"
                >
                  Seller dashboard
                </Link>
              )}
              <Link
                href="/orders"
                className="py-2 text-sm font-medium text-ivy/80 hover:text-ivy"
              >
                My orders
              </Link>
              <button
                onClick={signOut}
                className="py-2 text-sm font-medium text-burgundy text-left"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="py-2 text-sm font-medium text-ivy/80 hover:text-ivy"
            >
              Account
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}