import { getPayload } from 'payload'
import config from './src/payload.config'

async function checkUsers() {
  const payload = await getPayload({ config })
  const users = await payload.find({
    collection: 'users',
  })
  console.log('--- USERS LIST ---')
  users.docs.forEach(u => {
    console.log(`ID: ${u.id}, Email: ${u.email}, Role: ${u.role}`)
  })
  process.exit(0)
}

checkUsers().catch(err => {
  console.error(err)
  process.exit(1)
})
