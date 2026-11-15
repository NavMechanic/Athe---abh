import { CoDevelopment } from '@/components/CoDevelopment';
import { ContactForm } from '@/components/ContactForm';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProblemProposition } from '@/components/ProblemProposition';
import { ProductConcepts } from '@/components/ProductConcepts';
import { ProjectFlow } from '@/components/ProjectFlow';
import { Section } from '@/components/Section';
import { Services } from '@/components/Services';
import { Workflow3D } from '@/components/Workflow3D';
import nodes from '@content/nodes.json';
import site from '@content/site.json';

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <ProblemProposition />
        <Section id="workflow" tone="muted" {...site.workflow}>
          <Workflow3D nodes={nodes} />
        </Section>
        <Services />
        <ProductConcepts />
        <ProjectFlow />
        <CoDevelopment />
        <Section id="contact" tone="muted" {...site.contact}>
          <ContactForm />
        </Section>
      </main>
      <Footer />
    </>
  );
}
