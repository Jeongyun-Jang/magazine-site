import React from "react";
import Post from "../components/Post";

import { useDispatch, useSelector } from "react-redux";

import { actionCreators as postActions } from "../redux/modules/post";

// 게시글 상세 페이지
const PostDetail = (props) => {
  const dispatch = useDispatch();
  const id = props.match.params.id;

  const user_info = useSelector((state) => state.user.user);

  //   리덕스에서 게시글 목록을 가져오기
  const post_list = useSelector((store) => store.post.list);

//   게시글 id로 현재 게시글이 게시글 목록에서 몇 번째에 있나 인덱스를 찾기
  const post_idx = post_list.findIndex((p) => p.id === id);

//   인덱스로 게시글 상세정보를 가져오기
  const post = post_list[post_idx];

  React.useEffect(() => {

    // 만약 게시글이 없는 경우
    if (post) {
      return;
    }

    dispatch(postActions.getOnePostFB(id));
  }, []);

  return (
    <React.Fragment>
      {post && (
        <Post {...post} is_me={post.user_info.user_id === user_info?.uid} />
      )}
    </React.Fragment>
  );
};

export default PostDetail;
