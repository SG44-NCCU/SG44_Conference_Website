// src/app/(frontend)/contact/page.tsx
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SectionTitle from '@/components/ui/SectionTitle'
import { Mail, Phone, MapPin } from 'lucide-react'

// --- 加入這行修復快取問題 ---
export const dynamic = 'force-dynamic' 
// -----------------------

export default async function ContactPage() {
  const payload = await getPayload({ config: configPromise })
  
  // 建議加上 draft: false 確保只抓取已發布的內容
  const contactData = await payload.findGlobal({
    slug: 'contact',
  })

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title={contactData.title || '聯絡我們'} 
            subtitle="Contact Information" 
          />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email */}
            <div className="flex flex-col items-center p-8 border border-stone-100 rounded-lg bg-stone-50">
              <Mail className="w-8 h-8 text-sg-green mb-4" />
              <h3 className="font-bold text-stone-800 mb-2">電子郵件</h3>
              <p className="text-stone-600">{contactData.email}</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center p-8 border border-stone-100 rounded-lg bg-stone-50">
              <Phone className="w-8 h-8 text-sg-green mb-4" />
              <h3 className="font-bold text-stone-800 mb-2">聯絡電話</h3>
              <p className="text-stone-600">{contactData.phone}</p>
            </div>

            {/* Address */}
            <div className="flex flex-col items-center p-8 border border-stone-100 rounded-lg bg-stone-50">
              <MapPin className="w-8 h-8 text-sg-green mb-4" />
              <h3 className="font-bold text-stone-800 mb-2">通訊地址</h3>
              <p className="text-stone-600 text-center">{contactData.address}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}