import admin from 'firebase-admin'
import firebaseAccount from './macro-8c94f-firebase-adminsdk-b956j-b39f0d9eae.json' assert { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(firebaseAccount)
})

/**
 * Firebase FCM 모듈
 * @returns {{token: Function, message: Function, send: Function}}
 */
function FCM () {

  // 메시지 데이터를 저장할 객체
  const messageData = {
    data: {
      title: '',
      body: '',
    },
    tokens: [], // 여러 토큰을 저장할 배열
  }

  return {
    /**
     * 수신자 토큰 설정
     * @param {string | string[]} token - 단일 또는 다중 토큰
     */
    token: function (token) {
      if (Array.isArray(token)) {
        messageData.tokens = token
      } else {
        messageData.tokens.push(token)
      }
      return this
    },

    /**
     * 메시지 내용 설정
     * @param {string} title - 알림 제목
     * @param {string} body - 알림 내용
     */
    setMessage: function (title, body) {
      messageData.data.title = title
      messageData.data.body = body
      return this
    },

    /**
     * 메시지 전송
     * @returns {Promise<Object>} - FCM 응답 결과
     */
    build: function () {
      const multicastMessage = {
        data: messageData.data,
        tokens: messageData.tokens,
      }

      return admin.messaging()
        .sendEachForMulticast(multicastMessage)
        .then((response) => {
          if(process.env.NODE_ENV !== 'production') {
            console.log('FCM 발송 : ', response)
            if(response.failureCount > 0) {
              response.responses.map(it => console.log(it.error))
            }
          }
          return response
        })
        .catch((error) => {
          console.log(error)
          throw new Error(error)
        })
    }
  }
}

const Index = {
  FCM
}

export default Index
