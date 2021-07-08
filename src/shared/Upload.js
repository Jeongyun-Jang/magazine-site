import React from "react";

import { useDispatch} from "react-redux";
import { actionCreators as imageActions } from "../redux/modules/image";

const Upload = (props) => {
  const dispatch = useDispatch();
  const fileInput = React.useRef();

  const selectFile = (e) => {
    // 아래 주석을 풀어서 input에 들어간 file 객체를 확인해보세요! :)
    // console.log(e.target.files[0]);
    // console.log(fileInput.current.files[0]);

    // 파일 리더 객체를 사용해서 미리보기를 넣어줍니다.
    const reader = new FileReader();
    const file = fileInput.current.files[0];

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      // 파일 리더 객체를 사용해서 미리보기를 넣어줍니다.
    //   아래 주석을 풀고 파일리더 객체가 어떤 식으로 파일을 읽었나 확인해보세요 :) 
    //   console.log(reader.result);
      dispatch(imageActions.setPreview(reader.result));
    };
  };

  return (
    <React.Fragment>
      <input
        type="file"
        onChange={selectFile}
        ref={fileInput}
      />
    </React.Fragment>
  );
};

export default Upload;
