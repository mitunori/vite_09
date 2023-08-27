import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const Login = () => {
  // 1. ページ遷移をさせる記述です😊
  const navigate = useNavigate();

  // 2.グーグルの認証の処理（firebaseが用意してくれています😊）
  const googleLogin = () => {
    const provider = new GoogleAuthProvider();

    console.log(auth, "認証情報"); //firebaseのauthに接続できるか確認
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result, "成功したらresultにデータが入ります😊");
        console.log("Googleアカウントでログインしました！😊");
      })
      .catch((error) => {
        console.log(error, "エラーです！！");
      });
  };

  // 3.ログインチェック
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log(user, "user情報をチェック😊");

      // userにはログイン or 登録情報が「確認」できるので　true or falseで判断します😊
      // !userは[false]になるので、user情報がないときです！
      if (user) {
        user && navigate("/");
      } else {
        user && navigate("/login");
      }
    });

    return () => unSub();
    // navigateに変更があるたびに監視している↓[navigate]
  }, [navigate]);

  return (
    <div>
      <h2>GoggleLogin</h2>
      <button onClick={googleLogin}>ログイン</button>
    </div>
  );
};

export default Login;
