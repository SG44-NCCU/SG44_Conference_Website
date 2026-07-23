import { PayloadRequest } from 'payload'

export const exportUsersCsvEndpoint = async (req: PayloadRequest) => {
  const { payload, user } = req

  // Ensure user is admin or staff
  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return Response.json({ error: 'Forbidden. Admin or Staff access required.' }, { status: 403 })
  }

  try {
    // Fetch all users
    const usersRes = await payload.find({
      collection: 'users',
      limit: 5000,
      sort: '-createdAt',
    })

    const docs = usersRes.docs

    // Define CSV Headers
    const headers = [
      '系統ID',
      '真實姓名',
      '性別',
      '出生年月日',
      '電子信箱',
      '手機號碼',
      '所屬單位',
      '職稱',
      '系統權限',
      '最後查看通知時間',
      '建立時間',
      '更新時間',
    ]

    const genderMap: Record<string, string> = {
      male: '男',
      female: '女',
      other: '不透露/其他',
    }

    const roleMap: Record<string, string> = {
      admin: 'Admin',
      staff: 'Staff',
      user: 'User',
      reviewer: 'Reviewer',
    }

    // Helper to format date strings
    const formatDate = (dStr?: string | null) => {
      if (!dStr) return ''
      try {
        const date = new Date(dStr)
        if (isNaN(date.getTime())) return dStr
        // Format to YYYY-MM-DD HH:mm:ss
        return date.toISOString().replace('T', ' ').substring(0, 19)
      } catch {
        return dStr
      }
    }

    // Helper to format date only
    const formatDateOnly = (dStr?: string | null) => {
      if (!dStr) return ''
      try {
        const date = new Date(dStr)
        if (isNaN(date.getTime())) return dStr
        return date.toISOString().split('T')[0]
      } catch {
        return dStr
      }
    }

    // Escape CSV cell text
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""'
      const str = String(val).replace(/"/g, '""')
      return `"${str}"`
    }

    // Create CSV rows
    const rows = docs.map((u: any) => {
      return [
        u.id,
        u.name || '',
        genderMap[u.gender] || u.gender || '',
        formatDateOnly(u.birthday),
        u.email || '',
        u.phone || '',
        u.organization || '',
        u.jobTitle || '',
        roleMap[u.role] || u.role || 'User',
        formatDate(u.lastNotificationChecked),
        formatDate(u.createdAt),
        formatDate(u.updatedAt),
      ].map(escapeCsv).join(',')
    })

    // Combine UTF-8 BOM + Headers + Rows
    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\n')

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="sg44_users_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting users CSV:', error)
    return Response.json({ error: 'Failed to export users CSV' }, { status: 500 })
  }
}
