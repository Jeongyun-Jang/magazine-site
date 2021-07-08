import React from "react";
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

//   게시글 수정과 작성
const PostWrite = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state) => state.image.preview);
  const post_list = useSelector((state) => state.post.list);

  //   주소창을 보고 id값을 가져옴
  const post_id = props.match.params.id;
  //   post id를 가지고 수정모드인 지, 작성 모드인지 구분
  const is_edit = post_id ? true : false;

  const { history } = props;

  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;

  const [contents, setContents] = React.useState(_post ? _post.contents : "");

  const [layout_type, setLayoutType] = React.useState(
    _post ? _post.layout_type : ""
  );

  React.useEffect(() => {
    // 수정모드인데, 게시글 정보가 없는 경우
    if (is_edit && !_post) {
      window.alert("포스트 정보가 없어요!");
      history.goBack();

      return;
    }

    // 수정모드라
    if (is_edit) {
      dispatch(imageActions.setPreview(_post.image_url));
    }
  }, []);

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  const changeLayoutType = (e) => {
    setLayoutType(e.target.value);
  };

  const addPost = () => {
    dispatch(postActions.addPostFB(contents, layout_type));
  };

  const editPost = () => {
    dispatch(postActions.editPostFB(post_id, { contents: contents }));
  };

  // 로그인 사용자만 작성할 수 있다는 화면을 보여주기
  if (!is_login) {
    return (
      <Grid>
        <Grid margin="100px 0px" padding="16px" center>
          <Text size="32px" bold>
            앗! 잠깐!
          </Text>
          <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
          <Button
            _onClick={() => {
              history.replace("/");
            }}
          >
            로그인 하러가기
          </Button>
        </Grid>
      </Grid>

    );
  }

  return (
    <React.Fragment>
      <Grid padding="50px 16px">
        <Grid padding="16px">
          <Text margin="0px" size="36px" bold>
            {is_edit ? "게시글 수정" : "게시글 작성"}
          </Text>
        </Grid>

        <Grid padding="36px" >
          <Grid padding="16px 0px" is_flex>        
            <Text margin="0px" size="24px" bold>
              이미지 업로드
            </Text>
            <Upload />

          </Grid>
          <Grid padding="16px 0px">
            

            <Text margin="0px" size="24px" bold>
              미리보기
            </Text>
          </Grid>

          <Image 
            size={15}
            shape="rectangle"
            src={preview ? preview : "http://via.placeholder.com/400x300"}
          />

          <Grid padding="16px 0px">
            <Input
              value={contents}
              _onChange={changeContents}
              label="게시글 내용"
              placeholder="게시글 작성"
              multiLine
            />
          </Grid>

          <Grid padding="16px 0px">
            <Input
              type="text"
              value={layout_type}
              _onChange={changeLayoutType}
              label="레이아웃 타입"
              placeholder="a, b, c 중 하나를 골라주세요."
            />
          </Grid>

        </Grid>




        <Grid padding="16px">
          {is_edit ? (
            <Button _onClick={editPost}>게시글 수정</Button>
          ) : (
            <Button _onClick={addPost}>게시글 작성</Button>
          )}
        </Grid>
      </Grid>
  
    </React.Fragment>
  );
};

export default PostWrite;
