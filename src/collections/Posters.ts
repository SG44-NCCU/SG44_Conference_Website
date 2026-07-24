import type { CollectionConfig } from 'payload'

export const Posters: CollectionConfig = {
  slug: 'posters',
  admin: {
    group: '摘要管理',
    useAsTitle: 'posterId',
    defaultColumns: ['posterId', 'title', 'author', 'topic', 'abstract'],
  },
  fields: [
    {
      name: 'posterId',
      type: 'text',
      required: true,
      unique: true,
      label: '海報編號',
    },
    {
      name: 'abstract',
      type: 'relationship',
      relationTo: 'abstracts',
      required: false,
      label: '對應摘要',
    },
    {
      name: 'topic',
      type: 'text',
      label: '子題',
    },
    {
      name: 'title',
      type: 'text',
      label: '海報標題',
    },
    {
      name: 'author',
      type: 'text',
      label: '作者',
    },
  ],
}
