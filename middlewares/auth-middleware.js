// JWT 라이브러리 호출
const JWT = require("jsonwebtoken");
// JWT 생성에 사용할 비밀키
const secretkey = "";

// 모듈을 내보낸다.       세 개의 매개변수
module.exports = async (req, res, next) => {
  // 쿠키에서 엑세스 토큰을 가져온다.
  const { accessToken } = req.cookies;
  // ?? : 왼쪽 값이 null unidentify 라면 ""반환, 아니면 바로 반환환다.
  // 공백을 기준으로 문자열을 나눠서 왼쪽은 authType, 오른쪽은 authToken 에 담는다.
  const [authType, authToken] = (accessToken ?? "").split(" ");
  try {
    // 토큰의 타입이 없거나, Bearer 가 아니면, 에러를 뱉는다.
    if (!authToken || authType !== "Bearer") {
      return res.status(400).json({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
    }

    // 토큰을 인증한다.
    const verified = JWT.verify(authToken, secretkey);

    // 인증 실패시, 에러를 뱉는다.
    if (!verified) {
      return res.status(400).json({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
    } else {
      // 인증 성공시 로컬의 userId값에 인증받은 userId를 넣는다.
      // ↑ 응답값 res
      res.locals.userId = verified.userId;
      next();
    }
    // 실패 메시지
  } catch (err) {
    return res.status(400).json({
      errorMessage: "로그인 후에 이용하세요.",
    });
  }
};
