import client from "../client";

export type PackageType = "fixed" | "provisions" | "detergents";

export interface PackageItem {
  product_id?: string;
  qty: number;
  label: string;
  emoji?: string;
  image_url?: string;
  product?: {
    id: string;
    name: string;
    image_url: string;
    unit: string;
    active: boolean;
  };
}

interface PackageBase {
  id: string;
  name: string;
  price: string | number;
  active?: boolean;
  type: PackageType;
}

export interface FixedPackage extends PackageBase {
  type: "fixed";
  monthly: string | number;
  popular?: boolean;
  tag?: string;
  tagline?: string;
  rice_options?: string;
  items: PackageItem[];
}

export interface SimplePackage extends PackageBase {
  type: "provisions" | "detergents";
  items: string;
}

export type Package = FixedPackage | SimplePackage;

export interface PackageFormInput {
  id: string;
  name: string;
  price: string | number;
  monthly?: string | number;
  items: PackageItem[] | string;
  active?: boolean;
  popular?: boolean;
  tag?: string;
  tagline?: string;
  rice_options?: string;
}

const packagePathMap: Record<PackageType, string> = {
  fixed: "fixed",
  provisions: "provisions",
  detergents: "detergents",
};

const parseAmount = (value: unknown) => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    return match ? Number(match[0]) : 0;
  }

  return 0;
};

const normalizePackage = (type: PackageType, value: any): Package => {
  if (type === "fixed") {
    return {
      id: String(value.id),
      name: value.name ?? "",
      price: value.price ?? "",
      monthly: value.monthly ?? "",
      items: Array.isArray(value.items)
        ? value.items.map((item: any) => ({
            product_id: item.product_id == null ? undefined : String(item.product_id),
            qty: Number(item.qty ?? 1),
            label: item.label ?? item.name ?? "",
            emoji: item.emoji ?? undefined,
            image_url: item.image_url ?? undefined,
            product: item.product
              ? {
                  id: String(item.product.id ?? ""),
                  name: item.product.name ?? "",
                  image_url: item.product.image_url ?? "",
                  unit: item.product.unit ?? "",
                  active: Boolean(item.product.active),
                }
              : undefined,
          }))
        : [],
      active: value.active,
      type,
      popular: Boolean(value.popular),
      tag: value.tag,
      tagline: value.tagline,
      rice_options: value.rice_options,
    };
  }

  return {
    id: String(value.id),
    name: value.name ?? "",
    price: parseAmount(value.price),
    items:
      typeof value.items === "string"
        ? value.items
        : Array.isArray(value.items)
          ? value.items.map((item: any) => item.label ?? item.name ?? "").join(" · ")
          : "",
    active: value.active,
    type,
  };
};

export const fetchAllPackages = async (): Promise<Package[]> => {
  const response = await client.get("/admin/packages");
  const data = response.data.data;

  if (Array.isArray(data)) {
    return data as Package[];
  }

  const fixed = Array.isArray(data?.fixed_packages)
    ? data.fixed_packages.map((pkg: any) => normalizePackage("fixed", pkg))
    : [];
  const provisions = Array.isArray(data?.provisions_packages)
    ? data.provisions_packages.map((pkg: any) =>
        normalizePackage("provisions", pkg),
      )
    : [];
  const detergents = Array.isArray(data?.detergent_packages)
    ? data.detergent_packages.map((pkg: any) =>
        normalizePackage("detergents", pkg),
      )
    : [];

  return [...fixed, ...provisions, ...detergents];
};

export const fetchPackageById = async (
  type: PackageType,
  id: string,
): Promise<Package> => {
  const response = await client.get(`/admin/packages/${type}/${id}`);
  return normalizePackage(type, response.data.data);
};

export const createPackage = async (
  type: PackageType,
  payload: PackageFormInput,
): Promise<Package> => {
  const response = await client.post(
    `/admin/packages/${packagePathMap[type]}`,
    payload,
  );
  return normalizePackage(type, response.data.data);
};

export const updatePackage = async (
  type: PackageType,
  id: string,
  payload: Partial<PackageFormInput>,
): Promise<Package> => {
  const response = await client.patch(
    `/admin/packages/${packagePathMap[type]}/${id}`,
    payload,
  );
  return normalizePackage(type, response.data.data);
};

export const deletePackage = async (
  type: PackageType,
  id: string,
): Promise<void> => {
  await client.delete(`/admin/packages/${packagePathMap[type]}/${id}`);
};

export const fetchDashboardStats = async (): Promise<{
  totalUsers: number;
  totalProducts: number;
  totalApplications: number;
  pendingApplications: number;
  totalConversations: number;
}> => {
  const [usersRes, productsRes, appsRes, convosRes] = await Promise.all([
    client.get("/admin/users?limit=1"),
    client.get("/admin/products?limit=1"),
    client.get("/admin/applications?limit=1"),
    client.get("/admin/conversations?limit=1"),
  ]);

  const pendingRes = await client.get(
    "/admin/applications?status=pending&limit=1",
  );

  return {
    totalUsers: usersRes.data.meta?.total ?? 0,
    totalProducts: productsRes.data.meta?.total ?? 0,
    totalApplications: appsRes.data.meta?.total ?? 0,
    pendingApplications: pendingRes.data.meta?.total ?? 0,
    totalConversations: convosRes.data.meta?.total ?? 0,
  };
};
