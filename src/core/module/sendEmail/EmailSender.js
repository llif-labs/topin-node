import nodemailer from 'nodemailer'
import STATUS from '../statusResponse/status.enum.js'

const transporter = nodemailer.createTransport({
  service: 'gmail', // 또는 SMTP 설정
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

const EmailSender = (receiver, title) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: receiver,
    subject: title,
    text: '',
  }

  return {
    send: async (text) => {
      try {
        mailOptions.text = text
        await transporter.sendMail(mailOptions)
      } catch (e) {
        console.log(e)
        throw new Error(STATUS.SEND_EMAIL_FAIL.message)
      }
    }
  }
}

export default EmailSender
