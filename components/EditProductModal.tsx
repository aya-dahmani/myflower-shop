"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Upload } from "lucide-react";
import type { Product } from "@/lib/products";

export default function EditProductModal({
  product,
  onClose,
  onUpdated,
}: {
  product: Product;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const supabase = createClient();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [description, setDescription] = useState(product.description);
  const [details, setDetails] = useState(product.details.join(", "));
  const [tag, setTag] = useState(product.tag ?? "");
  const [category, setCategory] = useState(product.category);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image);
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
    setLoading(true);
    setError(null);

    let imageUrl = product.image;

    // Si une nouvelle photo a été choisie, on l'upload et on remplace l'ancienne URL
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${product.seller_id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        price: parseFloat(price),
        image: imageUrl,
        tag: tag || null,
        description,
        details: details.split(",").map((d) => d.trim()).filter(Boolean),
        category,
      })
      .eq("id", product.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-ivy/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-2xl italic">Edit product</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full hover:bg-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-ivy/60 mb-1.5 block">Product photo</label>
            <label className="flex items-center gap-3 border border-dashed border-ivy/25 rounded-xl px-4 py-3 cursor-pointer hover:bg-cream transition-colors">
              <Upload size={16} className="text-ivy/50" />
              <span className="text-sm text-ivy/60">
                {imageFile ? imageFile.name : "Change image (optional)"}
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
                className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-ivy/60 mb-1.5 block">Tag (optional)</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
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
              className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-ivy/60 mb-1.5 block">Details (comma-separated)</label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full border border-ivy/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-ivy/15 py-3.5 rounded-full text-sm font-medium hover:bg-cream transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-burgundy text-cream py-3.5 rounded-full text-sm font-medium hover:bg-ivy transition-colors disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}