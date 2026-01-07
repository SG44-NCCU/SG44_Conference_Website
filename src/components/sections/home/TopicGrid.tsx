'use client'
import SectionTitle from '@/components/ui/SectionTitle'
import React from 'react'

interface Topic {
  id: number
  titleZh: string
  titleEn: string
}

const TOPICS_DATA: Topic[] = [
  {
    id: 1,
    titleZh: '大地測量與導航技術',
    titleEn: 'Geodetic Science and Navigation Techniques',
  },
  {
    id: 2,
    titleZh: '車載測繪與室內定位',
    titleEn: 'Mobile Mapping System and Indoor Positioning Techniques',
  },
  {
    id: 3,
    titleZh: '無人載具與災害調查',
    titleEn: 'Unmanned Vehicle Systems and Disaster Investigation',
  },
  {
    id: 4,
    titleZh: '攝影測量與測繪管理',
    titleEn: 'Photogrammetry and Surveying Management',
  },
  {
    id: 5,
    titleZh: '智慧科技與跨域應用',
    titleEn: 'Intelligent Techniques and Cross-Disciplinary Applications',
  },
  {
    id: 6,
    titleZh: '數位城市與資訊服務',
    titleEn: 'Smart City and Geoinformation Services',
  },
  {
    id: 7,
    titleZh: '環境永續與韌性防災',
    titleEn: 'Environmental Sustainability and Disaster Resilience',
  },
  {
    id: 8,
    titleZh: '衛星科技與海洋測繪',
    titleEn: 'Satellite Technology and Marine Surveying',
  },
  {
    id: 9,
    titleZh: '國土政策與規劃治理',
    titleEn: 'Land Policy and Planning Governance',
  },
  {
    id: 10,
    titleZh: '跨國交流專題',
    titleEn: 'Cross-Cutting International Session',
  },
]

const TopicGrid: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionTitle title="徵稿主題" subtitle="Call for Papers" />

        <div className="mt-12 space-y-6">
          {TOPICS_DATA.map((topic) => (
            <div
              key={topic.id}
              className="flex items-start gap-4 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 px-4 -mx-4 rounded"
            >
              <div className="flex-shrink-0 text-gray-900 font-medium min-w-[2rem]">
                {topic.id}.
              </div>
              <div className="flex-1">
                <div className="text-gray-900 font-medium mb-1">{topic.titleZh}</div>
                <div className="text-gray-600 text-sm">{topic.titleEn}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TopicGrid
