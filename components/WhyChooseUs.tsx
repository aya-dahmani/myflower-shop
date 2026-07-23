import { Truck, Leaf, Heart, RefreshCw } from "lucide-react";

const reasons = [
  {
    icon: Leaf,
    title: "Cut fresh, not stockpiled",
    description: "We order from local farms the morning of delivery — never from a warehouse.",
  },
  {
    icon: Truck,
    title: "Same-day delivery",
    description: "Order before 2pm and your flowers arrive the same day, hand-delivered.",
  },
  {
    icon: Heart,
    title: "Arranged by hand",
    description: "Every bouquet is tied by a florist, not assembled on a line.",
  },
  {
    icon: RefreshCw,
    title: "7-day freshness promise",
    description: "Not happy with how they held up? We'll replace them, no questions asked.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="inline-block text-xs tracking-[0.2em] uppercase text-burgundy font-medium mb-3">
          Why Petal & Stem
        </span>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
          Flowers, done <span className="italic text-burgundy">properly</span>
        </h2>
        <p className="text-ivy/60">
          No shortcuts, no filler stems, no flowers that wilt by day two.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
        {reasons.map((reason) => {
          const Icon = reason.icon;
          return (
            <div key={reason.title} className="text-center md:text-left group">
              <div className="w-12 h-12 rounded-full bg-blush/50 flex items-center justify-center mb-5 mx-auto md:mx-0 transition-colors duration-300 group-hover:bg-burgundy">
                <Icon
                  size={20}
                  strokeWidth={1.6}
                  className="text-burgundy transition-colors duration-300 group-hover:text-cream"
                />
              </div>
              <h3 className="font-display text-lg italic mb-2 inline-block transition-transform duration-300 group-hover:scale-110 origin-left">
                {reason.title}
              </h3>
              <p className="text-ivy/60 text-sm leading-relaxed">{reason.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}