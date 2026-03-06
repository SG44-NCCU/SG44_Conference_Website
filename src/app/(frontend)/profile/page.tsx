import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
// 需要安裝 lucide-react: pnpm add lucide-react
import { User, FileText, CreditCard, LogOut, AlertCircle, CheckCircle } from 'lucide-react'

export default async function ProfilePage() {
  const headersList = await headers()
  const payload = await getPayload({ config: configPromise })

  // 1. 取得當前登入者
  const { user } = await payload.auth({ headers: headersList })

  if (!user) {
    redirect('/login?error=unauthorized')
  }

  // 2. 抓取【報名資料】
  const registrationData = await payload.find({
    collection: 'registrations',
    where: {
      user: { equals: user.id },
    },
  })
  const myRegistration = registrationData.docs[0]

  // 3. 抓取【投稿資料】
  const submissionData = await payload.find({
    collection: 'abstracts',
    where: {
      submitter: { equals: user.id },
    },
  })
  const mySubmissions = submissionData.docs

  // --- 輔助顯示函式 ---
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-green-100 text-green-700 border-green-200',
      accepted: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-50 text-red-600 border-red-100',
      cancelled: 'bg-red-50 text-red-600 border-red-100',
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-50 text-blue-700 border-blue-200',
      reviewing: 'bg-purple-50 text-purple-700 border-purple-200',
    }
    const labels: Record<string, string> = {
      paid: '已繳費確認',
      pending: '對帳中 / 未繳費',
      cancelled: '已取消',
      processing: '處理中',
      reviewing: '審稿中',
      accepted: '接受 (Accepted)',
      rejected: '未錄取 (Rejected)',
    }
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header: 用戶卡片 */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 bg-[#5F7161] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-stone-900">{user.name || '會員'}</h1>
            <p className="text-stone-500 font-mono mb-2">{user.email}</p>
            <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full font-medium">
               {user.role === 'admin' ? '管理員' : user.role === 'reviewer' ? '審稿委員' : '一般會員'}
            </span>
          </div>
          {/* 這裡的登出通常會是一個 Server Action 或 Client Component，這邊先用 Link 示意 */}
          <Link href="/logout" className="px-4 py-2 border border-stone-200 rounded-lg text-stone-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-sm font-bold flex items-center gap-2">
            <LogOut size={16} />
            登出
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* 左區塊：報名與繳費 */}
          <section className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-stone-100 bg-stone-50/50">
              <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <CreditCard className="text-[#5F7161]" size={20} />
                研討會報名
              </h2>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              {myRegistration ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                    <span className="text-stone-500 text-sm">票種</span>
                    <span className="font-bold text-stone-800">
                      {myRegistration.ticketType === 'early-bird-student' ? '早鳥學生票' :
                       myRegistration.ticketType === 'early-bird-regular' ? '早鳥一般票' :
                       myRegistration.ticketType === 'standard-student' ? '一般學生票' : '一般票'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                     <span className="text-stone-500 text-sm">狀態</span>
                     {getStatusBadge(myRegistration.paymentStatus as string)}
                  </div>

                  {/* 狀態提示與按鈕 */}
                  {myRegistration.paymentStatus === 'paid' ? (
                    <div className="mt-auto bg-green-50 border border-green-100 p-4 rounded-lg flex items-center gap-3 text-green-800">
                      <CheckCircle size={20} />
                      <p className="font-bold text-sm">您已完成報名手續，屆時見！</p>
                    </div>
                  ) : (
                    <div className="mt-auto space-y-4">
                      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg flex gap-3 text-yellow-800 text-sm">
                        <AlertCircle size={20} className="shrink-0" />
                        <div>
                          <p className="font-bold">請盡速繳費</p>
                          <p className="mt-1 text-xs opacity-80">繳費後請回填末五碼以利對帳。</p>
                        </div>
                      </div>
                      <Link 
                        href="/dashboard/payment" // 需另外製作此頁面
                        className="block w-full text-center bg-[#5F7161] text-white font-bold py-3 rounded hover:bg-[#4a584b] transition-colors"
                      >
                        {myRegistration.paymentAccountLast5 ? '修改小匠資訊' : '回報小匠帳號'}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-stone-400 mb-6">您尚未報名本次研討會</p>
                  <Link href="/register-conference" className="px-8 py-3 border-2 border-[#5F7161] text-[#5F7161] font-bold rounded hover:bg-[#5F7161] hover:text-white transition-all">
                    前往報名
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* 右區塊：投稿紀錄 */}
          <section className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <FileText className="text-[#5F7161]" size={20} />
                論文投稿
              </h2>
              <Link href="/dashboard/submit" className="text-xs bg-stone-800 text-white px-3 py-1.5 rounded hover:bg-stone-700 transition-colors">
                + 新增
              </Link>
            </div>

            <div className="flex-1">
              {mySubmissions.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {mySubmissions.map((sub) => (
                    <div key={sub.id} className="p-6 hover:bg-stone-50 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        {getStatusBadge(sub.reviewStatus as string)}
                        <span className="text-xs text-stone-400 font-mono">
                          {new Date(sub.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-stone-900 group-hover:text-[#5F7161] transition-colors line-clamp-2">
                        {sub.title}
                      </h3>
                      {/* 如果是 Rejected 或 Accepted 且有評語，可以顯示 */}
                      {/* @ts-ignore */}
                      {sub.reviewComments && (sub.status === 'rejected' || sub.status === 'accepted') && (
                        <div className="mt-4 p-3 bg-stone-100 rounded text-xs text-stone-600">
                          <span className="font-bold block mb-1">審查意見：</span>
                          {/* @ts-ignore */}
                          {sub.reviewComments}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-stone-400 mb-6">目前沒有投稿紀錄</p>
                  <Link href="/dashboard/submit" className="text-[#5F7161] font-bold hover:underline text-sm">
                    開始投稿您的第一篇摘要 &rarr;
                  </Link>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}