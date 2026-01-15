import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  // 🔐 Auth 開啟
  auth: {
    // 1. 信箱驗證
    verify: {
      generateEmailHTML: ({ token, user }) => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
        return `
          <h1>歡迎加入 SG44 研討會</h1>
          <p>請點擊以下連結驗證您的信箱：</p>
          <a href="${url}">${url}</a>
        `
      },
    },
    // 2. 忘記密碼
    forgotPassword: {
      generateEmailHTML: ({ token }) => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`
        return `
          <h1>重設密碼</h1>
          <p>請點擊連結重設您的密碼：</p>
          <a href="${url}">${url}</a>
        `
      },
    },
    // 3. 登入設定
    tokenExpiration: 7200, // 2小時
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10分鐘
    cookies: {
      secure: true,
      sameSite: 'Strict',
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'organization', 'roles'],
    group: '系統管理',
  },
  access: {
    // ⚠️ 關鍵修正：控制「誰可以進入 http://localhost:3000/admin 後台」
    // 如果沒加這行，一般 User 登入後也能看到後台 (雖然看不到內容)
    admin: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),

    // 只有 Admin 能刪除用戶
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),

    // Admin 和 Reviewer 可以看列表，一般人只能看自己
    read: ({ req: { user } }) => {
      if (user?.roles?.includes('admin') || user?.roles?.includes('reviewer')) return true
      if (user) return { id: { equals: user.id } }
      return false
    },

    // 任何人都能註冊
    create: () => true,

    // Admin 可改所有，一般人只能改自己
    update: ({ req: { user } }) => {
      if (user?.roles?.includes('admin')) return true
      if (user) return { id: { equals: user.id } }
      return false
    },
  },
  fields: [
    // --- 權限與角色 ---
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['user'],
      options: [
        { label: '系統管理員', value: 'admin' },
        { label: '一般會員', value: 'user' },
        { label: '審查委員', value: 'reviewer' },
      ],
      access: {
        // 🔒 只有 Admin 可以修改別人的角色 (防止一般人自己升級)
        update: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
        // 一般人註冊時不能自己帶 roles 參數來升級，create 權限預設會擋，但保險起見可以加
        create: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
      },
    },

    // --- 基本資料 ---
    {
      name: 'name',
      label: '真實姓名',
      type: 'text',
      required: true,
    },
    {
      name: 'organization',
      label: '服務單位 / 學校',
      type: 'text',
      required: true,
    },
    {
      name: 'department',
      label: '系所 / 部門',
      type: 'text',
    },
    {
      name: 'title',
      label: '職稱',
      type: 'text',
    },
    {
      name: 'phone',
      label: '聯絡電話',
      type: 'text',
    },
    {
      name: 'address',
      label: '通訊地址',
      type: 'text',
    },
  ],
}