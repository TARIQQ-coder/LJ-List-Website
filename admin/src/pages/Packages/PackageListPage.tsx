import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "../../components/shared/PageHeader";
import { TableSkeleton } from "../../components/shared/LoadingSkeleton";
import { EmptyState } from "../../components/shared/EmptyState";
import { Modal } from "../../components/shared/Modal";
import { formatCurrency } from "../../lib/utils";
import {
  fetchAllPackages,
  deletePackage,
  type Package,
} from "../../api/endpoints/packages";

type PackageType = Package["type"];

const tabs: { key: PackageType; label: string }[] = [
  { key: "fixed", label: "Fixed" },
  { key: "provisions", label: "Provisions" },
  { key: "detergents", label: "Detergents" },
];

const getPackageItemsSummary = (pkg: Package) => {
  if (pkg.type === "fixed") {
    return `${pkg.items.length} items`;
  }

  return pkg.items.trim() ? pkg.items : "—";
};

export const PackageListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("type") as PackageType) || "fixed";

  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    try {
      const all = await fetchAllPackages();
      setPackages(
        all.filter((p) => p.type === activeTab && p.active !== false),
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const pkg = packages.find((p) => p.id === deleteId);
    if (!pkg) return;

    setDeleting(true);
    try {
      await deletePackage(pkg.type, deleteId);
      setPackages((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  const switchTab = (type: PackageType) => {
    setSearchParams({ type });
  };

  const filtered = packages;

  return (
    <div>
      <PageHeader
        title="Packages"
        description="Manage fixed and department bundles"
        action={
          <button
            onClick={() => navigate("/packages/new")}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            Add Package
          </button>
        }
      />

      <div className="flex gap-2 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer transition-colors capitalize ${
              activeTab === key
                ? "bg-white text-black border-white"
                : "border-surface-border text-surface-muted hover:text-white hover:border-surface-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No packages"
          description={`No ${activeTab} packages found.`}
          action={
            <button
              onClick={() => navigate("/packages/new")}
              className="bg-white text-black px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Add Package
            </button>
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface-raised border border-surface-border rounded-xl overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left text-xs text-surface-muted font-medium px-6 py-3">
                  Name
                </th>
                <th className="text-left text-xs text-surface-muted font-medium px-6 py-3">
                  Items
                </th>
                <th className="text-left text-xs text-surface-muted font-medium px-6 py-3">
                  Price
                </th>
                <th className="text-left text-xs text-surface-muted font-medium px-6 py-3">
                  Monthly
                </th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((pkg) => (
                <tr
                  key={pkg.id}
                  onClick={() => navigate(`/packages/${pkg.id}?type=${pkg.type}`)}
                  className="border-b border-surface-border last:border-0 hover:bg-surface-overlay/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3 text-sm text-white">{pkg.name}</td>
                  <td className="px-6 py-3 text-sm text-surface-muted">
                    {getPackageItemsSummary(pkg)}
                  </td>
                  <td className="px-6 py-3 text-sm text-white font-mono">
                    {formatCurrency(pkg.price)}
                  </td>
                  <td className="px-6 py-3 text-sm text-surface-muted font-mono">
                    {pkg.type === "fixed" ? formatCurrency(pkg.monthly) : "—"}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/packages/${pkg.id}?type=${pkg.type}`);
                        }}
                        className="text-surface-muted cursor-pointer hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed p-1.5 rounded-lg cursor-pointer"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(pkg.id);
                        }}
                        className="text-surface-muted cursor-pointer hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed p-1.5 rounded-lg cursor-pointer hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Package"
        description="This will deactivate the package. Existing applications will not be affected."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};
