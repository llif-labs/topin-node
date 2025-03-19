const AuthRepository = {


  getExistProvider: `SELECT id FROM user_auth_providers WHERE provider = ? AND provider_uid = ?`,
  getExistUsername: `SELECT id FROM user WHERE username = ?`,
  getExistEmail: `SELECT id FROM user WHERE email = ?`,

  getBasicUser : `SELECT u.id, u.role, u.username, u.password, u.email
                  FROM user u
                           LEFT JOIN user_auth_providers uap ON uap.id = u.id
                  WHERE u.username = ?`,
  getSocialUser: `SELECT u.id, u.role, u.username, u.email
                  FROM user u
                           LEFT JOIN user_auth_providers uap ON uap.id = u.id
                  WHERE uap.provider = ?
                    AND uap.provider_uid = ?`,

  insertUser: `INSERT INTO user(username, password, email, nickname, name, bio, birth) VALUE (?, ?, ?, ?, ?, ?, ?)`,
  insertAuthProvider: `INSERT INTO user_auth_providers(user_id, provider, provider_uid) VALUE (?, ?, ?)`,

  updateLastLogin: `UPDATE user SET last_login = NOW() WHERE id = ?`
}

export default AuthRepository
