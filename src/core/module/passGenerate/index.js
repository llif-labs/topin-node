import * as bcrypt from 'bcrypt'

const PassGenerate = {
  createPasswordHash: (password) => {
    const salt = parseInt(process.env.PASSWORD_SALT)

    return bcrypt.hashSync(password, salt)
  },

  verifyPassword: (password, passwordHash) => {
    return bcrypt.compareSync(password, passwordHash)
  },

}

export default PassGenerate
