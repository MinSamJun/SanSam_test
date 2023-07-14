// Users 모델을 불러온다.
const { Users } = require("../models");

// 클래스 정의
class UserRepository {
  // 회원 가입 매서드 정의
  signupUser = async (nickname, password, refreshToken) => {
    //  Users에 닉, 비번, 리프레시 토큰을 넣는다.
    const signupUserData = await Users.create({
      nickname,
      password,
      token: refreshToken,
    });
    // 같은 데이터를 내보낸다.
    return signupUserData;
  };

  // 로그인 매서드 정의
  loginUser = async (nickname, refreshToken) => {
    // Users 테이블에서 nickname 필드로 찾아서,
    // 리프레시 토큰을 업데이트한다.
    const loginUserData = await Users.update(
      { token: refreshToken },
      { where: { nickname } }
    );
    // 같은 값을 내보낸다.
    return loginUserData;
  };
}

// 모듈로 내보낸다.
module.exports = UserRepository;
