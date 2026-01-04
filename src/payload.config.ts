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
import { Submissions } from './collections/Submissions' // ✨ 新增：投稿
import { Registrations } from './collections/Registrations' // ✨ 新增：報名

// 2. 引入 Globals (全域設定)
import { Contact } from './globals/Contact'
import { Transport } from './globals/Transport' // ✨ 新增：交通

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // 3. 註冊所有的 Collections
  collections: [
    Users,
    Media,
    News,
    Submissions, // 記得加這個
    Registrations, // 還有這個
  ],

  // 4. 註冊所有的 Globals
  globals: [
    Contact,
    Transport, // 交通資訊放這裡
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
