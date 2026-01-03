export const revalidate = 20

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/home/Hero'
import NewsSection from '@/components/sections/home/NewsSection'
import TopicGrid from '@/components/sections/home/TopicGrid'
import TimelineSection from '@/components/sections/home/TimelineSection'

export default function PublicPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <NewsSection />
        <TopicGrid />
        <TimelineSection />
      </main>
      {/* <Footer /> */}
    </div>
  )
}
