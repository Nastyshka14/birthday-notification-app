import dotenv from 'dotenv'
import express from 'express'
import { OAuth2Client } from 'google-auth-library'

import { LoginProps } from './src/domain/types'

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID)
const app = express()
const users: LoginProps[] = []

function upsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email)
  if (i > -1) {
    return (array[i] = item)
  } else {
    return array.push(item)
  }
}

dotenv.config()

app.use(express.json())
app.post('/api/google-login', async (req, res) => {
  const { token } = req.body
  try {
    console.log(`Token: ${token}`)
  } catch (e) {
    console.log(`Token error: ${e}`)
  }
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  })
  const { name, email, picture } = ticket.getPayload()
  upsert(users, { name, email, picture })
  res.status(201)
  res.json({ name, email, picture })
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is ready at http://localhost:${process.env.PORT || 5000}`)
})
