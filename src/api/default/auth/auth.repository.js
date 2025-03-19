const AuthRepository = {
  getExistProvider: `SELECT id FROM user_auth_providers WHERE provider_uid = ?`,
  getExistUsername: `SELECT id FROM user WHERE username = ?`,
  getExistEmail: `SELECT id FROM user WHERE email = ?`,

  insertUser: `INSERT INTO user(username, password, email, nickname, name, bio, birth) VALUE (?, ?, ?, ?, ?, ?, ?)`,
  insertAuthProvider: `INSERT INTO user_auth_providers(user_id, provider, provider_uid) VALUE (?, ?, ?)`
}

export default AuthRepository
