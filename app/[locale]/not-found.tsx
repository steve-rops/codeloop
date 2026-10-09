import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/app/components/page-header";
import { Reveal } from "@/app/components/reveal";
import { stagger } from "@/app/lib/motion";
import { italic } from "@/app/lib/rich";

// Rendered for any unknown path under a known locale, in that locale, inside
// the normal chrome. Next sends it with a 404 status, so crawlers drop the
// address instead of indexing an error page.
export default function NotFound() {
  const t = useTranslations("notFound");
  const links = [
    { href: "/", label: t("home") },
    { href: "/work", label: t("work") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <main>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t.rich("title", italic)}
        intro={t("intro")}
      />
      <Reveal as="nav" className="gutter pb-[var(--section-y)]">
        <ul className="flex flex-col">
          {links.map((link, index) => (
            <li key={link.href} className="mask">
              <Link href={link.href} className="a-up t-ml block" style={stagger(index + 1, 0.08)}>
                {link.label} &#8594;
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </main>
  );
}
