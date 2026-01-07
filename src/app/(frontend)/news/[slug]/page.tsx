// src/app/(frontend)/news/[slug]/page.tsx
import type { Media } from '@/payload-types'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'
export const revalidate = 10

// 預先生成靜態路徑 (Optional, 適合 SSG)
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const news = await payload.find({
    collection: 'news',
    limit: 100,
  })

  return news.docs.map(({ slug }) => ({ slug }))
}

export default async function NewsPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'news',
    where: {
      slug: { equals: slug },
    },
  })

  const news = result.docs[0]

  if (!news) {
    return notFound()
  }

  return (
    <article className="min-h-screen bg-white pt-24 pb-24">
      {/* 頂部背景裝飾 */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-stone-50 -z-10 border-b border-stone-100" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按鈕 */}
        <Link
          href="/news"
          className="inline-flex items-center text-sm text-stone-500 hover:text-[#5F7161] mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          返回列表
        </Link>

        {/* 文章頭部 */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#5F7161] text-white rounded-full text-xs font-bold tracking-wider uppercase">
              <Tag className="w-3 h-3" />
              {news.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-stone-500 font-mono">
              <Calendar className="w-3 h-3" />
              {new Date(news.publishedDate).toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 leading-tight">
            {news.title}
          </h1>
        </header>

        {/* 主要內容區 */}
        <div className="prose prose-stone prose-lg max-w-none mb-16">
          {news.content && <RichText data={news.content} />}
        </div>

        {/* 附件與連結 */}
        {news.relatedFiles && news.relatedFiles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-stone-100">
            <h3 className="text-sm font-bold text-stone-900 mb-4 uppercase tracking-widest">
              相關附件與連結
            </h3>
            <ul className="space-y-3">
              {news.relatedFiles.map((item, index) => {
                let url = ''
                let typeLabel = ''

                // ✅ 正確的型別檢查
                if (item.type === 'file' && item.file) {
                  // item.file 可能是 string (ID) 或 Media 物件
                  const fileData = item.file as Media
                  url = fileData.url || ''
                  typeLabel = '檔案下載'
                } else if (item.type === 'link' && item.url) {
                  url = item.url
                  typeLabel = '外部連結'
                }

                if (!url) return null

                return (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between p-4 bg-stone-50 border border-stone-100 rounded-sm hover:border-[#869D85] transition-all duration-300"
                    >
                      <span className="font-medium text-stone-800 group-hover:text-[#5F7161] transition-colors">
                        {item.label}
                      </span>
                      <span className="text-xs text-stone-400 font-mono group-hover:text-[#5F7161] transition-colors">
                        {typeLabel}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* 底部行動呼籲按鈕 */}
        {news.actionLink && (
          <div className="text-center pt-8 border-t border-stone-100 mt-12">
            <a
              href={news.actionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#5F7161] text-white font-bold rounded hover:bg-[#4b594d] transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              {news.actionText || '前往查看'}
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </a>
          </div>
        )}
      </div>
    </article>
  )
}
