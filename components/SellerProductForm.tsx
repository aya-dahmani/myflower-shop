"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { slugify } from "@/lib/slugify";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

export default function SellerProductForm({ onProductAdded }: { onProductAdded: () => void }) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState<"bouquets" | "arrangements" | "plants" | "gifts">("bouquets");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!imageFile) {
      setError("Please add a product photo.");
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Upload de l'image dans le bucket, sous un dossier propre à ce vendeur
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      setError(uploadError.message);
      setLoading(false);
      return;
    }

    // 2. Récupère l'URL publique de l'image uploadée
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    // 3. Insère le produit dans la table
    const { error: insertError } = await supabase.from("products").insert({
      seller_id: user.id,
      slug: `${slugify(name)}-${Date.now()}`,
      name,
      price: parseFloat(price),
      image: urlData.publicUrl,
      tag: tag || null,
      description,
      details: details.split(",").map((d) => d.trim()).filter(Boolean),
      category,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onProductAdded();
    router.refresh();
    setName("");
    setPrice("");
    setDescription("");
    setDetails("");
    setTag("");
    setCategory("bouquets");
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-ivy/10 rounded-3xl p-6">
      <h3 className="font-display text-xl italic mb-2">Add a new product</h3>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Image upload */}
      <div>
        <label className="text-xs text-ivy/60 mb-1.5 block">Product photo</label>
        <label className="flex items-center gap-3 border border-dashed border-ivy/25 rounded-xl px-4 py-3 cursor-pointer hover:bg-cream transition-colors">
          <Upload size={16} className="text-ivy/50" />
          <span className="text-sm text-ivy/60">
            {imageFile ? imageFile.name : "Choose an image"}
          </span>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl mt-3" />
        )}
      </div>

      <div>
        <label className="text-xs text-ivy/60 mb-1.5 block">Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Blush Peony Bundle"
          className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-ivy/60 mb-1.5 block">Price ($)</label>
          <input
            type="number"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="48"
            className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-ivy/60 mb-1.5 block">Tag (optional)</label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. New"
            className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-ivy/60 mb-1.5 block">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors bg-white"
        >
          <option value="bouquets">Bouquets</option>
          <option value="arrangements">Arrangements</option>
          <option value="plants">Plants</option>
          <option value="gifts">Gifts</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-ivy/60 mb-1.5 block">Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe the bouquet..."
          className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-ivy/60 mb-1.5 block">
          Details (comma-separated)
        </label>
        <input
          type="text"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="10 stems, Vase included, Lasts 5-7 days"
          className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-burgundy text-cream py-3.5 rounded-full text-sm font-medium hover:bg-ivy transition-colors disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add product"}
      </button>
    </form>
  );
}