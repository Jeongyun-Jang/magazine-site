import React from "react";
import { Grid, Text, Button } from "../elements";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "../redux/modules/user";

import { history } from "../redux/configureStore";
import { apiKey } from "../shared/firebase";

const Header = (props) => {
  const dispatch = useDispatch();

  //   리덕스에서 로그인 중인지 상태값 가져오기
  const is_login = useSelector((state) => state.user.is_login);

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

  const is_session = sessionStorage.getItem(_session_key) ? true : false;
  //   console.log(is_session);

  if (is_login && is_session) {
    return (
      <React.Fragment>
        <Grid padding="50px 200px">

          <Grid is_flex padding="4px 16px">
            <Grid>
              <Text margin="0px" size="24px" bold bg="#F9E076" >
                Welcome To Magazine Site :)
              </Text>
            </Grid>

            <Grid is_flex>
              
              <Button margin="0px 4px"_onClick={() => { 
                history.push("/noti");
              }}
              >알림</Button>
              <Button margin="0px 4px"
                _onClick={() => {
                  dispatch(userActions.logoutFB());
                }}
              >
                로그아웃
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }

  //   로그인 중이 아니라면 로그인 전 헤더 보여주기
  return (
    <React.Fragment>
      <Grid is_flex padding="4px 16px">
        <Grid>
          <Text margin="0px" size="24px" bold bg="#DFC98A">
            Magazine site Entrance :)
          </Text>
        </Grid>

        <Grid is_flex>
          <Button margin="0px 4px"
            _onClick={() => {
              history.push("/login");
            }}
          >
            로그인
          </Button>
          <Button margin="0px 4px"
            _onClick={() => {
              history.push("/signup");
            }}
          >
            회원가입
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Header.defaultProps = {};

export default Header;
