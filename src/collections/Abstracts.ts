import type { CollectionConfig } from 'payload'

// ─── 常數：子題清單 ───────────────────────────────────────────────────
export const SUB_TOPICS = [
  {
    label: '1. 大地測量與導航技術 (Geodetic Science and Navigation Techniques)',
    value: 'topic-1',
  },
  {
    label: '2. 車載測繪與室內定位 (Mobile Mapping System and Indoor Positioning Techniques)',
    value: 'topic-2',
  },
  {
    label: '3. 無人載具與災害調查 (Unmanned Vehicle Systems and Disaster Investigation)',
    value: 'topic-3',
  },
  {
    label: '4. 攝影測量與測繪管理 (Photogrammetry and Surveying Management)',
    value: 'topic-4',
  },
  {
    label: '5. 智慧科技與跨域應用 (Intelligent Techniques and Cross-Disciplinary Applications)',
    value: 'topic-5',
  },
  {
    label: '6. 數位城市與資訊服務 (Smart City and Geoinformation Services)',
    value: 'topic-6',
  },
  {
    label: '7. 環境永續與韌性防災 (Environmental Sustainability and Disaster Resilience)',
    value: 'topic-7',
  },
  {
    label: '8. 衛星科技與海洋測繪 (Satellite Technology and Marine Surveying)',
    value: 'topic-8',
  },
  {
    label: '9. 國土政策與規劃治理 (Land Policy and Planning Governance)',
    value: 'topic-9',
  },
  {
    label: '10. 跨國交流專題 (Cross-Cutting International Session)',
    value: 'topic-10',
  },
]

// ─── 常數：特別論壇清單 ────────────────────────────────────────────────
export const SPECIAL_SESSIONS = [
  { label: '國科會空間資訊學門成果發表', value: 'special-nstc' },
  { label: '國土測繪中心成果發表會', value: 'special-nlsc' },
  { label: '地政司', value: 'special-land' },
  { label: '國家公園', value: 'special-national-park' },
]

export const Abstracts: CollectionConfig = {
  slug: 'abstracts',
  admin: {
    group: '摘要管理',
    useAsTitle: 'title',
    defaultColumns: ['title', 'submitter', 'subTopic', 'reviewStatus', 'assignedReviewer', 'createdAt'],
    components: {
      beforeListTable: ['@/components/payload/AbstractDashboard#AbstractDashboard'],
    },
  },
  access: {
    // 只有 admin 能進後台
    admin: ({ req: { user } }) => user?.role === 'admin',
    // 任何登入的人都可以投稿
    create: ({ req: { user } }) => Boolean(user),
    // Admin 全部可讀；投稿人只能讀自己的；Reviewer 只能讀被指派的
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // reviewer: show assigned; regular user: show own submissions
      // reviewer: 可讀被指派的 + 自己投稿的
      if (user.role === 'reviewer') {
        return {
          or: [
            { assignedReviewer: { equals: user.id } } as import('payload').Where,
            { submitter: { equals: user.id } } as import('payload').Where,
          ],
        }
      }
      // 一般使用者：只能讀自己的
      return {
        or: [
          { submitter: { equals: user.id } } as import('payload').Where,
        ],
      }
    },
    // Admin 全部可改；投稿人只能改自己的；reviewer 只能改被指派的
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      // reviewer: 可改被指派的（填審稿意見）+ 自己投稿的
      if (user.role === 'reviewer') {
        return {
          or: [
            { assignedReviewer: { equals: user.id } } as import('payload').Where,
            { submitter: { equals: user.id } } as import('payload').Where,
          ],
        }
      }
      return {
        or: [
          { submitter: { equals: user.id } },
        ],
      }
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeOperation: [
      async ({ operation, req, args }) => {
        // 新增投稿時，non-admin 必須先報名且繳費通過
        if (operation === 'create' && req.user && req.user.role !== 'admin') {
          const registrations = await req.payload.find({
            collection: 'registrations',
            where: {
              and: [
                { user: { equals: req.user.id } },
                { paymentStatus: { equals: 'paid' } },
              ],
            },
            limit: 1,
          })
          if (registrations.totalDocs === 0) {
            throw new Error('您尚未完成報名繳費，請先完成報名並通過繳費確認才能投稿摘要。')
          }
        }
        return args
      },
    ],
  },
  fields: [
    // ─── 投稿人 ─────────────────────────────────────────────────────────
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      label: '投稿人',
      required: true,
      hasMany: false,
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },

    // ─── 標題 ──────────────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      label: '論文標題 (Title)',
      required: true,
    },

    // ─── 作者群 (Array) ─────────────────────────────────────────────────
    {
      name: 'authors',
      type: 'array',
      label: '作者群 (Authors)',
      required: true,
      minRows: 1,
      labels: {
        singular: '作者',
        plural: '作者群',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: '姓名 (Name)',
          required: true,
        },
        {
          name: 'affiliation',
          type: 'text',
          label: '所屬單位 (Affiliation)',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          label: '電子郵件 (Email)',
          required: true,
        },
        {
          name: 'isCorresponding',
          type: 'checkbox',
          label: '通訊作者 (Corresponding Author)',
          defaultValue: false,
        },
      ],
    },

    // ─── 子題與特別論壇 ───────────────────────────────────────────────
    {
      name: 'subTopic',
      type: 'select',
      label: '投稿子題 (Sub-topic)',
      options: SUB_TOPICS,
      admin: {
        description: '特別論壇投稿可留空',
      },
    },
    {
      name: 'specialSession',
      type: 'select',
      label: '特別論壇 (Special Session，如適用)',
      options: SPECIAL_SESSIONS,
      admin: {
        description: '如為特別論壇邀請文章，請在此選擇；一般投稿請留空',
      },
    },

    // ─── 學生身份與論文獎 ─────────────────────────────────────────────
    {
      name: 'isStudent',
      type: 'checkbox',
      label: '我是學生 (I am a student)',
      defaultValue: false,
    },
    {
      name: 'applyStudentAward',
      type: 'checkbox',
      label: '報名學生論文獎 (Apply for Student Paper Award)',
      defaultValue: false,
      admin: {
        condition: (data) => Boolean(data?.isStudent),
        description: '勾選後需上傳全文（PDF 或 DOCX，10MB 以內）',
      },
    },
    {
      name: 'fullTextFile',
      type: 'upload',
      relationTo: 'media',
      label: '全文檔案 (Full Paper File)',
      admin: {
        condition: (data) => Boolean(data?.isStudent && data?.applyStudentAward),
        description: '請上傳 PDF 或 DOCX 格式，檔案大小限 10MB 以內',
      },
    },

    // ─── 摘要與關鍵字 ────────────────────────────────────────────────
    {
      name: 'abstract',
      type: 'textarea',
      label: '摘要 (Abstract)',
      required: true,
      admin: {
        description: '請輸入 250 字以內的中英文摘要',
      },
    },
    {
      name: 'keywords',
      type: 'text',
      label: '關鍵字 (Keywords)',
      required: true,
      admin: {
        description: '請以逗號分隔，至少填寫 3 個關鍵字，例如：衛星定位, GNSS, 導航',
      },
    },

    // ─── 偏好發表形式 ───────────────────────────────────────────────
    {
      name: 'presentationPreference',
      type: 'select',
      label: '偏好發表形式 (Presentation Preference)',
      options: [
        { label: '口頭發表 (Oral)', value: 'oral' },
        { label: '海報發表 (Poster)', value: 'poster' },
        { label: '口頭或海報皆可 (Either)', value: 'either' },
      ],
      admin: {
        description: '實際發表形式由大會排程決定，此為偏好登記',
      },
    },

    // ─── 審稿相關（管理員 / 審稿人才能看的欄位）──────────────────────────
    {
      name: 'reviewStatus',
      type: 'select',
      label: '審查狀態 (Review Status)',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: '待審中 (Pending)', value: 'pending' },
        { label: '通過 (Accepted)', value: 'accepted' },
        { label: '未通過 (Rejected)', value: 'rejected' },
        { label: '修改後通過 (Minor Revision)', value: 'revision' },
      ],
      access: {
        // 一般投稿人不能「更改」審查狀態（可以讀，但透過 global setting 控制是否顯示）
        update: ({ req: { user } }) =>
          user?.role === 'admin' || user?.role === 'reviewer',
      },
      admin: {
        components: {
          Cell: '@/components/payload/ReviewStatusCell#ReviewStatusCell',
        },
      },
    },
    {
      name: 'reviewComments',
      type: 'textarea',
      label: '審稿評語 (Review Comments)',
      access: {
        read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'reviewer',
        update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'reviewer',
      },
      admin: {
        description: '此評語在大會發布審查結果後，會顯示給投稿人',
      },
    },
    {
      name: 'assignedReviewer',
      type: 'relationship',
      relationTo: 'users',
      label: '指定審稿人 (Assigned Reviewer)',
      hasMany: false,
      filterOptions: {
        role: { equals: 'reviewer' },
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        components: {
          Cell: '@/components/payload/AbstractReviewerCell#AbstractReviewerCell',
        },
        description: '只能選擇 role=reviewer 的使用者',
      },
    },
  ],
}
