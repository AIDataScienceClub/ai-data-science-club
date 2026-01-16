import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import Card from '@/components/Card'

export const metadata: Metadata = {
  title: 'Projects | Atlanta AI & Data Lab',
  description: 'Real problems. Real data. Real impact. Explore what our students have built.',
}

export default function Projects() {
  const projects = [
    {
      title: 'Community Food Access Map',
      summary: 'Interactive tool showing SNAP-accepting stores and food pantries across Atlanta\'s food deserts.',
      category: 'Community',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
      slug: 'community-food-access-map',
    },
    {
      title: 'Neighborhood Safety Survey',
      summary: 'Data-driven insights helping community leaders prioritize safety investments.',
      category: 'Community',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      slug: 'neighborhood-safety-survey',
    },
    {
      title: 'Mutual Aid Directory',
      summary: 'Searchable resource directory connecting people in crisis with grassroots support networks.',
      category: 'Community',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop',
      slug: 'mutual-aid-directory',
    },
    {
      title: 'Attendance Dashboard',
      summary: 'Predictive analytics helping school counselors identify at-risk students earlier.',
      category: 'School Operations',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      slug: 'attendance-dashboard',
    },
    {
      title: 'Library Recommender',
      summary: 'AI-powered book recommendations promoting diverse authors and genres.',
      category: 'School Operations',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop',
      slug: 'library-recommender',
    },
    {
      title: 'Cafeteria Waste Tracker',
      summary: 'Data-driven menu optimization reducing food waste and environmental impact.',
      category: 'School Operations',
      image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&h=600&fit=crop',
      slug: 'cafeteria-waste-tracker',
    },
    {
      title: 'Air Quality Monitors',
      summary: 'Low-cost sensor network providing real-time pollution data to underserved neighborhoods.',
      category: 'Environment',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      slug: 'air-quality-monitors',
    },
    {
      title: 'Tree Canopy Mapper',
      summary: 'Satellite analysis identifying priority areas for urban tree planting.',
      category: 'Environment',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
      slug: 'tree-canopy-mapper',
    },
    {
      title: 'Water Quality Dashboard',
      summary: 'Real-time water safety data for river recreation with SMS alerts.',
      category: 'Environment',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      slug: 'water-quality-dashboard',
    },
    {
      title: 'Teen Mental Health Survey',
      summary: 'Anonymous survey analysis informing school wellness programs and support services.',
      category: 'Health',
      image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&h=600&fit=crop',
      slug: 'teen-mental-health-survey',
    },
    {
      title: 'Health Resource Finder',
      summary: 'Searchable directory of free/low-cost health services for uninsured residents.',
      category: 'Health',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
      slug: 'health-resource-finder',
    },
    {
      title: 'Accessible Transit Navigator',
      summary: 'Trip planner with real-time accessibility data for wheelchair and blind/low-vision users.',
      category: 'Accessibility',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
      slug: 'accessible-transit-navigator',
    },
  ]

  return (
    <>
      <Hero
        title="Projects That Matter"
        subtitle="Real problems. Real data. Real impact. Explore what our students have built—and imagine what you could create next."
        primaryCTA={{ label: 'Join a Project Team', href: '/get-involved#students' }}
      />

      {/* Search & Filters (simplified for now) */}
      <section className="section-py bg-neutral-gray-100">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto mb-8">
            <input
              type="search"
              placeholder="Search by keyword (e.g., 'food access,' 'school,' 'accessibility')..."
              className="w-full px-4 py-3 rounded-lg border-2 border-neutral-gray-300 focus:border-primary focus:outline-none"
              aria-label="Search projects"
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {['All', 'Community', 'School Ops', 'Environment', 'Health', 'Accessibility', 'Arts/Media', 'Research'].map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors focus-visible:outline-primary"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                image={project.image}
                title={project.title}
                summary={project.summary}
                tag={project.category}
                cta={{ label: 'View Details', href: `/projects/${project.slug}` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py bg-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Want to Build Something Like This?</h2>
            <p className="text-lg mb-8 text-white/90">
              Join our next project sprint. Applications open February 1.
            </p>
            <a href="/get-involved#students" className="btn btn-secondary btn-large">
              Apply Now
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
