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
import { Registrations } from './collections/Registrations'
import { Abstracts } from './collections/Abstracts'
import { Pages } from './collections/Pages'
import { FullPapers } from './collections/FullPapers'
import { Sessions } from './collections/Sessions'
import { StudentAwardReviews } from './collections/StudentAwardReviews'
import { Posters } from './collections/Posters'

// 2. 引入 Globals
import { AbstractsSettings } from './globals/AbstractsSettings'

if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET is required')
}

if (!process.env.DATABASE_URI) {
  throw new Error('DATABASE_URI is required')
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

// console.log('🔍 DEBUG PAYLOAD CONFIG:', {
//   Users,
//   Media,
//   News,
//   UserMenu, // 也檢查一下這個新朋友
// })

import { exportCsvEndpoint } from './endpoints/exportCsvEndpoint'
import { exportAbstractsCsvEndpoint } from './endpoints/exportAbstractsCsvEndpoint'
import { exportUsersCsvEndpoint } from './endpoints/exportUsersCsvEndpoint'
import { importSessionsEndpoint } from './endpoints/importSessionsEndpoint'

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // actions: [UserMenu],
      graphics: {
        Logo: '@/components/payload/Logo',
        Icon: '@/components/payload/Icon',
      },
    },
  },

  // 3. 註冊所有的 Collections
  collections: [Users, Media, News, Registrations, Abstracts, Pages, FullPapers, Sessions, StudentAwardReviews, Posters],

  // Register custom endpoints
  endpoints: [
    {
      path: '/export-csv',
      method: 'get',
      handler: exportCsvEndpoint as any,
    },
    {
      path: '/export-abstracts-csv',
      method: 'get',
      handler: exportAbstractsCsvEndpoint as any,
    },
    {
      path: '/export-users-csv',
      method: 'get',
      handler: exportUsersCsvEndpoint as any,
    },
    {
      path: '/import-sessions',
      method: 'post',
      handler: importSessionsEndpoint as any,
    },
  ],

  // 4. 註冊所有的 Globals
  globals: [AbstractsSettings],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  // 驗證信的連結網址，本機開發用 localhost，部署時讀取環境變數
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
      // Use DATABASE_SSL environment variable to control SSL. 
      // Set to 'true' in Zeabur if your database provider requires SSL.
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 10, // Limit connections to avoid exhausting database resources
    },
  }),
  sharp,
  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'info@sg44.tw',
          defaultFromName: process.env.SMTP_FROM_NAME || 'SG44 Conference',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587 (STARTTLS)
            requireTLS: Number(process.env.SMTP_PORT) !== 465, // force STARTTLS on port 587
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
            tls: {
              rejectUnauthorized: false, // Allow self-signed certs if needed
            },
          },
        }),
      }
    : {}),
  plugins: [],
})
