import React from "react";
import { Text, Input, Grid, Button } from "../elements";

import { useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

// 이메일 형식 체크하는 함수를 가져옵니다.
import { emailCheck } from "../shared/common";

const Login = (props) => {
  const dispatch = useDispatch();

  const [id, setId] = React.useState("");
  const [pwd, setPwd] = React.useState("");

  const login = () => {
    // console.log("id:",id);

    // 아이디와 패스워드가 있는 지 확인
    if (id === "" || pwd === "") {
      window.alert("아이디 혹은 비밀번호가 공란입니다! 입력해주세요!");
      return;
    }

    // id가 이메일 형식이 맞나 확인
    if (!emailCheck(id)) {
      window.alert("이메일 형식이 맞지 않습니다!");
      return;
    }

    // 파이어베이스 로그인을 담당하는 함수 디스패치
    dispatch(userActions.loginFB(id, pwd));
  };

  return (
    <React.Fragment>
      <Grid padding="16px">
        <Text size="32px" bold>
          로그인
        </Text>

        <Grid padding="16px 0px">
          <Input
            label="아이디"
            placeholder="아이디를 입력해주세요."
            _onChange={(e) => {
              setId(e.target.value);
            }}
          />
        </Grid>

        <Grid padding="16px 0px">
          <Input
            label="패스워드"
            placeholder="패스워드 입력해주세요."
            type="password"
            _onChange={(e) => {
              setPwd(e.target.value);
            }}
            value={pwd}
            is_submit
            onSubmit={login}
          />
        </Grid>

        <Button
          _onClick={() => {
            login();
          }}
        >
          로그인하기
        </Button>
      </Grid>
    </React.Fragment>
  );
};

export default Login;
