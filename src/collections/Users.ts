import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  // 1. 開啟 Email 驗證
  auth: {
    verify: true,
    // verify: false,
  },
  admin: {
    useAsTitle: 'email',
    // 後台列表顯示這幾個重要欄位
    defaultColumns: ['name', 'organization', 'jobTitle', 'email', 'role'],
  },
  access: {
    // 只有 Admin 能進後台
    admin: ({ req: { user } }) => user?.role === 'admin',
    // 開放任何人註冊
    create: () => true,
    // 使用者只能看/改自己的資料
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) return { id: { equals: user.id } }
      return false
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) return { id: { equals: user.id } }
      return false
    },
    // 只有 Admin 能刪除
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // --- 基本資料 ---
    {
      name: 'name',
      type: 'text',
      label: '真實姓名',
      required: true,
    },
    {
      name: 'gender',
      type: 'select',
      label: '性別',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '不透露 / 其他', value: 'other' },
      ],
      required: false, // 設為選填，給使用者彈性
    },
    {
      name: 'birthday',
      type: 'date',
      label: '出生年月日',
      required: true, // 為了長青組判定，設為必填
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: '手機號碼',
      required: true,
    },

    // --- 單位與職稱 ---
    {
      name: 'organization',
      type: 'text',
      label: '所屬單位 (學校系所 / 公司名稱)',
      required: true,
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: '職稱 (如：教授、碩士生、專案經理)',
      required: true, // 改為必填文字，讓他們自己寫
    },

    // --- 系統權限 (隱藏處理) ---
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Reviewer', value: 'reviewer' },
      ],
      defaultValue: 'user', // 預設一律是一般用戶
      required: true,
      // 權限控制：只有 Admin 可以「修改」這個欄位
      // 註冊時因為是 Create，會自動帶入 defaultValue，所以不用擔心
      access: {
        read: () => true,
        create: () => false, // 禁止前端 API 帶入這個欄位，強制使用預設值
        update: ({ req: { user } }) => user?.role === 'admin',
      },
      admin: {
        // 在後台側邊欄，非 Admin 其實也看不到（因為上面的 access.admin 擋住了），但加這行更保險
        position: 'sidebar',
      },
    },
  ],
}
