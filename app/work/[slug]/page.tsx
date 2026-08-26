import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { projects, getProjectBySlug } from '@/content/projects';
import { projectGalleries } from '@/content/generated-project-galleries';
import RevealOnScroll from '@/components/motion/RevealOnScroll';
import ProjectImageCarousel from '@/components/work/ProjectImageCarousel';
import type { ProjectImage } from '@/types';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [{ url: project.heroImage.src, alt: project.heroImage.alt }],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  // Resolve carousel images: folder manifest first, fallback to existing data
  const folderImages = projectGalleries[slug];
  const carouselImages: ProjectImage[] =
    folderImages && folderImages.length > 0
      ? folderImages
      : [project.heroImage, ...project.galleryImages];

  return (
    <>
      {/* Hero */}
      <section className="pt-28 md:pt-36">
        <div className="container-site mb-8">
          <RevealOnScroll>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.categories.map((cat) => (
                <span key={cat} className="text-label">{cat}</span>
              ))}
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="text-display-lg text-white mb-4 max-w-3xl">{project.title}</h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="text-body-lg max-w-2xl">{project.shortDescription}</p>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.3} direction="none">
          <ProjectImageCarousel
            images={carouselImages}
            projectTitle={project.title}
          />
        </RevealOnScroll>
      </section>

      {/* Context & Deliverables */}
      <section className="section-padding">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <RevealOnScroll>
                <h2 className="text-label mb-4">Context</h2>
              </RevealOnScroll>
              <RevealOnScroll delay={0.1}>
                <p className="text-body mb-8">{project.summary}</p>
              </RevealOnScroll>
              <RevealOnScroll delay={0.2}>
                <div className="p-5 bg-flight-950 border border-line rounded-sm">
                  <p className="text-xs text-sage leading-relaxed">
                    <span className="font-semibold text-mist">Evidence note:</span>{' '}
                    {project.evidenceNote}
                  </p>
                </div>
              </RevealOnScroll>
            </div>

            <div className="lg:col-span-5">
              <RevealOnScroll delay={0.15}>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-label mb-3">Client / Context</h3>
                    <p className="text-sm text-mist">{project.clientOrContext}</p>
                  </div>
                  <div>
                    <h3 className="text-label mb-3">Deliverables Visible</h3>
                    <ul className="space-y-1.5">
                      {project.servicesShown.map((service) => (
                        <li key={service} className="text-sm text-mist flex items-start gap-2">
                          <span className="inline-block w-1 h-1 rounded-full bg-runway mt-2 flex-shrink-0" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-label mb-3">Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.categories.map((cat) => (
                        <span key={cat} className="px-3 py-1 text-xs font-medium text-sage border border-line rounded-sm">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery section removed — all images are shown in the carousel above */}

      {/* Takeaway */}
      <section className="pb-20">
        <div className="container-site">
          <RevealOnScroll>
            <div className="max-w-2xl mx-auto text-center">
              <div className="runway-line mb-8 max-w-xs mx-auto" />
              <p className="text-editorial text-ivory">
                This project demonstrates capabilities in{' '}
                {project.categories.join(', ').toLowerCase()} — connecting
                strategy with visible, physical execution.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Prev / Next */}
      <section className="border-t border-line">
        <div className="container-site py-12">
          <div className="grid grid-cols-2 gap-8">
            <div>
              {prevProject && (
                <Link href={`/work/${prevProject.slug}`} className="group block">
                  <p className="text-xs text-sage mb-1">Previous</p>
                  <p className="text-sm font-medium text-mist group-hover:text-white transition-colors duration-300">{prevProject.title}</p>
                </Link>
              )}
            </div>
            <div className="text-right">
              {nextProject && (
                <Link href={`/work/${nextProject.slug}`} className="group block">
                  <p className="text-xs text-sage mb-1">Next</p>
                  <p className="text-sm font-medium text-mist group-hover:text-white transition-colors duration-300">{nextProject.title}</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-obsidian">
        <div className="container-site text-center">
          <RevealOnScroll>
            <h2 className="text-display-md text-white mb-6">Have a similar project?</h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-carbon font-semibold text-sm tracking-wide hover:bg-ivory transition-colors duration-300 rounded-sm"
            >
              Start a conversation
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
