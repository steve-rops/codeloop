"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { submitContact } from "../actions";
import { errorFor, IDLE } from "../lib/form-state";
import { italic } from "../lib/rich";
import { Field, FieldError, fieldClass } from "./field";
import { PillAction } from "./pill-button";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [state, formAction, pending] = useActionState(submitContact, IDLE);
  const t = useTranslations("form");
  // The action reports which check failed, not the sentence for it; the
  // wording is chosen here, where the locale is known.
  const e = useTranslations("errors");

  const nameError = errorFor(state, "name");
  const emailError = errorFor(state, "email");
  const messageError = errorFor(state, "message");
  const formError = errorFor(state, "form");

  if (state.status === "success") {
    return (
      <div role="status" className="theme-sand p-[2.5vw] text-left max-md:p-8">
        <p className="t-m mb-[1vw]">{t.rich("successTitle", italic)}</p>
        <p className="t-p">{t("successBody", { email: state.email })}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-[2vw] max-md:gap-6">
      <Field
        id="contact-name"
        label={t("name")}
        hideLabel={compact}
        error={nameError && e(nameError)}
      >
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          placeholder={t("name")}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "contact-name-error" : undefined}
          className={fieldClass(Boolean(nameError))}
        />
      </Field>

      <Field
        id="contact-email"
        label={t("email")}
        hideLabel={compact}
        error={emailError && e(emailError)}
      >
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("email")}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "contact-email-error" : undefined}
          className={fieldClass(Boolean(emailError))}
        />
      </Field>

      <Field
        id="contact-message"
        label={t("message")}
        hideLabel={compact}
        error={messageError && e(messageError)}
      >
        <textarea
          id="contact-message"
          name="message"
          rows={compact ? 4 : 6}
          placeholder={t("message")}
          aria-invalid={Boolean(messageError)}
          aria-describedby={messageError ? "contact-message-error" : undefined}
          className={`${fieldClass(Boolean(messageError))} resize-y`}
        />
      </Field>

      <div className="mt-[1vw]">
        <PillAction disabled={pending}>
          {pending ? t("sending") : t("submit")}
        </PillAction>
        <div role="alert">
          <FieldError id="contact-form-error" message={formError && e(formError)} />
        </div>
      </div>
    </form>
  );
}
