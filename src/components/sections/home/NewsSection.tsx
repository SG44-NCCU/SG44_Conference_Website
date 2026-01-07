import SectionTitle from '@/components/ui/SectionTitle'
import configPromise from '@payload-config'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const revalidate = 20 // 20秒重新驗證一次

export default async function NewsSection() {
  const payload = await getPayload({ config: configPromise })

  // 1. 先抓取有勾選「顯示在首頁」的最新消息
  const selectedNews = await payload.find({
    collection: 'news',
    limit: 3,
    sort: '-publishedDate',
    where: {
      _status: { equals: 'published' },
      showOnHomepage: { equals: true },
    },
  })

  let newsToDisplay = selectedNews.docs

  // 2. 如果勾選的不足3則,用最新的補足
  if (newsToDisplay.length < 3) {
    const latestNews = await payload.find({
      collection: 'news',
      limit: 3 - newsToDisplay.length,
      sort: '-publishedDate',
      where: {
        _status: { equals: 'published' },
        // 排除已經選中的
        id: { not_in: newsToDisplay.map((n) => n.id) },
      },
    })
    newsToDisplay = [...newsToDisplay, ...latestNews.docs]
  }

  // 3. 確保最多只顯示3則
  newsToDisplay = newsToDisplay.slice(0, 3)

  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="最新消息" subtitle="News & Announcements" />

        <div className="space-y-4">
          {newsToDisplay.length === 0 && (
            <p className="text-center text-stone-500">目前沒有最新消息。</p>
          )}

          {newsToDisplay.map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.slug}`}
              className="w-full text-left group flex flex-col md:flex-row md:items-center justify-between bg-white border border-stone-200 p-6 rounded-sm hover:border-[#869D85] hover:shadow-md transition-all duration-300"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold uppercase text-[#5F7161] bg-[#F0F4F1] px-2 py-0.5 rounded tracking-widest">
                    {news.category || '公告'}
                  </span>
                  <span className="text-xs text-stone-400 font-mono tracking-tighter">
                    {new Date(news.publishedDate).toLocaleDateString('zh-TW')}
                  </span>
                  {/* 顯示是否為精選 */}
                  {news.showOnHomepage && <span className="text-[10px] text-[#869D85]">📌</span>}
                </div>
                <h3 className="text-lg font-bold text-stone-800 group-hover:text-[#5F7161] transition-colors">
                  {news.title}
                </h3>
              </div>
              <div className="mt-4 md:mt-0 flex items-center text-[#5F7161] text-sm font-semibold md:opacity-0 group-hover:opacity-100 transition-opacity">
                查看詳情
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* 查看更多按鈕 - 連結到 News 頁面 */}
        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5F7161] text-white font-semibold rounded-sm hover:bg-[#869D85] transition-colors duration-300 group"
          >
            查看所有消息
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
