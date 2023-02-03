// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OAuth2Client } = require('google-auth-library')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');

// interface LoginProps {
//   email: string;
//   name: string;
//   picture: string;
// }

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID)
const app = express()

const users = []

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
app.use(cors());

const sendEmail = async (sendTo, subject, message) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: '587',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
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
