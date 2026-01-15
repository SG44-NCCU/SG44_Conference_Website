// src/payload.config.ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
// ✨ 1. 引入 Resend Adapter
import { resendAdapter } from '@payloadcms/email-resend' 
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// 引入 Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News } from './collections/News'
// import { Submissions } from './collections/Submissions' 
// import { Registrations } from './collections/Registrations'

// 引入 Globals
import { Contact } from './globals/Contact'
import { Transport } from './globals/Transport'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  
  // ✨ 2. 設定 Email Adapter
  email: resendAdapter({
    defaultFromName: 'SG44 研討會團隊',
    // ⚠️ 注意：如果你還沒在 Resend 設定自己的網域，這裡必須用 'onboarding@resend.dev'
    // 只有寄給「你自己註冊 Resend 的那個信箱」才會成功，這是測試模式的限制。
    defaultFromAddress: 'onboarding@resend.dev', 
    apiKey: process.env.RESEND_API_KEY || '',
  }),

  collections: [
    Users,
    Media,
    News,
    // Submissions, 
    // Registrations, 
  ],

  globals: [
    Contact,
    Transport,
  ],

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
  plugins: [],
})