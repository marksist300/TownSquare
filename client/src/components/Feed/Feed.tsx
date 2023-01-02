import { useState, useEffect, useContext } from "react";
import style from "./Feed.module.scss";
import Share from "../Share/Share";
import Post from "../Post/Post";
import { AuthContext } from "../../context/AuthContext";
type username = {
  username: string | undefined;
};

interface Post {
  date: string;
  description: string;
  img: string;
  likes: string[];
  userId: string;
  _id: string;
  comments: string[];
}

const Feed = ({ username }: username) => {
  const { user } = useContext(AuthContext);
  const server = import.meta.env.VITE_SERVER_DOMAIN;
  const [postsData, setPostData] = useState<Post[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      console.log("fetching posts");
      let urlString = "";
      username
        ? (urlString = `${server}/post/fetchUserPosts/${username}`)
        : (urlString = `${server}/post/fetchAll/${user?._id}`);
      const response = await fetch(urlString, {
        headers: {
          "Content-Type": "Application/json",
        },
        method: "GET",
        mode: "cors",
      });
      const data = await response.json();
      setPostData(data);
    };
    fetcher();
  }, [username, user]);

  const posts = postsData.map(item => (
    <Post
      key={item._id}
      likes={item.likes}
      img={item.img}
      userId={item.userId}
      desc={item.description}
      comments={item.comments}
      date={item.date}
      postId={item._id}
    />
  ));

  return (
    <main className={style.feedContainer}>
      <div className={style.wrapper}>
        <Share />
        {posts}
      </div>
    </main>
  );
};

export default Feed;
