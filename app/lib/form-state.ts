// Kept out of actions.ts because a "use server" module may only export async
// functions — a plain const there is a build error.

/**
 * Keys under the `errors` namespace rather than finished sentences.
 *
 * The actions run on the server, where `next/root-params` is unavailable and
 * the active locale therefore isn't either, so validation reports *what* failed
 * and the component that renders it decides in which language to say so.
 */
export type ErrorKey =
  | "nameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "messageRequired"
  | "projectTypeRequired"
  | "budgetRequired"
  | "timelineRequired"
  | "briefRequired"
  | "pickOneToContinue"
  | "pickRangeToContinue"
  | "pickTimelineToContinue"
  | "sendFailed";

export type FormState =
  | { status: "idle" }
  | { status: "error"; errors: Record<string, ErrorKey> }
  | { status: "success"; email: string };

export const IDLE: FormState = { status: "idle" };

export const errorFor = (state: FormState, field: string) =>
  state.status === "error" ? state.errors[field] : undefined;
