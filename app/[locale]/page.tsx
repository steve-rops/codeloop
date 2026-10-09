import { getTranslations } from "next-intl/server";
import { Contact } from "@/app/components/contact";
import { Engagements } from "@/app/components/engagements";
import { HomeFaq, type FaqItem } from "@/app/components/faq";
import { Hero } from "@/app/components/hero";
import { JsonLd } from "@/app/components/json-ld";
import { Services } from "@/app/components/services";
import { Work } from "@/app/components/work";
import { messagesList } from "@/app/lib/messages-list";
import { faqEntities, pageUrl, webPage } from "@/app/lib/seo";

export default async function Home(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  const meta = await getTranslations({ locale, namespace: "metadata.home" });
  const faq = await getTranslations({ locale, namespace: "faq" });

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            webPage({
              locale,
              name: meta("title"),
              description: meta("description"),
            }),
            // The questions live on this page, so the FAQ node is this page's
            // too; it lists the same pairs the section renders.
            {
              "@type": "FAQPage",
              "@id": `${pageUrl(locale)}#faq`,
              mainEntity: faqEntities(messagesList<FaqItem>(faq.raw("items"))),
            },
          ],
        }}
      />
      <Hero />
      <Services />
      <Work />
      <Engagements />
      <HomeFaq />
      <Contact />
    </main>
  );
}
