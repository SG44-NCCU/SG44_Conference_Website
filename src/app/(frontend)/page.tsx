// 移除 Navbar 和 Footer 的 import
import Hero from '@/components/sections/home/Hero'
import NewsSection from '@/components/sections/home/NewsSection'
import TimelineSection from '@/components/sections/home/TimelineSection'
import TopicGrid from '@/components/sections/home/TopicGrid'

export default function PublicPage() {
  return (
    <div className="bg-white"> 
      {/* 這裡不用再寫 Navbar 了，因為 layout 已經有了 */}
      {/* 這裡原本的 <main> 也可以拿掉，因為 layout 已經包了一層 main */}
      
      <Hero />
      <TimelineSection />
      <NewsSection />
      <TopicGrid />
      
      {/* Footer 也不用了 */}
    </div>
  )
}