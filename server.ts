import express, { json } from 'express'
import { LoginProps } from '@domain/types'
import { OAuth2Client } from 'google-auth-library'
import { config } from 'dotenv'
import cors from 'cors'
import { createTransport } from 'nodemailer'

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

config()

app.use(json())
app.use(cors())

const sendEmail = async (sendTo, subject, message) => {
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: '587',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
   
    
  })

  const options = {
    from: `Anastasiya Korshun ${process.env.USER_EMAIL}`,
    to: sendTo,
    subject: subject,
    text: message,
    html: `<h1>${message}</h1>`,
  }

  const result = transporter.sendMail(options)
  return result
}

app.post('/api/sendemail', async (req, res) => {
  try {
    const sendTo = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    await sendEmail(sendTo, subject, message)
    res.status(200).json({ success: true, message: client.credentials })
  } catch (error) {
    res.status(500).json(error.message)
  }
})

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
