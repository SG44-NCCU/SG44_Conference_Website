import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: '頁面 (Page)', plural: '頁面列表 (Pages)' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: '標題',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: '網址代稱 (Slug)',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'hero',
      label: 'Hero 區塊',
      type: 'group',
      fields: [
        {
          name: 'type',
          label: '類型',
          type: 'select',
          defaultValue: 'lowImpact',
          options: [
            { label: '無 (None)', value: 'none' },
            { label: '高視覺衝擊 (High Impact)', value: 'highImpact' },
            { label: '中等視覺衝擊 (Medium Impact)', value: 'mediumImpact' },
            { label: '低視覺衝擊 (Low Impact)', value: 'lowImpact' },
          ],
          required: true,
        },
        {
          name: 'richText',
          label: '文字內容',
          type: 'richText',
          admin: {
            condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'lowImpact'].includes(type),
          },
        },
        {
          name: 'media',
          label: '背景圖或影片',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
          },
        },
        {
          name: 'links',
          label: '行動呼籲 (CTA) 按鈕',
          type: 'array',
          fields: [
            {
              name: 'link',
              type: 'group',
              fields: [
                {
                  name: 'type',
                  type: 'radio',
                  options: [
                    { label: '自訂網址', value: 'custom' },
                    { label: '內部連結', value: 'reference' },
                  ],
                  defaultValue: 'reference',
                  admin: { layout: 'horizontal' },
                },
                {
                  name: 'reference',
                  type: 'relationship',
                  relationTo: ['pages', 'news'],
                  required: true,
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'reference',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'custom',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'appearance',
                  type: 'select',
                  defaultValue: 'default',
                  options: [
                    { label: '預設 (Default)', value: 'default' },
                    { label: '主按鈕 (Primary)', value: 'primary' },
                    { label: '次按鈕 (Secondary)', value: 'secondary' },
                  ],
                },
              ],
            },
          ],
          admin: {
            condition: (_, { type } = {}) => ['highImpact', 'mediumImpact', 'lowImpact'].includes(type),
          },
        },
      ],
    },
  ],
}
