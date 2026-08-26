import type { Metadata } from 'next';
import { projects, getAllCategories } from '@/content/projects';
import WorkGrid from './WorkGrid';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected travel marketing projects — from airport activations and B2B platforms to airline campaigns and exhibition booths.',
};

export default function WorkPage() {
  const categories = getAllCategories();

  return (
    <section className="min-h-screen pt-28 md:pt-36 pb-20">
      <div className="container-site">
        {/* Header */}
        <div className="mb-16">
          <p className="text-label mb-4">Portfolio</p>
          <h1 className="text-display-lg text-white mb-4">Selected work.</h1>
          <p className="text-body-lg max-w-2xl">
            A curated collection of travel marketing projects spanning campaigns,
            events, B2B systems, exhibitions, and print production.
          </p>
        </div>

        {/* Filterable Grid */}
        <WorkGrid projects={projects} categories={categories} />
      </div>
    </section>
  );
}
