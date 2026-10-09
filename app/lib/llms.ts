import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { messagesList } from "./messages-list";
import { PROJECTS } from "./projects";
import { pageUrl } from "./seo";
import { SERVICES } from "./services";
import {
  BASE_LOCALITY,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FOUNDER_NAME,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "./site";

// The site as plain Markdown for language models, following the llms.txt
// proposal (https://llmstxt.org): /llms.txt is the short index, /llms-full.txt
// is every page's copy inlined. Both are written from the English catalogue and
// the project list, so they stay in step with the pages without being edited.
const LOCALE = routing.defaultLocale;

const ENGAGEMENTS = ["discovery", "build", "partner"] as const;

export const TEXT_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
};

type Faq = { q: string; a: string };

async function catalogue() {
  const t = await getTranslations({ locale: LOCALE });
  const translations = routing.locales
    .filter((locale) => locale !== LOCALE)
    .map((locale) => `${pageUrl(locale)} (${locale})`)
    .join(", ");

  return { t, translations };
}

function identity(t: Awaited<ReturnType<typeof catalogue>>["t"]) {
  return `${SITE_NAME} is a freelance web design and development studio run by ${FOUNDER_NAME}, based in ${BASE_LOCALITY}, Greece, working remotely with clients across Greece and worldwide, in English and Greek. Services: ${SERVICES.map((service) => t(`services.items.${service}.title`).toLowerCase()).join(", ")}. Contact: ${CONTACT_EMAIL}, ${CONTACT_PHONE} (WhatsApp).`;
}

function faqMarkdown(items: Faq[]) {
  return items.map((item) => `**${item.q}**\n\n${item.a}`).join("\n\n");
}

export async function llmsIndex() {
  const { t, translations } = await catalogue();

  return `# ${SITE_NAME}

> ${t("metadata.home.description")}

${identity(t)} Every page is also available in other languages: ${translations}.

## Pages

- [Home](${pageUrl(LOCALE)}): Services, selected work, how engagements are structured, and frequently asked questions.
- [Services](${pageUrl(LOCALE, "/services")}): ${t("metadata.services.description")}
${SERVICES.map((service) => `- [${t(`services.items.${service}.title`)}](${pageUrl(LOCALE, `/services/${service}`)}): ${t(`metadata.service.${service}.description`)}`).join("\n")}
- [Work](${pageUrl(LOCALE, "/work")}): ${t("metadata.work.description")}
- [About the studio](${pageUrl(LOCALE, "/about")}): ${t("metadata.about.description")}
- [Start a project](${pageUrl(LOCALE, "/new")}): ${t("metadata.new.description")}
- [Contact](${pageUrl(LOCALE, "/contact")}): ${t("metadata.contact.description")}

## Case studies

${PROJECTS.map((project) => `- [${t(`projects.${project.slug}.client`)}](${pageUrl(LOCALE, `/work/${project.slug}`)}): ${t(`projects.${project.slug}.summary`)}`).join("\n")}

## Optional

- [Full site content](${SITE_URL}/llms-full.txt): Services, engagement models, the FAQ and every case study in full, as one Markdown file.
- [Sitemap](${SITE_URL}/sitemap.xml): Every page in every language.
`;
}

export async function llmsFull() {
  const { t, translations } = await catalogue();

  const services = SERVICES.map((service) => {
    const key = `services.items.${service}`;
    return `### ${t(`${key}.title`)}

${t(`${key}.desc`)}

${t(`${key}.intro`)}

What you get: ${messagesList(t.raw(`${key}.deliverables`)).join("; ")}.

How it goes:

${messagesList(t.raw(`${key}.process`))
  .map((step, index) => `${index + 1}. ${step}`)
  .join("\n")}

Good for: ${messagesList(t.raw(`${key}.goodFor`)).join("; ")}.

${faqMarkdown(messagesList<Faq>(t.raw(`${key}.faq`)))}

Page: ${pageUrl(LOCALE, `/services/${service}`)}`;
  }).join("\n\n");

  const engagements = ENGAGEMENTS.map((engagement) => {
    const key = `engagements.items.${engagement}`;
    return `### ${t(`${key}.name`)} (${t(`${key}.duration`)})

${t(`${key}.body`)}

Includes: ${messagesList(t.raw(`${key}.includes`)).join(", ")}.`;
  }).join("\n\n");

  const projects = PROJECTS.map((project) => {
    const key = `projects.${project.slug}`;
    const inDevelopment = project.status === "development";
    const results = inDevelopment
      ? []
      : messagesList<{ label: string; value: string }>(t.raw(`${key}.results`));

    return `### ${t(`${key}.client`)}: ${t(`${key}.title`)}

- Case study: ${pageUrl(LOCALE, `/work/${project.slug}`)}
${project.url ? `- Live site: ${project.url[LOCALE]}\n` : ""}- Year: ${project.year}${inDevelopment ? ` (${t("projectPage.inDevelopment").toLowerCase()})` : ""}
- Type: ${t(`categories.${project.category}`)}
- Role: ${t(`${key}.role`)}
- Duration: ${t(`${key}.duration`)}
- Stack: ${project.stack.join(", ")}
- Scope: ${messagesList(t.raw(`${key}.tags`)).join(", ")}

${t(`${key}.summary`)}

**The problem.** ${t(`${key}.challenge`)}

**What we did.**

${messagesList(t.raw(`${key}.approach`))
  .map((step) => `- ${step}`)
  .join("\n")}${
      results.length > 0
        ? `\n\n**What changed.**\n\n${results.map((result) => `- ${result.label}: ${result.value}`).join("\n")}`
        : ""
    }`;
  }).join("\n\n");

  const principles = messagesList<{ title: string; body: string }>(
    t.raw("aboutPage.principles"),
  )
    .map((principle) => `- **${principle.title}.** ${principle.body}`)
    .join("\n");

  return `# ${SITE_NAME}

> ${t("metadata.home.description")}

${identity(t)} This file is the full content of ${pageUrl(LOCALE)} as Markdown; the same pages exist in other languages: ${translations}.

## About the studio

${t("aboutPage.intro")}

${t("aboutPage.whoBody")}

${principles}

Tools: ${t("aboutPage.stackBody")}

Page: ${pageUrl(LOCALE, "/about")}

## Services

${t("services.body")}

${services}

## How we work

${engagements}

## Selected work

${projects}

## Frequently asked questions

${faqMarkdown(messagesList<Faq>(t.raw("faq.items")))}

## Starting a project

The brief at ${pageUrl(LOCALE, "/new")} takes about two minutes: what is being built (${messagesList<{ label: string }>(t.raw("brief.projectTypes")).map((type) => type.label.toLowerCase()).join(", ")}), what it needs to do, a budget range (${messagesList(t.raw("brief.budgets")).join(", ")}) and a timeline (${messagesList(t.raw("brief.timelines")).join(", ")}). The reply comes within a working day, with a plan, a timeline and a number.

## Contact

- Email: ${CONTACT_EMAIL}
- Phone / WhatsApp: ${CONTACT_PHONE}
- Contact form: ${pageUrl(LOCALE, "/contact")}
- Response time: ${t("contactPage.details.response.value").toLowerCase()}
- Based: ${t("contactPage.details.based.value")}
- Hours: ${t("footer.addressLine3")}
- Elsewhere: ${SOCIAL_LINKS.map((link) => `${link.label} (${link.href})`).join(", ")}
`;
}
