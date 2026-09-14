import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import BestSellers from "@/components/BestSellers";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { fallbackBestSellers } from "@/lib/products";

export default async function Home() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  return (
    <main>
      <Navbar />
      <Hero />
      <Categories />
      <BestSellers products={products?.length ? products : fallbackBestSellers} />
      <WhyChooseUs />
      <ContactUs />
      <Footer />
    </main>
  );
}