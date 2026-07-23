import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { createClient } from "@/lib/supabase/server";

export default async function BouquetsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category", "bouquets")
    .order("created_at", { ascending: false });

  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 py-20 min-h-[60vh]">
        <span className="inline-block text-xs tracking-[0.2em] uppercase text-burgundy font-medium mb-3">
          Hand-tied, same-day
        </span>
        <h1 className="font-display text-4xl md:text-5xl mb-10">
          <span className="italic text-burgundy">Bouquets</span>
        </h1>
        <ProductGrid products={products ?? []} />
      </section>
      <Footer />
    </main>
  );
}