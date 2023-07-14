// 레파지토리 레이어의 모듈을 가져온다.
const UserRepository = require("../3repositories/users.repository");
// 라이브러리 호출
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리
const JWT = require("jsonwebtoken");

// 토큰 만들 때 사용할 것들
const secretkey = "";
const rsecretkey = "";

// Users 모델을 가져온다.
const { Users } = require("../models");

// 객체 정의
class UserService {
  // 인스턴트를 변수에 할당
  userRepository = new UserRepository();

  //  회원가입 함수
  // 레파지토리에서 세개의 값을 받는다.
  signupUser = async (nickname, password, confirm) => {
    // 유효성 검사할 정규식 숫자와 소문자, 3글자 이상
    // 대신 gi 가 있으므로
    // g : 전역
    // i : 대소문자 구분 안함
    // 참고) m : 여러줄 검색
    // ^ : 시작
    // $ : 끝
    const idcheck = /^[0-9a-z]{3,}$/gi;

    try {
      // 하나라도 없으면 오류를 뱉는다.
      if (!nickname || !password || !confirm) {
        return {
          status: 400,
          cookie: null,
          message: "미입력된 항목이 있습니다. 모두 입력하여 주세요.",
        };
        // 정규식을 만족하지 못하면,
        // 닉네임의 조건에 대한 알림을 뱉는다.
      } else if (!idcheck.test(nickname)) {
        return {
          status: 400,
          cookie: null,
          message:
            "닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성해 주세요.",
        };
        // 비밀번호가 4글자 미만이거나, 닉네임을 포함하면,
        // 조건에 대한 알림을 뱉는다.
      } else if (password.length < 4 || password.includes(nickname)) {
        return {
          status: 400,
          cookie: null,
          message:
            "비밀번호는 최소 4자 이상, 닉네임과 같은 값이 포함될 수 없습니다.",
        };
        // 비밀번호를 2번 같게 입력하지 않으면,
        // 일치하지 않는다는 에러를 뱉는다.
      } else if (password !== confirm) {
        return {
          status: 400,
          cookie: null,
          message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        };
      }

      // 임의의 문자열의 길이를 10바이트로 설정한다. (기본값)
      const saltRound = 10;
      // 암호화 키(salt)를 만든다, 할 때 마다 다른 값이 나온다.
      const salt = await bcrypt.genSalt(saltRound);
      // 암호화된 비밀번호로 해시를 만든다.
      const hashedPassword = await bcrypt.hash(password, salt);

      // 리프래시 토큰 유효기간을 7일로 설정한다.
      const refreshToken = JWT.sign({}, rsecretkey, {
        expiresIn: "7d",
      });

      // 토큰 타입을 Bearer 로 설정한다.
      const token = `Bearer ${refreshToken}`;
      // 닉네임, 암호화 된 비밀번호, 리프래시 토큰을
      // 레파지토리 레이어에 보낸다.
      await this.userRepository.signupUser(
        nickname,
        hashedPassword,
        refreshToken
      );

      // 성공 메시지와 쿠키를 내보낸다.
      return {
        status: 201,
        cookie: {
          name: "refreshToken",
          token,
          expiresIn: "7d",
        },
        message: "회원 가입에 성공하였습니다.",
      };
      // 'SequelizeUniqueConstraintError' 에러가 뜬 경우
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        return {
          status: 400,
          cookie: null,
          message: "중복된 닉네임입니다.",
        };
      }
    }
  };

  //  로그인 함수
  // 레파지토리 레이어에서 세 가지 값을 받는다.
  loginUser = async (nickname, password, existRefreshToken) => {
    // 입력 되야할 값이 없다면, 에러를 내보낸다.
    if (!nickname || !password) {
      return {
        status: 400,
        accesscookie: null,
        refreshcookie: null,
        message: "닉네임 또는 패스워드를 확인해주세요.",
      };
    }
    // Users 테이블의 nickname 필드에서 검색해서 찾아온다.
    const target = await Users.findOne({ where: { nickname } });
    // 값을 못 찾은 경우 에러를 반환
    if (!target) {
      return {
        status: 400,
        accesscookie: null,
        refreshcookie: null,
        message: "닉네임 또는 패스워드를 확인해주세요.",
      };
    }
    // 저장된 비밀번호와 입력된 비밀번호를 비교한다.
    // 암호화하여 처리한다.
    const match = await bcrypt.compare(password, target.password);
    // 일치하지 않으면 에러
    if (!match) {
      return {
        status: 400,
        accesscookie: null,
        refreshcookie: null,
        message: "닉네임 또는 패스워드를 확인해주세요.",
      };
      // 비밀 번호가 일치하면, 테이블에서 userId를 가져온다.
    } else {
      const userId = target.userId;

      if (
        // 리프레시 토큰이 있고, JWT 검증이 통과되면,
        target.token == existRefreshToken &&
        //            토큰 문자열    ,  비밀키
        JWT.verify(existRefreshToken, rsecretkey)
      ) {
        // 토큰의 안에 테이블에서 가져온 userId, 비밀키, 유효기간 3600초를 넣는다.
        const accessToken = JWT.sign({ userId }, secretkey, {
          expiresIn: 3600,
        });
        // 정상이라는 신호 + 엑세스토큰이 담긴 쿠키
        // + 리프레시 토큰이 담킨 쿠키를 내보낸다
        return {
          status: 200,
          // 사용자의 로컬 또는 쿠키에 저장할 것
          accesscookie: {
            name: "accessToken",
            token: `Bearer ${accessToken}`,
            expiresIn: 3600,
          },
          // 서버에 저장할 것
          refreshcookie: {
            name: "refreshToken",
            token: `Bearer ${existRefreshToken}`,
            expiresIn: "7days",
          },
          message: "로그인에 성공하였습니다.",
        };
      } else if (
        // 토큰 === 리프레시 토큰은 이면서 JWT 인증에 실패한 경우
        // 또는 토큰 !== 리프레시 토큰 인 경우
        (target.token == existRefreshToken &&
          !JWT.verify(existRefreshToken, rsecretkey)) ||
        target.token !== existRefreshToken
      ) {
        // 토큰을 재 발급한다.
        const refreshToken = JWT.sign({}, rsecretkey, {
          expiresIn: "7d",
        });
        const accessToken = JWT.sign({ userId }, secretkey, {
          expiresIn: 3600,
        });
        // 동기화 작업으로, 레파지토리에 닉네임과 리프레시 토큰을 보낸다.
        await this.userRepository.loginUser(nickname, refreshToken);
        return {
          status: 201,
          accesscookie: {
            name: "accessToken",
            token: `Bearer ${accessToken}`,
            expiresIn: "1h",
          },
          refreshcookie: {
            name: "refreshToken",
            token: `Bearer ${refreshToken}`,
            expiresIn: "7d",
          },
          message: "로그인에 성공하였습니다.",
        };
      } else if (
        // 토큰 값과 인증 미들웨어의 값이 다르고,
        // JWT 인증도 실패한 경우
        target.token !== authToken &&
        !JWT.verify(authToken, rsecretkey)
      ) {
        // 쿠키 값을 지우고,
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        // 경고를 내보낸다.
        console.log(`비정상적인 접근 userId:${userId}`);
        return res.status(400).json({ message: "로그인에 실패하였습니다." });
      }
    }
  };
}

// 모듈로 내보낸다.
module.exports = UserService;
