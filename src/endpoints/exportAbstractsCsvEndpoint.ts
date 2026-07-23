import { PayloadRequest } from 'payload'
import { SUB_TOPICS, SPECIAL_SESSIONS } from '@/collections/Abstracts'

const SUB_TOPIC_MAP = Object.fromEntries(SUB_TOPICS.map((t) => [t.value, t.label]))
const SPECIAL_SESSION_MAP = Object.fromEntries(SPECIAL_SESSIONS.map((s) => [s.value, s.label]))

const PRESENTATION_MAP: Record<string, string> = {
  oral: '口頭發表',
  poster: '海報發表',
  either: '口頭或海報皆可',
}

const REVIEW_STATUS_MAP: Record<string, string> = {
  pending: '待審中',
  accepted: '通過',
  rejected: '未通過',
  revision: '修改後通過',
}

export const exportAbstractsCsvEndpoint = async (req: PayloadRequest) => {
  const { payload, user } = req

  // Ensure user is admin or staff
  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return Response.json({ error: 'Forbidden. Admin or Staff access required.' }, { status: 403 })
  }

  try {
    const serverURL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.SERVER_URL ||
      'http://localhost:3000'

    // Parse optional ids parameter (comma-separated)
    const url = new URL(req.url ?? '', serverURL)
    const idsParam = url.searchParams.get('ids')
    const selectedIds = idsParam
      ? idsParam
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []

    // Build where clause
    const whereClause =
      selectedIds.length > 0 ? { id: { in: selectedIds } } : undefined

    // Fetch abstracts
    const result = await payload.find({
      collection: 'abstracts',
      where: whereClause,
      limit: 5000,
      depth: 2, // populate submitter and fullPaper
    })

    const docs = result.docs

    const headers = [
      '摘要編號',
      '論文標題',
      '投稿人姓名',
      '投稿人信箱',
      '投稿人單位',
      '作者群（姓名/單位/信箱/通訊作者）',
      '投稿子題',
      '特別論壇',
      '摘要內容',
      '關鍵字',
      '偏好發表形式',
      '是否學生',
      '申請學生論文獎',
      '全文 PDF 連結',
      '審查狀態',
      '審稿人',
      '審稿評語',
      '投稿時間',
    ]

    const rows = docs.map((doc: any) => {
      const submitter = typeof doc.submitter === 'object' ? doc.submitter : null

      // Format authors array
      const authorsStr = (doc.authors ?? [])
        .map((a: any) => {
          const parts = [a.name, a.affiliation, a.email]
          if (a.isCorresponding) parts.push('通訊')
          return parts.filter(Boolean).join('/')
        })
        .join(' | ')

      // Full paper URL
      const fullPaper = typeof doc.fullPaper === 'object' ? doc.fullPaper : null
      const fullPaperUrl = fullPaper?.url
        ? `${serverURL.replace(/\/$/, '')}${fullPaper.url}`
        : ''

      return [
        doc.id,
        doc.title ?? '',
        submitter?.name ?? '',
        submitter?.email ?? '',
        submitter?.organization ?? '',
        authorsStr,
        SUB_TOPIC_MAP[doc.subTopic ?? ''] ?? doc.subTopic ?? '',
        SPECIAL_SESSION_MAP[doc.specialSession ?? ''] ?? doc.specialSession ?? '',
        (doc.abstract ?? '').replace(/(\r\n|\n|\r)/gm, ' '),
        doc.keywords ?? '',
        PRESENTATION_MAP[doc.presentationPreference ?? ''] ?? doc.presentationPreference ?? '',
        doc.isStudent ? '是' : '否',
        doc.applyStudentAward ? '是' : '否',
        fullPaperUrl,
        REVIEW_STATUS_MAP[doc.reviewStatus ?? ''] ?? doc.reviewStatus ?? '',
        typeof doc.assignedReviewer === 'object' ? (doc.assignedReviewer?.name ?? '') : '',
        (doc.reviewComments ?? '').replace(/(\r\n|\n|\r)/gm, ' '),
        doc.createdAt ? new Date(doc.createdAt).toLocaleString('zh-TW') : '',
      ]
    })

    const escape = (cell: any) => `"${String(cell ?? '').replace(/"/g, '""')}"`

    const csvContent = [
      headers.map(escape).join(','),
      ...rows.map((row: any[]) => row.map(escape).join(',')),
    ].join('\n')

    // BOM for Excel UTF-8 compatibility
    const bom = '\uFEFF'
    const filename =
      selectedIds.length > 0
        ? `abstracts_selected_${selectedIds.length}.csv`
        : 'abstracts_all.csv'

    return new Response(bom + csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting abstracts CSV:', error)
    return Response.json({ error: 'Failed to export abstracts CSV' }, { status: 500 })
  }
}
