// Shared between the client wizard and the server action so both agree on
// what a valid answer looks like. Values only — every label and hint the user
// reads comes out of the `brief` namespace in the catalogue, keyed by `value`.

export const PROJECT_TYPES = [
  { value: "marketing-site" },
  { value: "web-app" },
  { value: "e-commerce" },
  { value: "redesign" },
  { value: "not-sure" },
] as const;

export const FEATURES = [
  "cms",
  "auth",
  "payments",
  "dashboard",
  "editorial",
  "motion",
  "seo",
  "i18n",
  "integrations",
  "designSystem",
] as const;

export const BUDGETS = [
  { value: "under-5k" },
  { value: "5-15k" },
  { value: "15-40k" },
  { value: "40k-plus" },
  { value: "unsure" },
] as const;

export const TIMELINES = [
  { value: "asap" },
  { value: "1-3-months" },
  { value: "3-6-months" },
  { value: "flexible" },
] as const;

/** The wizard walks six steps; the copy for each lives under `brief.steps`. */
export const STEP_COUNT = 6;
