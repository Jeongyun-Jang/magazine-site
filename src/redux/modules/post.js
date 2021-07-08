import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import "moment";
import moment from "moment";
import { realtime } from "../../shared/firebase"; //realtime for 알림뱃지

import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const DELETE_POST = "DELETE_POST";
const LOADING = "LOADING";

// 좋아요 토글하기 액션
const LIKE_TOGGLE = "LIKE_TOGGLE";

const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const deletePost = createAction(DELETE_POST, (post_id) => ({ post_id }));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

// 좋아요 토글 액션 생성자
const likeToggle = createAction(LIKE_TOGGLE, (post_id, is_like = null) => ({
  post_id,
  is_like,
}));

const initialState = {
  list: [],
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
};


// layout_type : a, b, c
//  - a : 텍스트가 위, 이미지가 아래인 레이아웃
//  - b : 텍스트가 좌측, 이미지가 우측인 레이아웃
//  - c : 텍스트가 우측, 이미지가 좌측인 레이아웃
// image_url : 이미지 주소
// like_cnt : 좋아요 갯수
// insert_dt : 작성일시
// is_like : 좋아요 여부 (로그인한 유저 기준이겠죠!)
const initialPost = {
  image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  contents: "",
  like_cnt: 0,
  layout_type: "a",
  is_like: false,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

// 게시글 수정하기
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }

    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];
    // console.log(_post);

    const postDB = firestore.collection("post");

    if (_image === _post.image_url) {
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          dispatch(imageActions.setPreview(null));
          history.replace("/");
        });
      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      // 이미지를 업로드하고,
      _upload.then((snapshot) => {

        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            // console.log(url);

            return url;
          })
          .then((url) => {

            postDB
              .doc(post_id)
              .update({ ...post, image_url: url })
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url }));
                dispatch(imageActions.setPreview(null));
                history.replace("/");
              });
          })
          .catch((err) => {
            window.alert("앗! 이미지 업로드에 문제가 있어요!");
            console.log("앗! 이미지 업로드에 문제가 있어요!", err);
          });
      });
    }
  };
};

// 게시글 추가하기
const addPostFB = (contents = "", layout_type = "a") => {
  return function (dispatch, getState, { history }) {
    
    const postDB = firestore.collection("post");

    const _user = getState().user.user;

    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };

    const _post = {
      ...initialPost,
      contents: contents,
      layout_type: layout_type,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    const _image = getState().image.preview;

    if (!_image) {
      window.alert("이미지가 필요해요!");
      return;
    }
    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          return url;
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace("/");

              dispatch(imageActions.setPreview(null));
            })
            .catch((err) => {
              window.alert("앗! 포스트 작성에 문제가 있어요!");
              console.log("post 작성에 실패했어요!", err);
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log("앗! 이미지 업로드에 문제가 있어요!", err);
        });
    });
  };
};

const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    let _paging = getState().post.paging;

    if (_paging.start && !_paging.next) {
      return;
    }

    dispatch(loading(true));

    const postDB = firestore.collection("post");

    let query = postDB.orderBy("insert_dt", "desc");

      if (start) {
      query = query.startAt(start);
    }

    query
      .limit(size + 1)
      .get()
      .then((docs) => {
        let post_list = [];

        let paging = {
          start: docs.docs[0],
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          size: size,
        };

        docs.forEach((doc) => {
          let _post = doc.data();

          let post = Object.keys(_post).reduce(
            (acc, cur) => {
              if (cur.indexOf("user_") !== -1) {
                return {
                  ...acc,
                  user_info: { ...acc.user_info, [cur]: _post[cur] },
                };
              }

              return { ...acc, [cur]: _post[cur] };
            },
            { id: doc.id, user_info: {} }
          );

          post_list.push(post);
        });

        if (paging.next) {
          post_list.pop();
        }

        if(getState().user.user){
          dispatch(setIsLike(post_list, paging));
        }else{
          dispatch(setPost(post_list, paging));
        }
        
      });
  };
};

const toggleLikeFB = (post_id) => {

 

  return function (dispatch, getState, { history }) {
    if (!getState().user.user) {
      return;
    }

    const postDB = firestore.collection("post");
    const likeDB = firestore.collection("like");

    const _idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_idx];
    const user_id = getState().user.user.uid;

    if (_post.is_like) {
      likeDB
        .where("post_id", "==", _post.id)
        .where("user_id", "==", user_id)
        .get()
        .then((docs) => {

          let batch = firestore.batch();

          docs.forEach((doc) => {
            batch.delete(likeDB.doc(doc.id));
          });

          batch.update(postDB.doc(post_id), {
            like_cnt:
              //_post.like_cnt - 1 < 1 ? _post.like_cnt :
               _post.like_cnt - 1,
          });

          batch.commit().then(() => {

            dispatch(likeToggle(post_id, !_post.is_like));
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
 
      likeDB.add({ post_id: post_id, user_id: user_id })
      .then(doc => {
        postDB.doc(post_id).update({ like_cnt: _post.like_cnt + 1 }).then(doc => {
          dispatch(likeToggle(post_id, !_post.is_like));
        });

        //게시글 작성한 사람에게 알람이가도록
        const _noti_item = realtime.ref(`noti/${_post.user_info.user_id}/list`).push();//ref로 해당 경로 참조 가져와 
        _noti_item.set({//set 1번째 파라미터 : , 2번째 파라미터 : error일 때
            post_id: _post.id,
            user_id: user_id,//user.user_name 아님, 댓글 단 사람의 user_name
            image_url: _post.image_url,
            //insert_dt: like.insert_dt //알림 페이지에서 소팅하기 위함
          }, (err) => {
          if(err){
            console.log("알림 저장에 실패했어요!");
          }else{
            const notiDB = realtime.ref(`noti/${_post.user_info.user_id}`);

            notiDB.update({read: false});//알람 울리도록
          }
        });
      });

    }
  };
};

// 좋아요 리스트를 가져와서 리덕스에 넣어주는 함수
const setIsLike = (_post_list, paging) => {
  return function (dispatch, getState, { history }) {
    // 로그인하지 않았을 땐 리턴!
    if (!getState().user.is_login) {
      return;
    }
    const likeDB = firestore.collection("like");

    const post_ids = _post_list.map((p) => p.id);

    let like_query = likeDB.where("post_id", "in", post_ids);

    like_query.get().then((like_docs) => {
      let like_list = {};
      like_docs.forEach((doc) => {
        if (like_list[doc.data().post_id]) {
          like_list[doc.data().post_id] = [
            ...like_list[doc.data().post_id],
            doc.data().user_id,
          ];
        } else {
          like_list[doc.data().post_id] = [doc.data().user_id];
        }
      });
      const user_id = getState().user.user.uid;
      let post_list = _post_list.map((p) => {
        if (like_list[p.id] && like_list[p.id].indexOf(user_id) !== -1) {
          return { ...p, is_like: true };
        }

        return p;
      });

      dispatch(setPost(post_list, paging));
    });
  };
};

const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(id)
      .get()
      .then((doc) => {
        let _post = doc.data();
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) {
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        dispatch(setIsLike([post]));
      });
  };
};

const deletePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    if (!id) {
      window.alert("삭제할 수 없는 게시글이에요!");
      return;
    }

    const postDB = firestore.collection("post");

    postDB
      .doc(id)
      .delete()
      .then((res) => {
        dispatch(deletePost(id));
        history.replace("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// 리듀서
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);

        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        if (action.payload.paging) {
          draft.paging = action.payload.paging;
        }
        draft.is_loading = false;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post);
      }),
    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);

        if (idx !== -1) {
          draft.list.splice(idx, 1);
        }
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),

    [LIKE_TOGGLE]: (state, action) =>
      produce(state, (draft) => {

        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
        
        draft.list[idx].is_like = action.payload.is_like;
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
  getOnePostFB,
  deletePostFB,
  toggleLikeFB,
};

export { actionCreators };
