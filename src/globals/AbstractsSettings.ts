import type { GlobalConfig } from 'payload'

export const AbstractsSettings: GlobalConfig = {
  slug: 'abstracts-settings',
  label: '摘要投稿設定',
  admin: {
    group: '摘要管理',
  },
  access: {
    read: () => true, // 前台需要讀取這個設定
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'submissionOpen',
      type: 'checkbox',
      label: '開放摘要投稿',
      defaultValue: true,
      admin: {
        description: '關閉後，前台投稿表單將顯示「投稿已截止」，使用者無法新增或修改投稿',
      },
    },
    {
      name: 'reviewResultPublished',
      type: 'checkbox',
      label: '發布審查結果',
      defaultValue: false,
      admin: {
        description:
          '勾選後，投稿人在「我的投稿」頁面將看到真實的審查結果（通過/未通過）與評語。建議在所有文章都有審查結果後再發布。',
      },
    },
    {
      name: 'submissionDeadline',
      type: 'date',
      label: '投稿截止日期',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
        description: '僅供顯示用，實際開關請用「開放摘要投稿」選項',
      },
    },
  ],
}
