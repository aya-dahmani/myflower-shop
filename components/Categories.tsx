import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Bouquets", tagline: "Hand-tied, same-day", image: "/images/categories/bouquets.jpg", href: "/bouquets" },
  { name: "Arrangements", tagline: "Vased & ready to gift", image: "/images/categories/arrangements.jpg", href: "/arrangements" },
  { name: "Plants", tagline: "Living, low-maintenance", image: "/images/categories/plants.jpg", href: "/plants" },
  { name: "Gifts", tagline: "Flowers plus a little extra", image: "/images/categories/gifts.jpg", href: "/gifts" },
];

export default function Categories() {
  return (
    <section id="shop-by-category" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-burgundy font-medium mb-3">
            Browse
          </span>
          <h2 className="font-display text-4xl md:text-5xl leading-tight">
            Shop by <span className="italic text-burgundy">category</span>
          </h2>
        </div>
        <Link
          href="/bouquets"
          className="text-sm font-medium text-ivy/80 hover:text-burgundy underline underline-offset-4 decoration-ivy/20"
        >
          View everything
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group block"
          >
            <div
              className="relative rounded-3xl overflow-hidden bg-blush/40"
              style={{ aspectRatio: "3 / 4" }}
            >
              {/* Replace src with your uploaded image, e.g. /images/categories/bouquets.jpg */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(31, 58, 46, 0.5), rgba(31, 58, 46, 0))",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-display italic text-cream text-xl leading-none">
                  {cat.name}
                </p>
                <p className="text-cream/80 text-xs mt-1">{cat.tagline}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}