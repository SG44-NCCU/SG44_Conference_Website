import { PayloadRequest } from 'payload'

export const exportCsvEndpoint = async (req: PayloadRequest) => {
  const { payload, user } = req

  // Ensure user is admin
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden. Admin access required.' }, { status: 403 })
  }

  try {
    // Fetch all registrations
    const registrations = await payload.find({
      collection: 'registrations',
      limit: 5000,
    })

    const docs = registrations.docs

    // Define CSV Headers
    const headers = [
      '報名編號',
      '使用者姓名',
      '使用者信箱',
      '聯絡地址',
      '票種',
      '應繳金額',
      '繳費狀態',
      '匯款後五碼',
      '匯款日期',
      '參與身分',
      '發表形式',
      'Day1用餐',
      'Day2用餐',
      '晚宴出席',
      '飲食偏好',
      '特殊飲食說明',
      '備註',
      '報名時間',
    ]

    // Create CSV rows
    const rows = docs.map((doc: any) => {
      return [
        doc.id,
        doc.user?.name || '',
        doc.user?.email || '',
        doc.contactAddress || '',
        doc.ticketType || '',
        doc.amount || 0,
        doc.paymentStatus || '',
        doc.paymentAccountLast5 || '',
        doc.paymentDate ? new Date(doc.paymentDate).toISOString().split('T')[0] : '',
        doc.participantRole === 'other' ? doc.participantRoleOther : doc.participantRole || '',
        doc.presentationType || '',
        doc.mealDay1 || '',
        doc.mealDay2 || '',
        doc.banquet || '',
        doc.dietaryPreference || '',
        doc.dietaryOther || '',
        (doc.remarks || '').replace(/(\r\n|\n|\r)/gm, ' '), // sanitize newlines in remarks
        new Date(doc.createdAt).toLocaleString('zh-TW'),
      ]
    })

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(',')),
    ].join('\n')

    // Adding BOM for excel UTF-8 compatibility
    const bom = '\uFEFF'
    const finalCsv = bom + csvContent

    return new Response(finalCsv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="registrations.csv"',
      },
    })
  } catch (error) {
    console.error('Error exporting CSV:', error)
    return Response.json({ error: 'Failed to export CSV' }, { status: 500 })
  }
}
