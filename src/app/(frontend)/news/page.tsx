// src/app/(frontend)/news/page.tsx
import SectionTitle from '@/components/ui/SectionTitle'
import configPromise from '@payload-config'
import { Calendar, ChevronRight, Tag } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const revalidate = 10

export default async function NewsPage() {
  const payload = await getPayload({ config: configPromise })

  // 抓取所有已發布的消息
  const newsData = await payload.find({
    collection: 'news',
    limit: 100, // 設定一個合理的上限
    sort: '-publishedDate',
    where: {
      _status: { equals: 'published' },
    },
  })

  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
      {/* 頂部裝飾 (延續 Hero 風格) */}
      <div className="fixed top-0 left-0 w-full h-64 bg-stone-50/50 -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="mb-12">
          <SectionTitle title="最新消息" subtitle="News & Announcements" />
        </div>

        {/* 列表區域 */}
        <div className="space-y-4">
          {newsData.docs.length === 0 && (
            <div className="text-center py-20 bg-stone-50 rounded-lg border border-stone-100">
              <p className="text-stone-500">目前沒有任何消息。</p>
            </div>
          )}

          {newsData.docs.map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.slug}`}
              className="w-full text-left group flex flex-col md:flex-row md:items-center justify-between bg-white border border-stone-200 p-6 rounded-sm hover:border-[#869D85] hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* 裝飾：Hover 時左側出現綠色線條 */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#869D85] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex-1 pl-2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  {/* 分類標籤 */}
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#5F7161] bg-[#F0F4F1] px-2 py-0.5 rounded tracking-widest">
                    <Tag className="w-3 h-3" />
                    {news.category || '公告'}
                  </span>

                  {/* 日期 */}
                  <span className="inline-flex items-center gap-1 text-xs text-stone-400 font-mono tracking-tighter">
                    <Calendar className="w-3 h-3" />
                    {new Date(news.publishedDate).toLocaleDateString('zh-TW')}
                  </span>

                  {/* 首頁置頂標記 */}
                  {news.showOnHomepage && (
                    <span className="text-[10px] text-[#869D85] border border-[#869D85]/30 px-1.5 rounded">
                      置頂
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-stone-800 group-hover:text-[#5F7161] transition-colors">
                  {news.title}
                </h3>
              </div>

              <div className="mt-4 md:mt-0 flex items-center text-[#5F7161] text-sm font-semibold md:opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                閱讀全文
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
