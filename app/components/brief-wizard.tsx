"use client";

import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { submitBrief } from "../actions";
import { PillAction } from "./pill-button";
import {
  BUDGETS,
  FEATURES,
  PROJECT_TYPES,
  STEP_COUNT,
  TIMELINES,
} from "../lib/brief";
import { errorFor, IDLE, type ErrorKey } from "../lib/form-state";
import { Field, fieldClass } from "./field";

type Answers = {
  projectType: string;
  features: string[];
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  brief: string;
};

const EMPTY: Answers = {
  projectType: "",
  features: [],
  budget: "",
  timeline: "",
  name: "",
  email: "",
  company: "",
  brief: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the checks in submitBrief so the wizard can block a step before the
// roundtrip; the server still re-validates everything. Like the action, this
// names the failed check and leaves the wording to the render.
function validateStep(step: number, answers: Answers) {
  const errors: Record<string, ErrorKey> = {};
  if (step === 0 && !answers.projectType)
    errors.projectType = "pickOneToContinue";
  if (step === 2 && !answers.budget) errors.budget = "pickRangeToContinue";
  if (step === 3 && !answers.timeline)
    errors.timeline = "pickTimelineToContinue";
  if (step === 4) {
    if (!answers.name.trim()) errors.name = "nameRequired";
    if (!answers.email.trim()) errors.email = "emailRequired";
    else if (!EMAIL_PATTERN.test(answers.email)) errors.email = "emailInvalid";
    if (!answers.brief.trim()) errors.brief = "briefRequired";
  }
  return errors;
}

const CARD =
  "ease-quart block border border-ink/12 p-[1.6vw] transition-colors duration-300 hover:border-ink/40 peer-checked:border-ink peer-checked:bg-sand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink max-md:p-5";

function OptionCard({
  name,
  value,
  label,
  hint,
  checked,
  onSelect,
}: {
  name: string;
  value: string;
  label: string;
  hint?: string;
  checked: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <label className="block cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="peer sr-only"
      />
      <span className={CARD}>
        <span className="t-s block">{label}</span>
        {hint && <span className="t-p mt-[0.8vw] block">{hint}</span>}
      </span>
    </label>
  );
}

function StepError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="t-xxs text-danger mt-[1.2vw]">
      {message}
    </p>
  );
}

export function BriefWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [errors, setErrors] = useState<Record<string, ErrorKey>>({});
  const [state, formAction, pending] = useActionState(submitBrief, IDLE);
  const t = useTranslations("brief");
  const f = useTranslations("form");
  const e = useTranslations("errors");

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const toggleFeature = (feature: string) =>
    setAnswers((current) => ({
      ...current,
      features: current.features.includes(feature)
        ? current.features.filter((entry) => entry !== feature)
        : [...current.features, feature],
    }));

  const goNext = () => {
    const stepErrors = validateStep(step, answers);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((current) => Math.min(current + 1, STEP_COUNT - 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  };

  if (state.status === "success") {
    return (
      <div className="gutter max-w-[46vw] py-[8vw] max-md:max-w-none">
        <p className="t-xs mb-[1.2vw] text-muted">{t("success.eyebrow")}</p>
        <h2 className="t-ml mb-[2vw]">{t("success.title")}</h2>
        <p className="mb-10 text-[17px] leading-[1.6] text-ink/60">
          {t("success.body", { email: state.email })}
        </p>
        <Link href="/work" className="link t-xs">
          {t("success.link")}
        </Link>
      </div>
    );
  }

  const isReview = step === STEP_COUNT - 1;
  const progress = ((step + 1) / STEP_COUNT) * 100;

  const summary = [
    {
      label: t("summary.project"),
      value: answers.projectType
        ? t(`projectTypes.${answers.projectType}.label`)
        : "",
      step: 0,
    },
    {
      label: t("summary.needs"),
      value: answers.features.length
        ? answers.features.map((key) => t(`features.${key}`)).join(", ")
        : t("summary.empty"),
      step: 1,
    },
    {
      label: t("summary.budget"),
      value: answers.budget ? t(`budgets.${answers.budget}`) : "",
      step: 2,
    },
    {
      label: t("summary.timeline"),
      value: answers.timeline ? t(`timelines.${answers.timeline}`) : "",
      step: 3,
    },
    {
      label: t("summary.contact"),
      value: [answers.name, answers.company, answers.email]
        .filter(Boolean)
        .join(" · "),
      step: 4,
    },
    { label: t("summary.brief"), value: answers.brief, step: 4 },
  ];

  return (
    <div className="gutter max-w-[56vw] pb-[8vw] max-md:max-w-none">
      <div className="mb-3 flex items-baseline justify-between gap-6">
        <p className="t-xs">
          {t("progress", {
            current: String(step + 1).padStart(2, "0"),
            total: String(STEP_COUNT).padStart(2, "0"),
          })}
        </p>
        <p className="t-xs text-muted">{Math.round(progress)}%</p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={STEP_COUNT}
        aria-label={t("progressLabel")}
        className="h-0.5 w-full bg-black/8"
      >
        <div
          className="ease-draw bg-ink h-full transition-[width] duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="t-ml mt-[3vw]">{t(`steps.${step}.title`)}</h2>
      <p className="mt-3 mb-9 text-[17px] text-ink/60">
        {t(`steps.${step}.hint`)}
      </p>

      {step === 0 && (
        <fieldset>
          <legend className="sr-only">{t("steps.0.title")}</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PROJECT_TYPES.map((option) => (
              <OptionCard
                key={option.value}
                name="projectType"
                value={option.value}
                label={t(`projectTypes.${option.value}.label`)}
                hint={t(`projectTypes.${option.value}.hint`)}
                checked={answers.projectType === option.value}
                onSelect={(value) => set("projectType", value)}
              />
            ))}
          </div>
          <StepError
            message={errors.projectType && e(errors.projectType)}
          />
        </fieldset>
      )}

      {step === 1 && (
        <fieldset>
          <legend className="sr-only">{t("steps.1.title")}</legend>
          <div className="flex flex-wrap gap-2.5">
            {FEATURES.map((feature) => (
              <label key={feature} className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={answers.features.includes(feature)}
                  onChange={() => toggleFeature(feature)}
                  className="peer sr-only"
                />
                <span className="t-xs ease-quart inline-block rounded-full border border-ink/20 px-4 py-2 transition-colors duration-300 hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                  {t(`features.${feature}`)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend className="sr-only">{t("steps.2.title")}</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {BUDGETS.map((option) => (
              <OptionCard
                key={option.value}
                name="budget"
                value={option.value}
                label={t(`budgets.${option.value}`)}
                checked={answers.budget === option.value}
                onSelect={(value) => set("budget", value)}
              />
            ))}
          </div>
          <StepError message={errors.budget && e(errors.budget)} />
        </fieldset>
      )}

      {step === 3 && (
        <fieldset>
          <legend className="sr-only">{t("steps.3.title")}</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TIMELINES.map((option) => (
              <OptionCard
                key={option.value}
                name="timeline"
                value={option.value}
                label={t(`timelines.${option.value}`)}
                checked={answers.timeline === option.value}
                onSelect={(value) => set("timeline", value)}
              />
            ))}
          </div>
          <StepError message={errors.timeline && e(errors.timeline)} />
        </fieldset>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-5">
          <Field
            id="brief-name"
            label={f("name")}
            error={errors.name && e(errors.name)}
          >
            <input
              id="brief-name"
              autoComplete="name"
              value={answers.name}
              onChange={(event) => set("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "brief-name-error" : undefined}
              className={fieldClass(Boolean(errors.name))}
            />
          </Field>

          <Field
            id="brief-email"
            label={f("email")}
            error={errors.email && e(errors.email)}
          >
            <input
              id="brief-email"
              type="email"
              autoComplete="email"
              value={answers.email}
              onChange={(event) => set("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "brief-email-error" : undefined}
              className={fieldClass(Boolean(errors.email))}
            />
          </Field>

          <Field id="brief-company" label={t("fields.company")}>
            <input
              id="brief-company"
              autoComplete="organization"
              value={answers.company}
              onChange={(event) => set("company", event.target.value)}
              className={fieldClass(false)}
            />
          </Field>

          <Field
            id="brief-text"
            label={t("fields.brief")}
            error={errors.brief && e(errors.brief)}
          >
            <textarea
              id="brief-text"
              rows={5}
              placeholder={t("fields.briefPlaceholder")}
              value={answers.brief}
              onChange={(event) => set("brief", event.target.value)}
              aria-invalid={Boolean(errors.brief)}
              aria-describedby={errors.brief ? "brief-text-error" : undefined}
              className={`${fieldClass(Boolean(errors.brief))} resize-y`}
            />
          </Field>
        </div>
      )}

      {isReview && (
        <dl className="flex flex-col gap-6">
          {summary.map((row) => (
            <div
              key={row.label}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-black/8 pb-6"
            >
              <div className="max-w-[40vw] max-md:max-w-none">
                <dt className="t-xxs mb-[0.6vw] text-muted">{row.label}</dt>
                <dd className="text-[17px] leading-[1.6] text-ink">
                  {row.value || "—"}
                </dd>
              </div>
              <button
                type="button"
                onClick={() => setStep(row.step)}
                className="link t-xs cursor-pointer border-none bg-transparent"
              >
                {t("summary.edit")}
              </button>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-10 flex items-center gap-3.5">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="link t-xs cursor-pointer border-none bg-transparent"
          >
            {t("back")}
          </button>
        )}

        {isReview ? (
          <form action={formAction}>
            <input type="hidden" name="projectType" value={answers.projectType} />
            <input type="hidden" name="budget" value={answers.budget} />
            <input type="hidden" name="timeline" value={answers.timeline} />
            <input type="hidden" name="name" value={answers.name} />
            <input type="hidden" name="email" value={answers.email} />
            <input type="hidden" name="company" value={answers.company} />
            <input type="hidden" name="brief" value={answers.brief} />
            {answers.features.map((feature) => (
              <input
                key={feature}
                type="hidden"
                name="features"
                value={feature}
              />
            ))}
            <PillAction disabled={pending}>
              {pending ? t("sending") : t("send")}
            </PillAction>
          </form>
        ) : (
          <PillAction type="button" onClick={goNext}>
            {step === 1 && answers.features.length === 0
              ? t("skip")
              : t("next")}
          </PillAction>
        )}
      </div>

      {state.status === "error" && (
        <p role="alert" className="t-xxs text-danger mt-[1.2vw]">
          {(() => {
            const key =
              errorFor(state, "form") ??
              errorFor(state, "email") ??
              errorFor(state, "brief");
            return key ? e(key) : e("briefRejected");
          })()}
        </p>
      )}
    </div>
  );
}
