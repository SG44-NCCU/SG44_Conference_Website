import type { CollectionConfig } from 'payload'

// Sanitize a string for use in a filename: replace unsafe characters with underscore
function sanitizeForFilename(str: string): string {
  return str
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_') // Windows reserved chars
    .replace(/\s+/g, '_')           // spaces → underscore
    .replace(/_+/g, '_')            // collapse multiple underscores
}

export const FullPapers: CollectionConfig = {
  slug: 'full-papers',
  admin: {
    group: '摘要管理',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'createdAt'],
    components: {
      beforeListTable: [
        '@/components/payload/FullPapersDownloadButton#FullPapersDownloadButton',
      ],
    },
  },
  access: {
    // Admin & Staff in backend panel
    admin: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'staff',
    // Any logged-in user can upload
    create: ({ req: { user } }) => Boolean(user),
    // Admin & Staff read all; owners read their own via abstract relationship
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin' || user.role === 'staff') return true
      return true // access controlled by abstract-level checks
    },
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    beforeOperation: [
      async ({ operation, req, args }) => {
        // Only intercept file uploads (create)
        if (operation !== 'create') return args
        if (!req.file) return args

        const user = req.user
        if (!user) return args

        // Fetch full user record to get organization (req.user may be a shallow JWT payload)
        let organization: string = ''
        let name: string = user.name ?? ''
        try {
          const fullUser = await req.payload.findByID({
            collection: 'users',
            id: user.id,
            depth: 0,
          })
          organization = (fullUser as any).organization ?? ''
          name = (fullUser as any).name ?? name
        } catch {
          // Fall back to whatever is on req.user
          organization = (user as any).organization ?? ''
        }

        const orgPart = organization ? sanitizeForFilename(organization) : ''
        const namePart = name ? sanitizeForFilename(name) : ''

        if (orgPart || namePart) {
          const prefix = [orgPart, namePart].filter(Boolean).join('_') + '_'
          // Only add prefix if it isn't already there
          if (!req.file.name.startsWith(prefix)) {
            req.file.name = prefix + req.file.name
          }
        }

        return args
      },
    ],
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
