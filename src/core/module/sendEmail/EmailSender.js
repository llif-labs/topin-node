import nodemailer from 'nodemailer'
import STATUS from '../statusResponse/status.enum.js'
import ejs from 'ejs'
import {fileURLToPath} from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const EMAIL_TYPE = {
  ADMIN: {
    title: '안녕하세요 관리자님. 토핀 관리자 인증코드 입니다.',
    template: 'views/mail/admin-login.ejs',
  },
  FIND_ID: {
    title: '안녕하세요 회원님. 토핀에서 발송한 아이디 찾기 인증메일 입니다.',
    template: 'views/mail/find-email.ejs',
  },
  FIND_PW: {
    title: '안녕하세요 회원님. 토핀에서 발송한 비밀번호 찾기 인증메일 입니다.',
    template: 'views/mail/find-password.ejs',
  },
}

const transporter = nodemailer.createTransport({
  service: 'gmail', // 또는 SMTP 설정
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

const EmailSender = (receiver, type) => {
  const templatePath = path.resolve(__dirname, '../../../../', type.template)
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: receiver,
    subject: type.title,
    html: null,
  }


  return {
    verifyAdminLogin: async (name, code) => {
      try {
        mailOptions.html = await ejs.renderFile(templatePath, {name: name, code: code})
        await transporter.sendMail(mailOptions)
      } catch (e) {
        console.log(e)
        throw new Error(STATUS.SEND_EMAIL_FAIL.message)
      }
    },
    findAccount: async (code) => {
      try {
        mailOptions.html = await ejs.renderFile(templatePath, {code: code})
        await transporter.sendMail(mailOptions)
      } catch (e) {
        console.log(e)
        throw new Error(STATUS.SEND_EMAIL_FAIL.message)
      }
    },
  }
}

export default EmailSender
