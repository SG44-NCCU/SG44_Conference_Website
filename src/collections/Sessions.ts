import type { CollectionConfig } from 'payload'

export const Sessions: CollectionConfig = {
  slug: 'sessions',
  admin: {
    group: '議程管理',
    useAsTitle: 'title',
    defaultColumns: ['sessionCode', 'title', 'date', 'startTime', 'room', 'chairName'],
  },
  access: {
    read: () => true, // 公開可讀（未來議程公開）
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'sessionCode',
      type: 'text',
      label: '場次代碼 (Session Code)',
      admin: {
        description: '例如：1S.1、4S.2',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: '場次名稱 (Session Title)',
      required: true,
    },
    {
      name: 'date',
      type: 'select',
      label: '日期',
      required: true,
      options: [
        { label: '8月20日（四）', value: '2026-08-20' },
        { label: '8月21日（五）', value: '2026-08-21' },
      ],
    },
    {
      name: 'startTime',
      type: 'text',
      label: '開始時間',
      required: true,
      admin: {
        description: '格式：HH:MM，例如 09:00',
      },
    },
    {
      name: 'endTime',
      type: 'text',
      label: '結束時間',
      required: true,
      admin: {
        description: '格式：HH:MM，例如 10:15',
      },
    },
    {
      name: 'room',
      type: 'text',
      label: '廳別 (Room)',
      required: true,
      admin: {
        description: '例如：106、105、415、416、417、418、大禮堂',
      },
    },
    {
      name: 'chairName',
      type: 'text',
      label: '主持人',
    },
    {
      name: 'type',
      type: 'select',
      label: '場次類型',
      defaultValue: 'oral',
      options: [
        { label: '口頭發表 (Oral)', value: 'oral' },
        { label: '海報發表 (Poster)', value: 'poster' },
        { label: '特別論壇 (Special Session)', value: 'special' },
        { label: '專題演講 (Keynote)', value: 'keynote' },
        { label: '其他 (Other)', value: 'other' },
      ],
    },
    {
      name: 'papers',
      type: 'array',
      label: '論文列表',
      labels: {
        singular: '論文',
        plural: '論文列表',
      },
      fields: [
        {
          name: 'presentationOrder',
          type: 'number',
          label: '報告順序',
          required: true,
          admin: {
            description: '該場次中的發表順序（1, 2, 3...）',
          },
        },
        {
          name: 'abstract',
          type: 'relationship',
          relationTo: 'abstracts',
          label: '論文摘要',
          hasMany: false,
          admin: {
            description: '關聯到摘要資料庫中的論文',
          },
        },
        {
          name: 'abstractIdOverride',
          type: 'number',
          label: '論文 ID（手動輸入）',
          admin: {
            description: '若無法找到對應摘要，可直接填入論文 ID',
          },
        },
        {
          name: 'titleOverride',
          type: 'text',
          label: '論文標題（覆蓋）',
          admin: {
            description: '若摘要未入庫，可直接填入論文標題',
          },
        },
        {
          name: 'presenterName',
          type: 'text',
          label: '報告人姓名',
        },
        {
          name: 'notes',
          type: 'text',
          label: '備註',
        },
      ],
    },
  ],
}
