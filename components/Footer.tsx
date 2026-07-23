import Link from "next/link";
import { Globe, Link2, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ivy text-cream mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <svg width="26" height="26" viewBox="0 0 30 30" fill="none">
              <path
                d="M15 4C15 4 11 9 11 13a4 4 0 0 0 8 0c0-4-4-9-4-9Z"
                stroke="#EFC7CE"
                strokeWidth="1.4"
                fill="none"
              />
              <path
                d="M15 17c0 6-5 9-5 9s-1-6 5-9Z"
                stroke="#FAF6ED"
                strokeWidth="1.4"
                fill="none"
              />
              <path
                d="M15 17c0 6 5 9 5 9s1-6-5-9Z"
                stroke="#FAF6ED"
                strokeWidth="1.4"
                fill="none"
              />
            </svg>
            <span className="font-display italic text-xl">Petal & Stem</span>
          </div>
          <p className="text-cream/60 text-sm max-w-xs leading-relaxed">
            Seasonal flowers grown by local farms, arranged by hand, and delivered the same day.
          </p>
        </div>

        {/* Shop links */}
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-cream/50 mb-4">Shop</p>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/bouquets" className="hover:text-blush transition-colors">Bouquets</Link></li>
            <li><Link href="/arrangements" className="hover:text-blush transition-colors">Arrangements</Link></li>
            <li><Link href="/plants" className="hover:text-blush transition-colors">Plants</Link></li>
            <li><Link href="/gifts" className="hover:text-blush transition-colors">Gifts</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs tracking-[0.15em] uppercase text-cream/50 mb-4">Get in touch</p>
          <div className="flex items-center gap-2 text-sm text-cream/80 mb-4">
            <Mail size={15} />
            <a href="mailto:dahmaya06@gmail.com" className="hover:text-blush transition-colors">
              dahmaya06@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a aria-label="Instagram" href="#" className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors">
              <Globe size={16} />
            </a>
            <a aria-label="Facebook" href="#" className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors">
              <Link2 size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Petal & Stem. All rights reserved . Made with ❤️ by <a href="mailto:dahmaya06@gmail.com" className="underline hover:text-blush transition-colors">Dahmani Aya</a>.
      </div>
    </footer>
  );
}