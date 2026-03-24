import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  // 1. 開啟 Email 驗證
  auth: {
    verify: {
      generateEmailSubject: () => '[SG44] 啟用您的帳號 / Activate Your Account',
      generateEmailHTML: ({ req, token, user }) => {
        // 優先順序：NEXT_PUBLIC_SERVER_URL > PAYLOAD_PUBLIC_SERVER_URL > SERVER_URL > localhost
        const serverURL = 
          process.env.NEXT_PUBLIC_SERVER_URL || 
          process.env.PAYLOAD_PUBLIC_SERVER_URL || 
          process.env.SERVER_URL || 
          'http://localhost:3000'
        
        const verifyURL = `${serverURL.replace(/\/$/, '')}/verify?token=${token}`
        const userName = user?.name || '使用者'

        return `
          <!doctype html>
          <html>
            <body style="font-family: sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 20px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 4px; background-color: #ffffff;">
                <h2 style="color: #4d4c9d; margin-top: 0;">歡迎加入 SG44！ / Welcome to SG44!</h2>
                <div style="margin-bottom: 24px;">
                  <p style="margin: 0 0 12px;">親愛的 ${userName} 您好，</p>
                  <p style="margin: 0;">感謝您註冊第44屆測量及空間資訊研討會帳號。請點擊下方按鈕以啟用您的帳號：</p>
                </div>
                <div style="margin-bottom: 24px; border-top: 1px solid #f3f4f6; padding-top: 24px;">
                  <p style="margin: 0 0 12px;">Dear ${userName},</p>
                  <p style="margin: 0;">Thank you for registering an account for the 44th Surveying and Geoinformatics Conference. Please click the button below to activate your account:</p>
                </div>
                <div style="text-align: center; margin: 36px 0;">
                  <a href="${verifyURL}" style="display: inline-block; background-color: #53b2e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 2px; font-weight: 600; letter-spacing: 0.025em;">啟用帳號 / Activate Account</a>
                </div>
                <p style="font-size: 13px; color: #6b7280; margin: 36px 0 12px;">或是複製以下連結至瀏覽器開啟： / Or copy the link below into your browser:</p>
                <p style="font-size: 13px; word-break: break-all; margin: 0;">
                  <a href="${verifyURL}" style="color: #4d4c9d; text-decoration: underline;">${verifyURL}</a>
                </p>
                <div style="border-t: 1px solid #f3f4f6; margin-top: 36px; padding-top: 20px;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0;">SG44 研討會籌備團隊 敬上 / SG44 Conference Organizing Team</p>
                </div>
              </div>
            </body>
          </html>
        `
      },
    },
    // verify: false,
    forgotPassword: {
      generateEmailSubject: () => '[SG44] 重設您的密碼 / Reset Your Password',
      generateEmailHTML: (args) => {
        const token = args?.token
        const user = args?.user
        const serverURL = 
          process.env.NEXT_PUBLIC_SERVER_URL || 
          process.env.PAYLOAD_PUBLIC_SERVER_URL || 
          process.env.SERVER_URL || 
          'http://localhost:3000'
          
        const resetURL = `${serverURL.replace(/\/$/, '')}/reset-password?token=${token}`
        const userName = user?.name || '使用者'

        return `
          <!doctype html>
          <html>
            <body style="font-family: sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 20px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 4px; background-color: #ffffff;">
                <h2 style="color: #4d4c9d; margin-top: 0;">重設 SG44 密碼 / Reset SG44 Password</h2>
                <div style="margin-bottom: 24px;">
                  <p style="margin: 0 0 12px;">親愛的 ${userName} 您好，</p>
                  <p style="margin: 0;">我們收到了您重設密碼的請求。若這不是您本人的操作，請忽略此信件。請點擊下方按鈕以重設您的密碼：</p>
                </div>
                <div style="margin-bottom: 24px; border-top: 1px solid #f3f4f6; padding-top: 24px;">
                  <p style="margin: 0 0 12px;">Dear ${userName},</p>
                  <p style="margin: 0;">We received a request to reset your password. If you did not make this request, please ignore this email. Please click the button below to reset your password:</p>
                </div>
                <div style="text-align: center; margin: 36px 0;">
                  <a href="${resetURL}" style="display: inline-block; background-color: #53b2e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 2px; font-weight: 600; letter-spacing: 0.025em;">重設密碼 / Reset Password</a>
                </div>
                <p style="font-size: 13px; color: #6b7280; margin: 36px 0 12px;">或是複製以下連結至瀏覽器開啟： / Or copy the link below into your browser:</p>
                <p style="font-size: 13px; word-break: break-all; margin: 0;">
                  <a href="${resetURL}" style="color: #4d4c9d; text-decoration: underline;">${resetURL}</a>
                </p>
                <div style="border-t: 1px solid #f3f4f6; margin-top: 36px; padding-top: 20px;">
                  <p style="font-size: 12px; color: #9ca3af; margin: 0;">SG44 研討會籌備團隊 敬上 / SG44 Conference Organizing Team</p>
                </div>
              </div>
            </body>
          </html>
        `
      },
    },
  },
  admin: {
    group: '使用者資料',
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
        components: {
          Cell: '@/components/payload/RoleSelectCell#RoleSelectCell',
        },
      },
    },
  ],
}
