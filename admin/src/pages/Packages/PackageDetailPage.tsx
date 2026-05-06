import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import { PageHeader } from "../../components/shared/PageHeader";
import { FormSkeleton } from "../../components/shared/LoadingSkeleton";
import { Modal } from "../../components/shared/Modal";
import { PackageItemModal } from "../../components/packages/PackageItemModal";
import {
  fetchPackageById,
  updatePackage,
  deletePackage,
  type Package,
  type PackageType,
  type PackageItem,
} from "../../api/endpoints/packages";
import { fetchProducts } from "../../api/endpoints/products";
import { getApiErrorMessage } from "../../lib/apiError";
import { formatCurrency } from "../../lib/utils";
import type { Product } from "../../types";

const emptyFixedItem = (): PackageItem => ({
  product_id: "",
  qty: 1,
  label: "",
  emoji: "",
  image_url: "",
});

export const PackageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const packageType = searchParams.get("type") as PackageType | null;

  const [loading, setLoading] = useState(true);
  const [pkg, setPkg] = useState<Package | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const [form, setForm] = useState({
    packageId: "",
    name: "",
    price: "",
    monthly: "",
    tag: "",
    tagline: "",
    rice_options: "",
    popular: false,
    active: true,
    type: "fixed" as PackageType,
    items: [emptyFixedItem()],
    simpleItems: "",
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [productRes, found] = await Promise.all([
          fetchProducts(1, undefined, 100).catch(() => ({ products: [] })),
          packageType && id ? fetchPackageById(packageType, id) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        setProducts(productRes.products ?? []);
        setPkg(found);
        if (found) {
          setForm({
            packageId: found.id,
            name: found.name,
            price: String(found.price ?? ""),
            monthly: found.type === "fixed" ? String(found.monthly ?? "") : "",
            tag: found.type === "fixed" ? found.tag ?? "" : "",
            tagline: found.type === "fixed" ? found.tagline ?? "" : "",
            rice_options: found.type === "fixed" ? found.rice_options ?? "" : "",
            popular: found.type === "fixed" ? Boolean(found.popular) : false,
            active: found.active !== false,
            type: found.type,
            items:
              found.type === "fixed"
                ? found.items.length > 0
                  ? found.items.map((item) => ({
                      product_id: item.product_id ?? "",
                      qty: item.qty ?? 1,
                      label: item.label ?? "",
                      emoji: item.emoji ?? "",
                      image_url: item.image_url ?? item.product?.image_url ?? "",
                      product: item.product,
                    }))
                  : [emptyFixedItem()]
                : [emptyFixedItem()],
            simpleItems:
              found.type === "fixed"
                ? ""
                : typeof found.items === "string"
                  ? found.items
                  : "",
          });
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load package"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, packageType]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !pkg) return;

    setSaving(true);
    setError("");
    try {
      const payload =
        pkg.type === "fixed"
          ? {
              id: form.packageId.trim(),
              name: form.name,
              price: form.price.trim(),
              monthly: form.monthly.trim(),
              active: form.active,
              popular: form.popular,
              tag: form.tag.trim() || undefined,
              tagline: form.tagline.trim() || undefined,
              rice_options: form.rice_options.trim() || undefined,
              items: form.items
                .map((item) => ({
                  product_id: item.product_id?.trim() || undefined,
                  qty: item.qty || 1,
                  label: item.label.trim(),
                  emoji: item.emoji?.trim() || undefined,
                  image_url: item.image_url?.trim() || undefined,
                }))
                .filter((item) => item.label),
            }
          : {
              id: form.packageId.trim(),
              name: form.name,
              price: Number.parseInt(form.price, 10),
              active: form.active,
              items: form.simpleItems.trim(),
            };

      const updated = await updatePackage(pkg.type, id, payload);
      setPkg(updated);
      setEditOpen(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update package"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !pkg) return;
    setDeleting(true);
    setError("");
    try {
      await deletePackage(pkg.type, id);
      navigate("/packages");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to deactivate package"));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handleSaveItem = (item: PackageItem) => {
    if (editingItemIndex === null) {
      setForm((current) => ({ ...current, items: [...current.items, item] }));
      return;
    }

    setForm((current) => ({
      ...current,
      items: current.items.map((existing, index) =>
        index === editingItemIndex ? item : existing,
      ),
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Package Details" />
        <FormSkeleton fields={4} />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-surface-muted">Package not found</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={pkg.name}
        description={`${pkg.type} package`}
        action={
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/packages")}
              className="bg-surface-raised text-white border border-surface-border px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-surface-overlay transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="bg-white text-black px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Pencil size={16} />
              Edit
            </button>
          </div>
        }
      />

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="rounded-2xl border border-surface-border bg-surface-raised p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {pkg.type === "fixed" && pkg.tag ? (
              <span className="rounded-full border border-surface-border px-2.5 py-0.5 text-xs text-white">
                {pkg.tag}
              </span>
            ) : null}
            <span className="rounded-full border border-surface-border px-2.5 py-0.5 text-xs text-surface-muted">
              {pkg.active === false ? "Inactive" : "Active"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs text-surface-muted">Price</div>
              <div className="text-lg font-semibold text-white">
                {formatCurrency(pkg.price)}
              </div>
            </div>
            <div>
              <div className="text-xs text-surface-muted">Monthly</div>
              <div className="text-lg font-semibold text-white">
                {pkg.type === "fixed" ? String(pkg.monthly) : "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-surface-muted">Type</div>
              <div className="text-sm text-white capitalize">{pkg.type}</div>
            </div>
            <div>
              <div className="text-xs text-surface-muted">ID</div>
              <div className="text-sm text-white break-all">{pkg.id}</div>
            </div>
          </div>

          {pkg.type === "fixed" ? (
            <div className="space-y-3">
              {form.items.map((item, index) => (
                <div
                  key={`${item.product_id ?? "manual"}-${index}`}
                  className="rounded-xl border border-surface-border bg-surface-overlay/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-medium text-white">
                        {item.label || "Untitled item"}
                      </h4>
                      <p className="text-xs text-surface-muted break-all">
                        {item.product_id || "No product selected"}
                      </p>
                    </div>
                    {item.emoji ? (
                      <span className="text-lg leading-none">{item.emoji}</span>
                    ) : null}
                  </div>
                  <div className="mt-3 aspect-video overflow-hidden rounded-lg border border-surface-border bg-black/20">
                    {item.image_url || item.product?.image_url ? (
                      <img
                        src={item.image_url || item.product?.image_url}
                        alt={item.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-surface-muted">
                        No preview image
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-surface-border bg-surface-overlay/40 p-4">
              <div className="text-xs text-surface-muted mb-2">Items</div>
              <p className="text-sm text-white">
                {typeof pkg.items === "string" && pkg.items.trim()
                  ? pkg.items
                  : "—"}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-surface-border bg-surface-raised p-6">
            <h3 className="text-sm font-medium text-white mb-4">Actions</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setEditOpen(true)}
                className="rounded-lg border border-surface-border px-4 py-2 text-left text-sm text-white hover:bg-surface-overlay transition-colors flex items-center gap-2"
              >
                <Pencil size={15} />
                Edit package
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="rounded-lg border border-red-500/20 px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              >
                <Trash2 size={15} />
                Deactivate package
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Package"
        description="Update the package details and save back to the admin API."
        panelClassName="max-w-4xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-surface-muted mb-2">
              ID / Slug
            </label>
            <input
              type="text"
              value={form.packageId}
              disabled
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-surface-muted mb-2">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((current) => ({ ...current, name: e.target.value }))
              }
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-surface-muted mb-2">
                Price
              </label>
              <input
                type="text"
                value={form.price}
                onChange={(e) =>
                  setForm((current) => ({ ...current, price: e.target.value }))
                }
                className="w-full"
              />
            </div>
            {pkg.type === "fixed" ? (
              <div>
                <label className="block text-sm text-surface-muted mb-2">
                  Monthly
                </label>
                <input
                  type="text"
                  value={form.monthly}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      monthly: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>
            ) : null}
          </div>

          {pkg.type === "fixed" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-surface-muted mb-2">
                    Tag
                  </label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) =>
                      setForm((current) => ({ ...current, tag: e.target.value }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-surface-muted mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        tagline: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-surface-muted mb-2">
                  Rice options
                </label>
                <input
                  type="text"
                  value={form.rice_options}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      rice_options: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      popular: !current.popular,
                    }))
                  }
                  className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer ${
                    form.popular
                      ? "bg-white"
                      : "bg-surface-overlay border border-surface-border"
                  }`}
                >
                  <motion.div
                    className={`absolute top-1 w-6 h-6 rounded-full ${
                      form.popular ? "bg-black right-1" : "bg-surface-muted left-1"
                    }`}
                    layout
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                </button>
                <span className="text-sm text-surface-muted">Popular</span>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">Items</h4>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItemIndex(null);
                    setItemModalOpen(true);
                  }}
                  className="rounded-lg border border-surface-border px-3 py-2 text-xs text-white hover:bg-surface-overlay transition-colors"
                >
                  Add Item
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {form.items.map((item, index) => (
                  <div
                    key={`${item.product_id ?? "manual"}-${index}`}
                    className="rounded-xl border border-surface-border bg-surface-overlay/40 p-4"
                  >
                    <div className="text-sm text-white">{item.label}</div>
                    <div className="text-xs text-surface-muted">
                      {item.product_id || "No product"}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItemIndex(index);
                        setItemModalOpen(true);
                      }}
                      className="mt-3 rounded-lg border border-surface-border px-3 py-2 text-xs text-white hover:bg-surface-overlay transition-colors"
                    >
                      Edit item
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm text-surface-muted mb-2">
                Items
              </label>
              <textarea
                value={form.simpleItems}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    simpleItems: e.target.value,
                  }))
                }
                className="w-full min-h-28"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setForm((current) => ({ ...current, active: !current.active }))
              }
              className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                form.active
                  ? "bg-white"
                  : "bg-surface-overlay border border-surface-border"
              }`}
            >
              <motion.div
                className={`absolute top-0.5 w-5 h-5 rounded-full ${
                  form.active ? "bg-black right-0.5" : "bg-surface-muted left-0.5"
                }`}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            </button>
            <span className="text-sm text-surface-muted">
              {form.active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="bg-surface-raised text-white border border-surface-border px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-surface-overlay transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-white text-black px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              Save
            </button>
          </div>
        </form>
      </Modal>

      <PackageItemModal
        open={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSave={handleSaveItem}
        products={products}
        initialItem={
          editingItemIndex === null ? null : form.items[editingItemIndex]
        }
      />

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Deactivate Package"
        description="This will deactivate the package. Existing applications will not be affected."
        confirmLabel="Deactivate"
        onConfirm={handleDelete}
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};
