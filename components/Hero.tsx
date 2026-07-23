import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="mx-auto max-w-7xl px-6 min-h-[80vh] flex items-center">
      <div className="grid md:grid-cols-2 gap-10 items-center w-full">
        {/* Left: copy */}
        <div className="fade-in">
          <span className="inline-block text-xs tracking-[0.2em] uppercase text-burgundy font-medium mb-4">
            Cut fresh this morning
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
            Flowers that
            <br />
            <span className="italic text-burgundy">feel like</span> a
            <br />
            garden visit.
          </h1>
          <p className="text-ivy/70 max-w-md mb-8 leading-relaxed">
            Seasonal bouquets grown by local farms, arranged by hand, and
            delivered the same day — because flowers shouldn&apos;t wait.
          </p>
          <div className="flex items-center gap-6 flex-wrap">
            <a
              href="#shop-by-category"
              className="inline-flex items-center gap-2 bg-burgundy text-cream px-7 py-3.5 rounded-full text-sm font-medium hover:bg-ivy transition-colors"
            >
              Shop the collection
              <ArrowRight size={16} />
            </a>
            <a
              href="#seasonal"
              className="text-sm font-medium text-ivy/80 hover:text-burgundy underline underline-offset-4 decoration-ivy/20"
            >
              See what&apos;s in season
            </a>
          </div>
        </div>

        {/* Right: image in circle */}
        <div className="relative fade-in max-w-sm mx-auto md:mx-0 md:ml-auto w-full">
          <div className="relative w-full aspect-square overflow-hidden rounded-full bg-blush/50">
            <Image
              src="/images/bouq.jpg"
              alt="Fresh seasonal bouquet"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="absolute -bottom-4 -left-4 bg-cream border border-gold/40 rounded-2xl px-5 py-3 shadow-sm">
            <p className="font-display italic text-lg leading-none">Tulips</p>
            <p className="text-xs text-ivy/60 mt-1">in season now</p>
          </div>
        </div>
      </div>
    </section>
  );
}