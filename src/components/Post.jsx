//1.必要なものをimportします😊
import React, { useState } from "react";
import { db } from "../firebase";
import { doc, collection, setDoc, deleteDoc } from "firebase/firestore";
import { ImHome, ImBin, ImPencil } from "react-icons/im";

const Post = ({ id, editTitle, editText, image }) => {
  // 2.更新処理のためのuseStateを用意します😊
  // editTitle,editTextは[firebaseに保存されているデータになります😊]
  // そしてそのデータを「更新」する必要があるため、useStateで保持する必要があります😊
  const [title, setTitle] = useState(editTitle);
  const [text, setText] = useState(editText);

  //3.コレクション（箱=firebaseに保存されている場所）にアクセスする準備をします😊
  const data = collection(db, "posts");
  console.log(data, "firebaseに保存されているデータ");

  //4. 更新の処理を記述します😊
  const edit = async () => {
    await setDoc(
      doc(data, id),
      {
        title: title,
        text: text,
      },
      { merge: true }
    );
  };

  //5. 削除の処理を記述します😊
  const deleteTask = async () => {
    await deleteDoc(doc(data, id));
  };

  return (
    <div>
      {/* 4.表示の部分を記述します */}
      <div>
        <p>{title}</p>
        <p>{text}</p>
        <div>{image && <img src={image} />}</div>
        {/* <ImHome /> */}

        <p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </p>
      </div>
      {/* 更新用のボタンを記述します😊 */}
      <button onClick={edit}>
        <ImPencil />
        更新
      </button>
      <button onClick={deleteTask}>
        <ImBin />
        削除
      </button>
    </div>
  );
};

export default Post;
