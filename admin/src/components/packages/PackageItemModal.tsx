import { useEffect, useMemo, useState } from "react";
import { Image, Package as PackageIcon } from "lucide-react";
import { Modal } from "../shared/Modal";
import { SelectDropdown } from "../shared/SelectDropdown";
import { formatCurrency } from "../../lib/utils";
import type { PackageItem } from "../../api/endpoints/packages";
import type { Product } from "../../types";

interface PackageItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: PackageItem) => void;
  products: Product[];
  initialItem?: PackageItem | null;
}

const emptyItem = (): PackageItem => ({
  product_id: "",
  qty: 1,
  label: "",
  emoji: "",
  image_url: "",
});

export const PackageItemModal = ({
  open,
  onClose,
  onSave,
  products,
  initialItem,
}: PackageItemModalProps) => {
  const [productId, setProductId] = useState("");
  const [label, setLabel] = useState("");
  const [qty, setQty] = useState(1);
  const [emoji, setEmoji] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!open) return;

    const item = initialItem ?? emptyItem();
    setProductId(item.product_id ?? "");
    setLabel(item.label ?? "");
    setQty(item.qty ?? 1);
    setEmoji(item.emoji ?? "");
    setImageUrl(item.image_url ?? item.product?.image_url ?? "");
  }, [initialItem, open]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [productId, products],
  );

  useEffect(() => {
    if (!selectedProduct) return;

    setLabel((current) => current || selectedProduct.name);
    setImageUrl((current) => current || selectedProduct.image_url || "");
  }, [selectedProduct]);

  const previewImage = imageUrl || selectedProduct?.image_url || "";
  const previewTitle = label || selectedProduct?.name || "Preview";

  const handleSave = () => {
    onSave({
      product_id: productId.trim() || undefined,
      qty: qty > 0 ? qty : 1,
      label: label.trim(),
      emoji: emoji.trim() || undefined,
      image_url: imageUrl.trim() || undefined,
      product: selectedProduct
        ? {
            id: selectedProduct.id,
            name: selectedProduct.name,
            image_url: selectedProduct.image_url,
            unit: selectedProduct.unit,
            active: selectedProduct.active,
          }
        : undefined,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialItem ? "Edit Item" : "Add Item"}
      description="Pick a product, preview its image, then fine-tune the package item details."
      onConfirm={handleSave}
      confirmLabel={initialItem ? "Update Item" : "Add Item"}
      panelClassName="max-w-5xl xl:max-w-6xl"
    >
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-surface-muted mb-2">
              Product
            </label>
            <SelectDropdown
              value={productId}
              onChange={setProductId}
              options={products.map((product) => ({
                value: product.id,
                label: product.name,
                description: `${product.category} · ${formatCurrency(product.price)}`,
              }))}
              placeholder="Select a product"
            />
            <p className="mt-2 text-xs text-surface-muted">
              Choosing a product auto-fills the preview image and label.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-surface-muted mb-2">
                Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full"
                placeholder="Rice 25kg (5*5)"
              />
            </div>
            <div>
              <label className="block text-sm text-surface-muted mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value) || 1)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-surface-muted mb-2">
                Emoji
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full"
                placeholder="🌾"
              />
            </div>
            <div>
              <label className="block text-sm text-surface-muted mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface-overlay/40 p-4">
          <div className="flex items-center gap-2 text-sm text-surface-muted mb-3">
            <Image size={14} />
            Preview
          </div>

          <div className="rounded-xl border border-surface-border bg-black/20 overflow-hidden">
            <div className="aspect-video bg-surface-overlay flex items-center justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={previewTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-surface-muted">
                  <PackageIcon size={24} />
                  <span className="text-xs">No image selected</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-medium text-white">
                    {previewTitle}
                  </h4>
                  <p className="text-xs text-surface-muted">
                    {selectedProduct?.unit ? `Unit: ${selectedProduct.unit}` : "Manual item"}
                  </p>
                </div>
                {emoji && (
                  <span className="text-lg leading-none">{emoji}</span>
                )}
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-surface-muted">Product ID</dt>
                  <dd className="text-white break-all">
                    {productId || "Not selected"}
                  </dd>
                </div>
                <div>
                  <dt className="text-surface-muted">Quantity</dt>
                  <dd className="text-white">{qty}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-surface-muted">Image</dt>
                  <dd className="text-white break-all">
                    {previewImage || "No image set"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
