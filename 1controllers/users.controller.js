// 서비스에서 모듈을 가져온다.
const UserService = require("../2services/users.service");

//  모듈 가져온걸로 클래스 선언을 한다.
class UsersController {
  // 변수 선언
  userService = new UserService();

  //  회원 가입 함수
  // 비동기 함수 선언
  signupUser = async (req, res) => {
    // 클라이언트에서 세 가지 값을 입력 받는다.
    const { nickname, password, confirm } = req.body;
    // 서비스 signupUser에 위의 값 셋을 입력한 뒤, 세 가지 값을 반환 받는다.
    const { status, cookie, message } = await this.userService.signupUser(
      nickname,
      password,
      confirm
    );

    // cookie가 있으면
    if (cookie) {
      // 쿠키의 이름, 토큰 값, 유효기간을 설정한다.
      res.cookie(cookie.name, cookie.token, { expiresIn: cookie.expiresIn });
    }
    // signupUser에서 반환받은 satatus와 message를 내보낸다.
    return res.status(status).json({ message });
  };

  //  로그인 함수
  // 비동기 함수
  loginUser = async (req, res) => {
    // 클라이언트에서 두 값을 입력 받는다.
    const { nickname, password } = req.body;
    // 쿠키에서 refreshToken 를 추출한다.
    const existRefreshToken = req.cookies.refreshToken;
    // 서비스의 loginUser 에 위의 세 값을 전달하고, 네 개의 값을 반환 받는다.
    const { status, accesscookie, refreshcookie, message } =
      await this.userService.loginUser(nickname, password, existRefreshToken);
    // accesscookie 와 refreshcookie 모두 존재할 경우
    if (accesscookie && refreshcookie) {
      // 각각의 값을 할당한다.
      res.cookie(accesscookie.name, accesscookie.token, {
        expiresIn: accesscookie.expiresIn,
      });
      res.cookie(refreshcookie.name, refreshcookie.token, {
        expiresIn: refreshcookie.expiresIn,
      });
    }
    // 서비스의 loginUser 에서 나온 status 와 message를 반환한다.
    return res.status(status).json({ message });
  };
}
// 위의 내용을 모듈로 내보낸다.
module.exports = UsersController;
