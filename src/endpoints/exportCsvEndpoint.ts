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
      depth: 1, // Ensure user is populated
    })

    const docs = registrations.docs

    // Define CSV Headers
    const headers = [
      '報名編號',
      '使用者姓名',
      '性別',
      '出生年月日',
      '使用者信箱',
      '手機號碼',
      '所屬單位',
      '職稱',
      '聯絡地址',
      '票種',
      '應繳金額',
      '繳費狀態',
      '匯款後五碼',
      '匯款日期',
      '註冊費發票抬頭',
      '註冊費發票統編',
      '參與身分',
      '發表形式',
      'Day1用餐',
      'Day2用餐',
      '晚宴出席',
      '飲食偏好',
      '特殊飲食說明',
      '是否需要認證',
      '認證類型',
      '姓名(公務/技師)',
      '身分證字號',
      '出生日期(認證)',
      '服務單位(認證)',
      '聯絡電話(認證)',
      '技師科別',
      '備註',
      '報名時間',
    ]

    const genderMap: Record<string, string> = { male: '男', female: '女', other: '不透露/其他' }

    // Create CSV rows
    const rows = docs.map((doc: any) => {
      // 根據認證類型決定顯示哪些欄位
      const isCivil = doc.certificationType === 'civilServant'
      const isTech = doc.certificationType === 'technician'

      return [
        doc.id,
        doc.user?.name || '',
        genderMap[doc.user?.gender] || '',
        doc.user?.birthday ? new Date(doc.user.birthday).toISOString().split('T')[0] : '',
        doc.user?.email || '',
        doc.user?.phone || '',
        doc.user?.organization || '',
        doc.user?.jobTitle || '',
        doc.contactAddress || '',
        doc.ticketType || '',
        doc.amount || 0,
        doc.paymentStatus || '',
        doc.paymentAccountLast5 || '',
        doc.paymentDate ? new Date(doc.paymentDate).toISOString().split('T')[0] : '',
        doc.invoiceTitle || '',
        doc.invoiceTaxId || '',
        doc.participantRole === 'other' ? doc.participantRoleOther : doc.participantRole || '',
        doc.presentationType || '',
        doc.mealDay1 || '',
        doc.mealDay2 || '',
        doc.banquet || '',
        doc.dietaryPreference || '',
        doc.dietaryOther || '',
        doc.needsCertification || 'no',
        doc.certificationType || '',
        isCivil ? doc.certName : (isTech ? doc.techName : ''),
        isCivil ? doc.certIdNumber : (isTech ? doc.techIdNumber : ''),
        isCivil && doc.certDob ? new Date(doc.certDob).toISOString().split('T')[0] : '',
        isCivil ? doc.certOrganization : '',
        isCivil ? doc.certPhone : '',
        isTech ? doc.techSpecialty : '',
        (doc.remarks || '').replace(/(\r\n|\n|\r)/gm, ' '),
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
