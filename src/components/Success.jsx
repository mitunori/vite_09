import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { v4 as uuidv4 } from "uuid"; //後で　これは今不要です

// firebaseを使うために用意されているおまじないを読み込む
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  QuerySnapshot,
} from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import Add from "./Add";
import Post from "./Post";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log(user, "user情報をチェック！");
      //userにはログインor登録されているかの状態がtrue/falseで入ってくるので、!userはfalse＝user情報がないとき!
      !user && navigate("/login");
    });

    return () => unSub();
  }, [navigate]);

  const googleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  // 08/06ここから下に記述
  //1. useStateを準備して、データを取得できるようにする🤗
  const [data, setData] = useState([
    {
      id: "",
      title: "",
      text: "",
      image: "",
    },
  ]);
  console.log(data, "useStateの箱の中身");

  //3. 登録用のuseStateを準備します🤗
  const [titleValue, setTitleValue] = useState("");
  // 追加したinput用
  const [textValue, setTextValue] = useState("");

  //追加
  const [image, setImage] = useState(null);

  const onChangeImageHandler = (e) => {
    console.log(e.target.files[0], "画像");
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      e.target.value = "";
    }
  };

  // 2. useEffectを使って画面表示の際にfirebaseからデータを取得する
  useEffect(() => {
    //2.1 query=コレクション(firebaseのデータが入る箱のこと)
    const q = query(collection(db, "posts")); //データにアクセス

    // 2.2
    const unsub = onSnapshot(q, (QuerySnapshot) => {
      setData(
        QuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          text: doc.data().text,
          image: doc.data().image,
        }))
      );
    });
    return () => unsub();
  }, []);

  //4. inputのonChangeのイベントを記述🤗
  const handleTitleChange = (e) => {
    console.log(e, "event");
    console.log(e.target, "event target");
    setTitleValue(e.target.value);
  };

  const handleTextChange = (e) => {
    console.log(e, "event");
    console.log(e.target, "event target");
    setTextValue(e.target.value);
  };

  //5. 送信の処理を記述＝送信のボタンが押されたら登録の処理を実行する🤗
  const addData = async () => {
    // 処理を記述していきます🤗
    // firebaseへの登録の処理
    // await addDoc(
    //   collection(db, "posts"), //場所どこ？ 今回は[posts]に変更する😊
    //   {
    //     title: titleValue,
    //     text: textValue,
    //   }
    // );
    // e.preventDefault();
    if (image) {
      //後で記述

      // 画像 + テキストの処理
      // firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元のファイルが削除される
      // そのためにファイル名をランダムに作成する必要があるので「jsのテクニック」でランダムな文字列を作成
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補62文字
      const N = 16;

      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が16個選ばれる
        .map((n) => S[n % S.length])
        .join("");

      const fileName = randomChar + "_" + image.name;

      //Firebase ver9 compliant (firebase strageに登録している箇所↓)
      const uploadImage = uploadBytesResumable(
        ref(storage, `images/${fileName}`),
        image
      );

      // 画像とテキストをfirestoreの方に送る記述
      //Firebase ver9 compliant
      uploadImage.on(
        "state_changed",
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          //Firebase ver9 compliant
          //ファイル名 12345 +  morita = 12345morita
          //ref(storage, `images/${fileName}`) ＝
          await getDownloadURL(ref(storage, `images/${fileName}`)).then(
            async (url) => {
              addDoc(collection(db, "posts"), {
                image: url,
                title: titleValue,
                text: textValue,
              });
            }
          );
        }
      );
    } else {
      //Firebase ver9 compliant
      addDoc(collection(db, "posts"), {
        image: "",
        title: titleValue,
        text: textValue,
      });
    }

    // 文字を空にします🤗
    setTitleValue("");
    setTextValue("");
  };

  return (
    <div>
      <h1>Success</h1>

      <div>成功した時に表示したい中身を記述してみましょう🤗</div>
      {/* ログアウトのボタン */}
      <button onClick={googleLogOut}>ログアウト</button>
      {/* ここから下記述 */}
      <hr />
      {/* 登録の処理 */}
      <Add
        addData={addData}
        titleValue={titleValue}
        textValue={textValue}
        handleTitleChange={handleTitleChange}
        handleTextChange={handleTextChange}
        onChangeImageHandler={onChangeImageHandler}
      />

      <hr />
      {/* 表示のロジック */}
      {data.map((item, index) => (
        <Post
          key={item.id}
          id={item.id}
          editTitle={item.title}
          editText={item.text}
          image={item.image}
        />
      ))}
    </div>
  );
};

export default Success;
