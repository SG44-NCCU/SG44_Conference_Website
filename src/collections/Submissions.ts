// import { CollectionConfig } from 'payload'

// export const Submissions: CollectionConfig = {
//   slug: 'submissions',
//   labels: { singular: '投稿摘要', plural: '投稿摘要列表' },
//   // ✨ 這裡就是設定大類的地方
//   admin: {
//     group: '研討會管理', 
//     defaultColumns: ['title', 'owner', 'status', 'updatedAt'],
//   },
//   access: {
//     // 只有 Admin, Reviewer, 或 作者自己 可以看
//     read: ({ req: { user } }) => {
//       if (user?.role === 'admin' || user?.role === 'reviewer') return true
//       if (user) return { owner: { equals: user.id } }
//       return false
//     },
//     // 只有一般用戶可以建立 (老師和Admin通常不投稿)
//     create: ({ req: { user } }) => !!user,
//     // 只有 Admin 可以刪除
//     delete: ({ req: { user } }) => user?.role === 'admin',
//     // 修改權限：Admin/Reviewer 可改全部(含狀態)，作者只能改自己的內容
//     update: ({ req: { user } }) => {
//       if (user?.role === 'admin' || user?.role === 'reviewer') return true
//       if (user) return { owner: { equals: user.id } }
//       return false
//     },
//   },
//   fields: [
//     {
//       name: 'title',
//       label: '摘要標題',
//       type: 'text',
//       required: true,
//     },
//     {
//       name: 'file',
//       label: '摘要檔案 (PDF/Word)',
//       type: 'upload',
//       relationTo: 'media',
//       required: true,
//     },
//     {
//       name: 'owner',
//       label: '投稿者',
//       type: 'relationship',
//       relationTo: 'users',
//       required: true,
//       defaultValue: ({ req }) => req.user?.id,
//       admin: {
//         readOnly: true, // 禁止手動更改作者
//         position: 'sidebar',
//       },
//     },
//     {
//       name: 'status',
//       label: '審核狀態',
//       type: 'select',
//       options: [
//         { label: '處理中 (Processing)', value: 'processing' },
//         { label: '審核中 (Reviewing)', value: 'reviewing' },
//         { label: '接受 (Accepted)', value: 'accepted' },
//         { label: '拒絕 (Rejected)', value: 'rejected' },
//       ],
//       defaultValue: 'processing',
//       admin: {
//         position: 'sidebar',
//       },
//       // 🔒 只有 Admin 或 Reviewer 可以改狀態
//       access: {
//         update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'reviewer',
//       },
//     },
//     // Reviewer 專用欄位
//     {
//       name: 'assignedReviewer',
//       label: '指派審稿老師',
//       type: 'relationship',
//       relationTo: 'users',
//       filterOptions: {
//         role: { equals: 'reviewer' },
//       },
//       admin: {
//         position: 'sidebar',
//         // 只有 Admin 看得到指派欄位
//         condition: (data, siblingData, { user }) => user?.role === 'admin',
//       },
//     },
//     {
//       name: 'reviewComments',
//       label: '審稿評語 (僅供作者與委員檢視)',
//       type: 'textarea',
//       access: {
//         read: () => true, // 作者可以看
//         // 只有老師和 Admin 能寫
//         update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'reviewer',
//       },
//     },
//   ],
// }