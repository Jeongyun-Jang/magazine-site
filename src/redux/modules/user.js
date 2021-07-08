import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";

import { auth } from "../../shared/firebase";
import firebase from "firebase/app";

// 액션 타입
const LOG_OUT = "LOG_OUT";
const GET_USER = "GET_USER";
const SET_USER = "SET_USER";

const logOut = createAction(LOG_OUT, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));
const setUser = createAction(SET_USER, (user) => ({ user }));


const initialState = {
  user: null,
  is_login: false,
};

// 미들웨어(액션이 일어나고 -> 리듀서 내의 어떤 로직이 실행되기 사이의 중간다리 역할을 해줄 함수들) 작성

// 회원가입
/**
 *
 * @param {*} id 아이디
 * @param {*} pwd 패스워드
 * @returns
 */
const loginFB = (id, pwd) => {
  return function (dispatch, getState, { history }) {

    auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then((res) => {
      auth
        .signInWithEmailAndPassword(id, pwd)
        .then((user) => {
          dispatch(
            setUser({
              user_name: user.user.displayName,
              id: id,
              user_profile: "",
              uid: user.user.uid,
            })
          );

          window.location.href = "/";
        })
        .catch((error) => {
          window.alert("로그인 실패!");

          var errorCode = error.code;
          var errorMessage = error.message;

          console.log(errorCode, errorMessage);
        });
    });
  };
};

// 회원가입
/**
 *
 * @param {*} id 아이디
 * @param {*} pwd 패스워드
 * @param {*} user_name 닉네임 (유저 네임)
 * @returns
 */
const signupFB = (id, pwd, user_name) => {
  return function (dispatch, getState, { history }) {
    auth
      .createUserWithEmailAndPassword(id, pwd)
      .then((user) => {
        console.log(user);

        auth.currentUser
          .updateProfile({
            displayName: user_name,
          })
          .then(() => {
            dispatch(
              setUser({
                user_name: user_name,
                id: id,
                user_profile: "",
                uid: user.user.uid,
              })
            );
            history.replace("/login");
          })
          .catch((error) => {
            console.log(error);
          });

        // Signed in
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
        // ..
      });
  };
};

// 로그인했는 지 아닌 지 체크, 만약 파이어베이스에 로그인한 상태라면 리덕스에도 유저 정보를 넣어줍니다.
const loginCheckFB = () => {
  return function (dispatch, getState, { history }) {
    // 유저 정보를 가져옵니다.
    auth.onAuthStateChanged((user) => {
      // 유저 정보가 있으면 리덕스에 유저 정보 넣어주기
      if (user) {
        dispatch(
          setUser({
            user_name: user.displayName,
            user_profile: "",
            id: user.email,
            uid: user.uid,
          })
        );
      } else {
        //   없으면 파이어베이스에서도 로그아웃 합니다.
        dispatch(logoutFB());
      }
    });
  };
};

// 로그아웃
const logoutFB = () => {
  return function (dispatch, getState, { history }) {
    
    auth.signOut().then(() => {
      dispatch(logOut());
      history.replace("/");
    });
  };
};

// reducer
export default handleActions(
  {
    [SET_USER]: (state, action) =>
      produce(state, (draft) => {
        draft.user = action.payload.user;
        draft.is_login = true;
      }),
    [LOG_OUT]: (state, action) =>
      produce(state, (draft) => {
        draft.user = null;
        draft.is_login = false;
      }),
    [GET_USER]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

const actionCreators = {
  logOut,
  getUser,
  signupFB,
  loginFB,
  loginCheckFB,
  logoutFB,
};

export { actionCreators };
