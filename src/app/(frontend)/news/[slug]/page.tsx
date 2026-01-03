export const revalidate = 60 // 每 60 秒更新內容 (例如改錯字後，1分鐘後前台會變)
export const dynamicParams = true // 允許訪問部署時還不存在的新文章

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FileText, Mail, Phone, ChevronLeft } from 'lucide-react'
// 如果您還沒安裝這個套件，終端機執行: pnpm add @payloadcms/richtext-lexical
import { RichText } from '@payloadcms/richtext-lexical/react' 

export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'news',
    where: {
      slug: { equals: slug },
    },
  })

  if (!result.docs[0]) return notFound()
  const news = result.docs[0]

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/#news" className="inline-flex items-center text-stone-500 hover:text-[#5F7161] mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          返回列表
        </Link>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="border-b border-stone-100 px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold text-[#5F7161] bg-[#F0F4F1] px-2 py-1 rounded">
                {news.category || '公告'}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {new Date(news.publishedDate).toLocaleDateString('zh-TW')}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900">
              {news.title}
            </h1>
          </div>

          <div className="p-8">
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
               {news.content && <RichText data={news.content} />}
            </div>

            {news.actionLink && (
              <div className="mt-10 p-6 bg-[#F8FAF9] rounded-lg border border-[#E2E8E4] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#5F7161] rounded text-white">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-800">
                      相關連結 / 表單
                    </p>
                  </div>
                </div>
                <a
                  href={news.actionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#5F7161] text-white px-8 py-2.5 rounded shadow-sm hover:bg-[#4a584b] transition-colors font-bold text-sm whitespace-nowrap"
                >
                  {news.actionText || '前往查看'}
                </a>
              </div>
            )}
          </div>

          <div className="bg-stone-50 px-8 py-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Mail size={14} className="text-[#869D85]" />
              <span>sg44@nccu.edu.tw</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Phone size={14} className="text-[#869D85]" />
              <span>02-29393091 分機 50641</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}