'use client'

import SectionTitle from '@/components/ui/SectionTitle'
import { useLanguage } from '@/contexts/LanguageContext'

import React, { useState } from 'react'
import { Search, X, MapPin } from 'lucide-react'

interface Author {
  name: string
  affiliation: string
  email: string
  isCorresponding?: boolean
}

interface AbstractDoc {
  id: number
  title: string
  authors: Author[]
  abstract: string
  keywords: string
}

interface PosterClientProps {
  abstracts: AbstractDoc[]
  posters: any[]
}


export function PosterClient({ abstracts, posters }: PosterClientProps) {
  const { t } = useLanguage()
  const topics = Array.from(new Set(posters.map((p) => p.topic))).sort()
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredPosters = posters.filter((p) => {
    if (selectedTopic !== 'all' && p.topic !== selectedTopic) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase().trim()
    const abs = abstracts.find((a) => a.id === (typeof p.abstract === 'object' ? p.abstract?.id : p.abstract))
    const title = p.title.toLowerCase()
    const author = p.author.toLowerCase()
    const posterId = p.posterId.toLowerCase()
    const topic = p.topic.toLowerCase()
    const abstractText = (abs?.abstract || '').toLowerCase()
    const authorsText = abs?.authors?.map((a) => a.name.toLowerCase()).join(' ') || ''
    return (
      title.includes(q) ||
      author.includes(q) ||
      posterId.includes(q) ||
      topic.includes(q) ||
      abstractText.includes(q) ||
      authorsText.includes(q)
    )
  })

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <SectionTitle title="海報發表" subtitle="Poster Sessions" />
      </div>

      {/* Search and Topic Filters Container */}
      <div className="bg-white border border-stone-200 shadow-sm rounded-xl p-6 mb-10 space-y-6">
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              size={18}
            />
            <input
              type="text"
              placeholder="搜尋海報編號、標題、報告人、作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-[#4d4c9d] focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center py-2.5 px-4 bg-[#4d4c9d]/5 rounded-lg border border-[#4d4c9d]/10 text-stone-700 text-sm gap-2 shrink-0">
            <MapPin size={16} className="text-[#4d4c9d]" />
            <span>發表地點：<strong className="font-semibold">信義講堂 (313教室)</strong></span>
          </div>
        </div>

        {/* Topic Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedTopic('all')}
            className={`px-4 py-2 text-xs font-semibold tracking-wider transition-all rounded-lg ${
              selectedTopic === 'all'
                ? 'bg-[#4d4c9d] text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            全部主題
          </button>
          {topics.map((topic, idx) => (
            <React.Fragment key={topic}>
              {idx === 4 && <div className="w-full h-0 basis-full my-0.5" />}
              <button
                onClick={() => setSelectedTopic(topic)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider transition-all rounded-lg ${
                  selectedTopic === topic
                    ? 'bg-[#4d4c9d] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {topic}
              </button>
            </React.Fragment>
          ))}
        </div>

        {searchQuery && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>找到 {filteredPosters.length} 篇海報發表</span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#4d4c9d] font-semibold hover:underline"
            >
              清除搜尋
            </button>
          </div>
        )}
      </div>

      {/* Poster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosters.map((poster) => {
          const abs = abstracts.find((a) => a.id === (typeof poster.abstract === 'object' ? poster.abstract?.id : poster.abstract))
          return (
            <div
              key={poster.id}
              className="bg-white border border-stone-200 shadow-sm rounded-xl p-6 hover:border-[#4d4c9d]/40 hover:shadow transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-4 gap-3">
                <span className="bg-[#4d4c9d] text-white font-bold px-3 py-1 text-base rounded shadow-sm">
                  {poster.posterId}
                </span>
                <span className="bg-stone-100 text-stone-600 px-3 py-1 text-xs font-semibold rounded">
                  {poster.topic}
                </span>
              </div>

              <h2 className="text-lg font-bold text-stone-800 mb-4 leading-snug flex-grow">
                {poster.title}
              </h2>

              <div className="mt-auto space-y-3 pt-3 border-t border-stone-100">
                <div className="text-stone-700 font-semibold text-sm">
                  報告人： <span className="text-[#4d4c9d]">{poster.author}</span>
                </div>

                {abs && abs.authors && abs.authors.length > 0 && (
                  <div className="text-stone-500 text-xs">
                    作者： {abs.authors.map((a) => a.name).join('、')}
                  </div>
                )}

                {abs && abs.keywords && (
                  <div className="text-stone-500 text-xs mt-1">
                    <span className="font-semibold text-[#4d4c9d]">關鍵字：</span> {abs.keywords}
                  </div>
                )}

                {abs && abs.abstract && (
                  <details className="mt-3 group/det pt-2">
                    <summary className="text-xs font-semibold text-[#4d4c9d] hover:text-[#3b3a8c] cursor-pointer select-none">
                      查看摘要內容
                    </summary>
                    <div className="mt-2 text-stone-600 text-xs leading-relaxed text-justify whitespace-pre-wrap bg-stone-50 p-3 rounded border border-stone-200">
                      {abs.abstract}
                    </div>
                  </details>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filteredPosters.length === 0 && (
        <div className="text-center py-16 text-stone-400 bg-white border border-stone-200 rounded-xl shadow-sm">
          無符合條件的海報發表
        </div>
      )}
    </div>
  )
}
