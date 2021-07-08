import React from "react";
import { useSelector } from "react-redux";
import { apiKey } from "./firebase";

// 로그인을 했는 지(권한이 있는 지) 확인해서 children으로 받은 내용물을 보여줄 지 말지 결정하는 컴포넌트예요! :)
// React.memo는 메모이제이션을 통해 컴포넌트가 여러번 렌더링 되지 않도록 막아줘요.
// 내용이 기억나지 않으시면 5주차를 참고해주세요! 혹은 구글에 React.memo를 검색해보세요!
const Permit = React.memo((props) => {
  const is_login = useSelector((state) => state.user.is_login);

  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;

  const is_session = sessionStorage.getItem(_session_key) ? true : false;

//   세션과 리덕스 내 로그인 여부 값을 사용해 로그인했는 지 여부를 판단합니다!
  if (is_session && is_login) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  return null;
});

export default Permit;
