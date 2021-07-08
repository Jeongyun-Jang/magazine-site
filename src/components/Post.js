import React from "react";
import { Grid, Image, Text, Button } from "../elements";
import { HeartButton } from "./index";

import { history } from "../redux/configureStore";

import { useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

// 게시글 1개 뷰를 담당합니다.
// layout_type에 따라 각각 타입에 맞는 레이아웃을 그려줄거예요.
// layout_type : a, b, c
//  - a : 텍스트가 위, 이미지가 아래인 레이아웃
//  - b : 텍스트가 좌측, 이미지가 우측인 레이아웃
//  - c : 텍스트가 우측, 이미지가 좌측인 레이아웃
// image_url : 이미지 주소
// like_cnt : 좋아요 갯수
// insert_dt : 작성일시
// user_info: 유저 정보 (딕셔너리 / user_name, user_id, user_profile를 가지고 있어요.)
// is_like : 지금 로그인한 사용자가 좋아요를 눌렀는 지 아닌 지
// is_me : 지금 로그인한 사용자가 작성자인지 아닌 지 판단해요.
// id : 게시글 id
// contents : 게시글 내용
const Post = React.memo((props) => {
  const dispatch = useDispatch();

  return (
    <React.Fragment>
      <Grid padding="50px 200px">
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <React.Fragment>
                <Button
                  width="auto"
                  margin="4px"
                  padding="4px"
                  _onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    history.push(`/write/${props.id}`);
                  }}
                >
                  수정
                </Button>
                <Button
                  width="auto"
                  margin="4px"
                  padding="4px"
                  _onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // 게시글 삭제하기
                    dispatch(postActions.deletePostFB(props.id));
                  }}
                >
                  삭제
                </Button>
              </React.Fragment>
            )}
          </Grid>
        </Grid>

        {/* layout type이 a일 때 */}
        {props.layout_type === "a" && (
          <React.Fragment>
            <Grid padding="16px">
              <Text>{props.contents}</Text>
            </Grid>
            <Grid>
              <Image shape="rectangle" src={props.image_url} />
            </Grid>
          </React.Fragment>
        )}

        {/* layout type이 b일 때 */}
        {props.layout_type === "b" && (
          <React.Fragment>
            <Grid is_flex>
              <Grid width="50%" padding="16px">
                <Text>{props.contents}</Text>
              </Grid>
              <Image shape="rectangle" src={props.image_url} />
            </Grid>
          </React.Fragment>
        )}

        {/* layout type이 c일 때 */}
        {props.layout_type === "c" && (
          <React.Fragment>
            <Grid is_flex>
              <Image shape="rectangle" src={props.image_url} />
              <Grid width="50%" padding="16px">
                <Text>{props.contents}</Text>
              </Grid>
            </Grid>
          </React.Fragment>
        )}

        <Grid is_flex padding="16px">
          <Text margin="0px" bold>
            좋아요 {props.like_cnt}개
          </Text>

          <HeartButton
            _onClick={(e) => {

              e.preventDefault();
              e.stopPropagation();
              dispatch(postActions.toggleLikeFB(props.id));
            }}
            is_like={props.is_like}
          ></HeartButton>
        </Grid>
      </Grid>
    </React.Fragment>
  );
});

Post.defaultProps = {
  id: null,
  user_info: {
    user_id: "",
    user_name: "",
    user_profile: "",
  },
  image_url: "",
  contents: "",
  like_cnt: 10,
  layout_type: "a",
  insert_dt: "2021-02-27 10:00:00",
  is_like: false,
  is_me: false,
};

export default Post;
