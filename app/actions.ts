"use server";

import { BUDGETS, PROJECT_TYPES, TIMELINES } from "./lib/brief";
import type { ErrorKey, FormState } from "./lib/form-state";
import { sendSubmission } from "./lib/mail";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

const isOneOf = (options: readonly { value: string }[], value: string) =>
  options.some((option) => option.value === value);

// Not tied to a field: the submission was fine, delivering it wasn't.
const SEND_FAILED: FormState = {
  status: "error",
  errors: { form: "sendFailed" },
};

function checkContactDetails(
  formData: FormData,
  errors: Record<string, ErrorKey>,
) {
  const name = text(formData, "name");
  const email = text(formData, "email");

  if (!name) errors.name = "nameRequired";
  if (!email) errors.email = "emailRequired";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "emailInvalid";

  return { name, email };
}

export async function submitContact(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const errors: Record<string, ErrorKey> = {};
  const { name, email } = checkContactDetails(formData, errors);
  const message = text(formData, "message");

  if (!message) errors.message = "messageRequired";

  if (Object.keys(errors).length > 0) return { status: "error", errors };

  const sent = await sendSubmission({
    subject: `New message from ${name}`,
    replyTo: email,
    text: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
  });

  if (!sent) return SEND_FAILED;

  return { status: "success", email };
}

export async function submitBrief(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const errors: Record<string, ErrorKey> = {};
  const { name, email } = checkContactDetails(formData, errors);

  const projectType = text(formData, "projectType");
  const budget = text(formData, "budget");
  const timeline = text(formData, "timeline");
  const brief = text(formData, "brief");

  if (!isOneOf(PROJECT_TYPES, projectType))
    errors.projectType = "projectTypeRequired";
  if (!isOneOf(BUDGETS, budget)) errors.budget = "budgetRequired";
  if (!isOneOf(TIMELINES, timeline)) errors.timeline = "timelineRequired";
  if (!brief) errors.brief = "briefRequired";

  if (Object.keys(errors).length > 0) return { status: "error", errors };

  const company = text(formData, "company");
  const features = formData.getAll("features").map(String);

  const sent = await sendSubmission({
    subject: `New project brief from ${name}`,
    replyTo: email,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "—"}`,
      "",
      `Project: ${projectType}`,
      `Needs: ${features.join(", ") || "—"}`,
      `Budget: ${budget}`,
      `Timeline: ${timeline}`,
      "",
      brief,
    ].join("\n"),
  });

  if (!sent) return SEND_FAILED;

  return { status: "success", email };
}
