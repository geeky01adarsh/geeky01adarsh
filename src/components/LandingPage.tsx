import type { ComponentType } from "react";
import type { SiteSection } from "../types";
import { About } from "./site/About";
import { Experience } from "./site/Experience";
import { Hero } from "./site/Hero";
import { Achievements, Certifications, Contact, Education, Metrics, Writing } from "./site/InfoSections";
import { Projects } from "./site/Projects";
import { Skills } from "./site/Skills";
import { useSite } from "./site/shared";

/** `type` in portfolio.json → component. Add a new section type here. */
const REGISTRY: { [K in SiteSection["type"]]: ComponentType<{ section: Extract<SiteSection, { type: K }> }> } = {
  hero: Hero,
  about: About,
  metrics: Metrics,
  projects: Projects,
  experience: Experience,
  skills: Skills,
  writing: Writing,
  education: Education,
  certifications: Certifications,
  achievements: Achievements,
  contact: Contact,
};

export function LandingPage() {
  const { sections } = useSite();
  return (
    <div className="landing">
      {sections.map((section) => {
        const Component = REGISTRY[section.type] as ComponentType<{ section: SiteSection }> | undefined;
        if (!Component) {
          console.warn(`[portfolio] Unknown section type "${section.type}" (id: ${section.id})`);
          return null;
        }
        return <Component key={section.id} section={section} />;
      })}
    </div>
  );
}
