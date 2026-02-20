import type { CollectionConfig } from 'payload'

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    group: '報名管理',
    useAsTitle: 'id',
    defaultColumns: ['user', 'ticketType', 'paymentStatus', 'amount', 'createdAt'],
  },
  access: {
    // Admin can see/do all
    admin: ({ req: { user } }) => user?.role === 'admin',
    // Anyone logged in can create
    create: ({ req: { user } }) => Boolean(user),
    // Users can read/update their own registrations
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) return { user: { equals: user.id } }
      return false
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user) return { user: { equals: user.id } }
      return false
    },
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // 綁定使用者
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => true, // Let it be assigned, but in frontend we default to the logged in user
      },
      access: {
        // Prevent users from changing the user assignment after creation (unless admin)
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },

    // 票種與費用
    {
      name: 'ticketType',
      type: 'select',
      label: '報名票種',
      required: true,
      options: [
        { label: '早鳥報名 - 學生 (Student) NT$ 1,500', value: 'early-bird-student' },
        { label: '早鳥報名 - 一般人士 (Regular) NT$ 2,000', value: 'early-bird-regular' },
        { label: '一般報名 - 學生 (Student) NT$ 2,200', value: 'standard-student' },
        { label: '一般報名 - 一般人士 (Regular) NT$ 2,700', value: 'standard-regular' },
      ],
    },
    {
      name: 'amount',
      type: 'number',
      label: '應繳費金額 (NT$)',
      required: true,
      admin: {
        readOnly: true, // Should be calculated/submitted by frontend
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      label: '繳費狀態',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: '未繳費 / 審核中', value: 'pending' },
        { label: '已繳費', value: 'paid' },
        { label: '繳費失敗 / 退款', value: 'failed' },
      ],
      access: {
        // Only admin can update payment status once created!
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },

    // 一、 基本資料 (除了 Users 本身已有的欄位，僅補足報名表需要的)
    {
      name: 'contactAddress',
      type: 'text',
      label: '聯絡地址',
      required: true,
    },

    // 二、 會議參與資訊
    {
      name: 'participantRole',
      type: 'select',
      label: '參與身分',
      required: true,
      options: [
        { label: '論文發表人', value: 'presenter' },
        { label: '專題演講人', value: 'keynote' },
        { label: '主持人', value: 'host' },
        { label: '評論人/與談人', value: 'discussant' },
        { label: '一般與會者', value: 'attendee' },
        { label: '主/協辦單位同仁', value: 'staff' },
        { label: '大會邀請貴賓', value: 'vip' },
        { label: '其他', value: 'other' },
      ],
    },
    {
      name: 'participantRoleOther',
      type: 'text',
      label: '參與身分 (其他)',
      admin: {
        condition: (data) => data.participantRole === 'other',
      },
    },
    {
      name: 'presentationType',
      type: 'select',
      label: '論文發表形式',
      options: [
        { label: '口頭發表', value: 'oral' },
        { label: '海報發表', value: 'poster' },
        { label: '口頭或海報皆可', value: 'both' },
        { label: '無發表/僅與會', value: 'none' },
      ],
      // not required because it depends on user need
    },

    // 三、 繳費對帳資訊
    {
      name: 'paymentAccountLast5',
      type: 'text',
      label: '匯款帳號末五碼',
      required: true,
    },
    {
      name: 'paymentDate',
      type: 'date',
      label: '匯款日期',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
      },
    },
    {
      name: 'paymentTime',
      type: 'text',
      label: '匯款時間',
      required: true,
    },

    // 四、 膳食與活動意願調查
    {
      name: 'mealDay1',
      type: 'select',
      label: '第一天 (08/20) 午餐',
      required: true,
      options: [
        { label: '需用餐', value: 'yes' },
        { label: '不需用餐', value: 'no' },
      ],
    },
    {
      name: 'mealDay2',
      type: 'select',
      label: '第二天 (08/21) 午餐',
      required: true,
      options: [
        { label: '需用餐', value: 'yes' },
        { label: '不需用餐', value: 'no' },
      ],
    },
    {
      name: 'banquet',
      type: 'select',
      label: '大會晚宴 (08/20)',
      required: true,
      options: [
        { label: '將出席', value: 'yes' },
        { label: '不克出席', value: 'no' },
      ],
    },
    {
      name: 'dietaryPreference',
      type: 'select',
      label: '飲食偏好',
      options: [
        { label: '一般(葷食)', value: 'regular' },
        { label: '全素', value: 'vegan' },
        { label: '其他特殊需求', value: 'other' },
      ],
      admin: {
        condition: (data) =>
          data.mealDay1 === 'yes' || data.mealDay2 === 'yes' || data.banquet === 'yes',
      },
    },
    {
      name: 'dietaryOther',
      type: 'text',
      label: '飲食偏好 (其他特殊需求)',
      admin: {
        condition: (data) => data.dietaryPreference === 'other',
      },
    },

    // 五、 其他
    {
      name: 'remarks',
      type: 'textarea',
      label: '備註或建議事項',
    },
  ],
}
