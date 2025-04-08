const STATUS = {
  GET_SUCCESS: {code: 200, message: '조회에 성공했습니다.'},
  POST_SUCCESS: {code: 200, message: '작성에 성공하였습니다.'},
  UPDATE_SUCCESS: {code: 200, message: '수정에 성공하였습니다.'},
  DELETE_SUCCESS: {code: 200, message: '삭제에 성공하였습니다.'},

  LOGIN_SUCCESS: {code: 200, message: '로그인에 성공하였습니다.'},
  SEND_EMAIL_SUCCESS: {code: 200, message: '메읿 발송에 성공하였습니다.'},
  REGISTER_SUCCESS: {code: 200, message: '로그인에 성공하였습니다.'},
  REPORT_SUCCESS: {code: 200, message: '신고되었습니다.'},

  CONFLICT: {code: 400, message: '코드가 일치하지 않습니다.'},
  EXIST_PROVIDER: {code: 400, message: '이미 가입된 소셜 계정 입니다.'},
  EXIST_USER: {code: 400, message: '이미 존재하는 계정 입니다.'},
  EXIST_EMAIL: {code: 400, message: '이미 가입된 이메일 입니다.'},
  SEND_EMAIL_FAIL: {code: 400, message: '메읿 발송에 실패하였습니다.'},
  NOT_VERIFY_CODE: {code: 400, message: '코드가 일치하지 않습니다.'},
  BAD_REQUEST: {code: 400, message: '잘못된 요청 입니다.'},
  FORBIDDEN: {code: 400, message: '잘못된 요청 입니다.'},

  UNAUTHORIZED: {code: 401, message: '권한이 없습니다.'},
  NO_REGISTERED: {code: 402, message: '가입되지 않은 회원 입니다.'},
  NOT_FOUND: {code: 404, message: '찾을 수 없는 요청 입니다.'},
}

export default STATUS
