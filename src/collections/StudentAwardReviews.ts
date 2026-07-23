import type { CollectionConfig } from 'payload'

export const StudentAwardReviews: CollectionConfig = {
  slug: 'student-award-reviews',
  admin: {
    group: '學生論文獎',
    useAsTitle: 'id',
    defaultColumns: ['abstract', 'reviewer', 'score', 'createdAt'],
    components: {
      beforeListTable: ['@/components/payload/StudentAwardDashboard#StudentAwardDashboard'],
    },
  },
  access: {
    // Admin 與 Staff 能進後台
    admin: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'staff',
    // Admin 與 Staff 全部可讀；reviewer 只能讀自己的
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'staff') return true
      if (user.role === 'reviewer') {
        return { reviewer: { equals: user.id } }
      }
      return false
    },
    // Admin 全部可建立；reviewer 可以建立（他們在前台 submit 時用到）
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin' || user.role === 'reviewer'
    },
    // Admin 全部可改；reviewer 只能改自己的
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      if (user.role === 'reviewer') {
        return { reviewer: { equals: user.id } }
      }
      return false
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'abstract',
      type: 'relationship',
      relationTo: 'abstracts',
      label: '論文（Abstract）',
      required: true,
      hasMany: false,
      filterOptions: {
        applyStudentAward: { equals: true },
      },
      admin: {
        description: '必須是有申請學生論文獎且已上傳全文的摘要',
      },
    },
    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: 'users',
      label: '評審老師（Reviewer）',
      required: true,
      hasMany: false,
      filterOptions: {
        role: { equals: 'reviewer' },
      },
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        description: '負責評分的評審老師',
      },
    },
    {
      name: 'score',
      type: 'number',
      label: '評分（1–10 分）',
      required: false,
      min: 1,
      max: 10,
      admin: {
        description: '請給予 1 至 10 分的評分（10 分最高）',
        step: 1,
      },
    },
    {
      name: 'comments',
      type: 'textarea',
      label: '評語（Comments，選填）',
      required: false,
      admin: {
        description: '選填。可針對論文內容、研究方法、創新性等給予具體評語。',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      label: '評分提交時間',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: '評審提交分數的時間',
      },
    },
  ],
}
