import { useEffect, useState, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PageHeader } from "../../components/shared/PageHeader";
import { FormSkeleton } from "../../components/shared/LoadingSkeleton";
import { SelectDropdown } from "../../components/shared/SelectDropdown";
import {
  createProduct,
  updateProduct,
  fetchProducts,
} from "../../api/endpoints/products";
import { fetchCategories } from "../../api/endpoints/categories";
import { getApiErrorMessage } from "../../lib/apiError";
import type { SelectOption } from "../../components/shared/SelectDropdown";

export const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [tag, setTag] = useState("");
  const [unit, setUnit] = useState("");
  const [active, setActive] = useState(true);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          fetchCategories(),
          id ? fetchProducts(1, undefined, 100) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        setCategories(
          categoryRes.map((category) => ({
            value: category.id,
            label: category.name,
            description:
              category.sort_order !== undefined
                ? `Sort order: ${category.sort_order}`
                : undefined,
          })),
        );

        if (productRes && id) {
          const found = productRes.products.find((p) => p.id === id);
          if (found) {
            setName(found.name);
            setCategory(found.category_id ?? found.category ?? "");
            setPrice(String(found.price));
            setOldPrice(String(found.old_price ?? ""));
            setTag(found.tag ?? "");
            setUnit(found.unit);
            setActive(found.active);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name || !category || !price || !unit) {
      setError("All fields are required");
      return;
    }

    const payload = {
      name,
      category_id: category,
      price: parseInt(price, 10),
      unit,
      active,
      old_price: oldPrice.trim() ? parseInt(oldPrice, 10) : undefined,
      tag: tag.trim() || undefined,
    };

    setSaving(true);
    try {
      if (isEditing && id) {
        await updateProduct(id, payload);
        setMessage("Product updated");
      } else {
        await createProduct(payload);
        setMessage("Product created");
      }
      setTimeout(() => navigate("/products"), 800);
    } catch (error) {
      setError(getApiErrorMessage(error, "Something went wrong"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title={isEditing ? "Edit Product" : "New Product"} />
        <FormSkeleton fields={4} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? "Edit Product" : "New Product"}
        action={
          <button
            onClick={() => navigate("/products")}
            className="bg-surface-raised text-white border border-surface-border px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-surface-overlay transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        }
      />

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="max-w-lg bg-surface-raised border border-surface-border rounded-xl p-6 space-y-5"
      >
        <div>
          <label className="block text-sm text-surface-muted mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-surface-muted mb-2">
            Category
          </label>
          <SelectDropdown
            value={category}
            onChange={setCategory}
            options={categories}
            placeholder="Select category"
          />
          {categories.length > 0 ? (
            <p className="mt-2 text-xs text-surface-muted">
              Categories are loaded from existing backend products.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/categories")}
              className="mt-3 inline-flex items-center justify-center rounded-lg border border-surface-border px-4 py-2 text-sm font-medium text-white hover:bg-surface-overlay transition-colors"
            >
              Add Categories
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-surface-muted mb-2">
              Price (GHC)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full"
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm text-surface-muted mb-2">
              Old Price (GHC)
            </label>
            <input
              type="number"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
              className="w-full"
              min="0"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-surface-muted mb-2">
              Tag
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full"
              placeholder="e.g. In Stock"
            />
          </div>
          <div>
            <label className="block text-sm text-surface-muted mb-2">
              Unit
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full"
              required
              placeholder="e.g. bag, bottle"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActive(!active)}
            className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
              active
                ? "bg-white"
                : "bg-surface-overlay border border-surface-border"
            }`}
          >
            <motion.div
              className={`absolute top-0.5 w-5 h-5 rounded-full ${
                active ? "bg-black right-0.5" : "bg-surface-muted left-0.5"
              }`}
              layout
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          </button>
          <span className="text-sm text-surface-muted">
            {active ? "Active" : "Inactive"}
          </span>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-surface-muted">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </button>
      </motion.form>
    </div>
  );
};
