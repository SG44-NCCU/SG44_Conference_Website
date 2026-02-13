// src/payload.config.ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// 1. 引入 Collections (集合)
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { UserMenu } from './components/payload/UserMenu'
// ❌ 已刪除 Submissions 引入

// ❌ 已刪除 Registrations 引入

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      actions: [UserMenu],
    },
  },

  // 3. 註冊所有的 Collections
  collections: [
    Users,
    Media,
    News,
    // ❌ 已刪除 Submissions 註冊
    // ❌ 已刪除 Registrations 註冊
  ],

  // 4. 註冊所有的 Globals
  globals: [],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'info@sg44.tw',
    defaultFromName: process.env.SMTP_FROM_NAME || 'SG44 Conference',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  plugins: [],
})
