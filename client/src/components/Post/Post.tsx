import { useState, useEffect, useContext } from "react";
import style from "./Post.module.scss";
import { MoreVert, Favorite, ThumbUp } from "@mui/icons-material";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { likePostAPICall } from "../../helpers/apiCalls";

const server = import.meta.env.VITE_SERVER_DOMAIN;

type Props = {
  desc: string;
  comments?: string[];
  date: string;
  description?: string;
  img: string;
  likes: string[];
  userId: string;
  postId: string;
};

type User = {
  _id: number;
  isAdmin: boolean;
  username: string;
  email: string;
  profilePic: string;
  cover: string;
  following: string;
  followers: string;
};

const Post = ({ likes, img, desc, comments, date, userId, postId }: Props) => {
  const { user: currentUser } = useContext(AuthContext);
  const [like, setLike] = useState(likes.length);
  const [currentlyLiked, setCurrentlyLiked] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) {
      setCurrentlyLiked(likes.includes(currentUser._id));
      // console.log("done", currentUser._id);
      // console.log("likes", likes);
      // console.log("currentllLiked:", currentlyLiked);
    }
  }, []);
  // console.log("running", likes.includes(currentUser?._id));

  useEffect(() => {
    console.log("fetching data");
    const fetchUser = async () => {
      const response = await fetch(
        `${server}/users?userId=${currentUser?._id}`,
        {
          headers: {
            "Content-Type": "Application/json",
          },
          method: "GET",
          mode: "cors",
        }
      );
      const data = await response.json();
      setUser(data);
      console.log(likes);
    };
    fetchUser();
  }, []);

  const likeClicker = async () => {
    try {
      const data = await likePostAPICall(postId, JSON.stringify(userId));
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    setLike(liked => (currentlyLiked ? (liked -= 1) : (liked += 1)));
    setCurrentlyLiked(likedStatus => !likedStatus);
  };

  const likeCountText = (count: number) => {
    if (count === 0) return "";
    else if (count === 1) return `${count} person likes this`;
    else return `${count} people like this`;
  };
  return (
    <article className={style.postSection}>
      <div className={style.wrapper}>
        <div className={style.postTop}>
          <div className={style.topLeft}>
            <Link to={`/profile/${user?.username}`}>
              <img
                className={style.posterProfileImg}
                src={user?.profilePic || "/assets/profile/default.png"}
                alt="profile pic of user"
              />
            </Link>
            <span className={style.posterName}>{user?.username}</span>
            <span className={style.postDate}>{format(date)}</span>
          </div>
          <div className={style.topRight}>
            <MoreVert />
          </div>
        </div>
        <div className={style.center}>
          <p className={style.postText}>{desc}</p>
          <img src={img} alt="User post" className={style.postImg} />
        </div>
        <div className={style.bottom}>
          <div className={style.bottomLeft}>
            <Favorite
              htmlColor="#ef3340"
              className={style.likeCons}
              onClick={likeClicker}
            />
            <ThumbUp
              htmlColor="#2e86e0"
              className={style.likeCons}
              onClick={likeClicker}
            />
            <span className={style.likeCount}>{likeCountText(like)}</span>
          </div>
          <div className={style.bottomRight}>
            <span
              className={style.commentSection}
            >{`${comments} comments`}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Post;
