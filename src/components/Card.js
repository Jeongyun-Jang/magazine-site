import React from "react";
import { Grid, Image, Text } from "../elements";

import { history } from "../redux/configureStore";

const Card = (props) => {
  const { image_url, user_name, post_id } = props;

  return (
    //카드 눌렀을 때 해당 페이지로 이동하도록
    <Grid
      _onClick={() => {
        history.push(`/post/${post_id}`);
      }}
      padding="16px"
      is_flex
      bg="#ffffff"
      margin="8px 0px"
    >
      <Grid width="auto" margin="0px 8px 0px 0px">
        <Image size={85} shape="square" src={image_url} />
      </Grid>
      <Grid>
        <Text>
          <b>{user_name}</b>님이 좋아요를 눌렀어요 :)
        </Text>
      </Grid>
    </Grid>
  );
};

Card.defaultProps = {
  image_url: "",
  user_name: "",
  post_id: null,
};

export default Card;
