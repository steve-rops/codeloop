import { Contact } from "@/app/components/contact";
import { Engagements } from "@/app/components/engagements";
import { Hero } from "@/app/components/hero";
import { Services } from "@/app/components/services";
import { Work } from "@/app/components/work";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Work />
      <Engagements />
      <Contact />
    </main>
  );
}
