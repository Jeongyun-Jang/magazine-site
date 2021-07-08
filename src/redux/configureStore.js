import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

// 리듀서를 가져오기
import User from "./modules/user";
import  Post  from "./modules/post";
import Image from "./modules/image";

// 브라우저 히스토리를 만들기
export const history = createBrowserHistory();

// 가져온 리듀서 루트 리듀서로 묶기
const rootReducer = combineReducers({
  user: User,
  post: Post,
  image: Image,
  router: connectRouter(history),
});

// 사용할 미들웨어를 여기에 넣어줌
const middlewares = [thunk.withExtraArgument({ history: history })];

const env = process.env.NODE_ENV;

if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      })
    : compose;

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// 스토어 만들기
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();
