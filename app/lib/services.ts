import type { Category } from "./projects";

// Structure only, like `projects.ts`: the slugs the URLs and catalogue keys
// are built on, and what each service relates to. Every word a reader sees is
// under `services.items.<slug>` in messages/*.json.
export const SERVICES = ["design", "development", "brand"] as const;

export type Service = (typeof SERVICES)[number];

export function isService(value: string): value is Service {
  return (SERVICES as readonly string[]).includes(value);
}

// Which case studies a service page shows as related work, by category. Brand
// work has no shipped case study yet, so its page carries none.
export const SERVICE_CATEGORIES: Record<Service, Category[]> = {
  design: ["webapp", "ecommerce", "saas"],
  development: ["webapp", "ecommerce", "saas"],
  brand: ["brand"],
};

// schema.org `serviceType` is free text, but matching Google's vocabulary for
// the industry helps it classify the offer.
export const SERVICE_TYPES: Record<Service, string> = {
  design: "Web design",
  development: "Web development",
  brand: "Brand identity design",
};
