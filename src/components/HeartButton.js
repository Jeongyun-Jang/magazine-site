import React from "react";
import styled from "styled-components";

// 분홍 하트, 회색 하트 이미지 가져오기
import heart_full from "../shared/heart_full.png";
import heart_default from "../shared/heart_default.png";

// 하트 버튼은 일단 모양새만 잡아줄거예요!
const HeartButton = (props) => {

  const icon_url = props.is_like? heart_full : heart_default;

  return (
    <React.Fragment>
      <Heart onClick={props._onClick} icon_url={icon_url}></Heart>
    </React.Fragment>
  );
};

const Heart = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  background: url(${(props) => props.icon_url});
  background-size: cover;
  cursor: pointer;
`;

export default HeartButton;
