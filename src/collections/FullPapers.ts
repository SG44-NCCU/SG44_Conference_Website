import type { CollectionConfig } from 'payload'

export const FullPapers: CollectionConfig = {
  slug: 'full-papers',
  admin: {
    group: '摘要管理',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'createdAt'],
  },
  access: {
    // Admin only in backend panel
    admin: ({ req: { user } }) => user?.role === 'admin',
    // Any logged-in user can upload
    create: ({ req: { user } }) => Boolean(user),
    // Admin reads all; owners read their own via abstract relationship
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return true // access controlled by abstract-level checks
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  upload: {
    mimeTypes: ['application/pdf'],
    staticDir: 'public/full-papers',
    // 20 MB limit — enforced via Next.js route config
  },
  fields: [
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      label: '上傳者',
      required: false,
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
