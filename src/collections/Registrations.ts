// import { CollectionConfig } from 'payload'

// export const Registrations: CollectionConfig = {
//   slug: 'registrations',
//   labels: { singular: '報名資料', plural: '報名資料列表' },
//   // ✨ 設定大類
//   admin: {
//     group: '研討會管理',
//     defaultColumns: ['user', 'ticketType', 'paymentStatus', 'last5Digits'],
//   },
//   access: {
//     read: ({ req: { user } }) => {
//       if (user?.role === 'admin') return true
//       if (user) return { user: { equals: user.id } }
//       return false
//     },
//     create: ({ req: { user } }) => !!user,
//     // 用戶可以回來補填末五碼，所以允許 update
//     update: ({ req: { user } }) => {
//       if (user?.role === 'admin') return true
//       if (user) return { user: { equals: user.id } }
//       return false
//     },
//     delete: ({ req: { user } }) => user?.role === 'admin',
//   },
//   fields: [
//     {
//       name: 'user',
//       label: '報名用戶',
//       type: 'relationship',
//       relationTo: 'users',
//       required: true,
//       defaultValue: ({ req }) => req.user?.id,
//       unique: true, // 限制一個用戶只能報名一次
//       admin: {
//         readOnly: true,
//       },
//     },
//     {
//       name: 'ticketType',
//       label: '票種',
//       type: 'select',
//       options: [
//         { label: '早鳥學生票', value: 'early_student' },
//         { label: '早鳥一般票', value: 'early_regular' },
//         { label: '一般票', value: 'regular' },
//       ],
//       required: true,
//     },
//     {
//       name: 'dietary',
//       label: '飲食習慣',
//       type: 'select',
//       options: [
//         { label: '葷食', value: 'meat' },
//         { label: '素食', value: 'vegetarian' },
//       ],
//       required: true,
//     },
//     // --- 繳費區塊 ---
//     {
//       name: 'last5Digits',
//       label: '匯款帳號末五碼',
//       type: 'text',
//       admin: {
//         description: '用戶匯款後回填',
//       },
//     },
//     {
//       name: 'paymentStatus',
//       label: '繳費狀態',
//       type: 'select',
//       options: [
//         { label: '對帳中 / 未繳費', value: 'pending' },
//         { label: '已繳費 (Confirmed)', value: 'paid' },
//         { label: '已取消', value: 'cancelled' },
//       ],
//       defaultValue: 'pending',
//       // 🔒 只有 Admin 可以改繳費狀態
//       access: {
//         update: ({ req: { user } }) => user?.role === 'admin',
//       },
//     },
//   ],
// }