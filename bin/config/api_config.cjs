const jwtIssuer = 'topin-service'
const secret = '7kP9mWqXvR2tL8jF5nY3sQbA1cH4eG6u'
const passwordSalt = 10
const sessionSecret = 'ZT5s54FiVM6GbOJxv8TbZ97+wPYlIyjIMNxoeAEVDqs='

const smtpHost = 'smtp.gmail.com'
const smtpEmail = 'dev.ngyu00@gmail.com'
const smtpPort = '587'
const smtpPassword = 'kitghaurcxjrzayw'

apiConfig = {
  name: 'topin-node-v1',
  script: './bin/app.js',
  instances: 3, // 클러스터 모드
  watch: false,
  env: {
    NODE_ENV: 'development',
    PORT: '8001',
    DB_HOST: '127.0.0.1',
    DB_PORT: '3306',
    DB_USER: 'root',
    DB_PASSWORD: 'Root123!!',
    DB_DATABASE: 'topin',
    RDS_HOST: '127.0.0.1',
    RDS_PORT: '6379',
    JWT_ISSUER: jwtIssuer,
    JWT_SECRET: secret,
    PASSWORD_SALT: passwordSalt,
    SESSION_SECRET: sessionSecret,
    SMTP_HOST: smtpHost,
    SMTP_EMAIL: smtpEmail,
    SMTP_PORT: smtpPort,
    SMTP_PASSWORD: smtpPassword,
  },
  env_staging: {
    NODE_ENV: 'staging',
    PORT: '8001',
    DB_HOST: '',
    DB_PORT: '',
    DB_USER: '',
    DB_PASSWORD: '',
    DB_DATABASE: '',
    RDS_HOST: '',
    RDS_PORT: '',
    JWT_ISSUER: jwtIssuer,
    JWT_SECRET: secret,
    PASSWORD_SALT: passwordSalt,
    SESSION_SECRET: sessionSecret,
    SMTP_HOST: smtpHost,
    SMTP_EMAIL: smtpEmail,
    SMTP_PORT: smtpPort,
    SMTP_PASSWORD: smtpPassword,
  },
  env_production: {
    NODE_ENV: 'production',
    PORT: '8001',
    DB_HOST: '127.0.0.1',
    DB_PORT: '3306',
    DB_USER: 'root',
    DB_PASSWORD: 'Root123!!',
    DB_DATABASE: 'topin',
    RDS_HOST: '127.0.0.1',
    RDS_PORT: '6379',
    JWT_ISSUER: jwtIssuer,
    JWT_SECRET: secret,
    PASSWORD_SALT: passwordSalt,
    SESSION_SECRET: sessionSecret,
    SMTP_HOST: smtpHost,
    SMTP_EMAIL: smtpEmail,
    SMTP_PORT: smtpPort,
    SMTP_PASSWORD: smtpPassword,
  },
}

module.exports = apiConfig
