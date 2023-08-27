import React from "react";

const Add = ({
  addData,
  handleTitleChange,
  handleTextChange,
  titleValue,
  textValue,
  onChangeImageHandler,
}) => {
  return (
    <div>
      {/* hrタグは線 */}
      <hr />
      <h1>登録の処理</h1>
      {/* インプットの文字をこのパーツに渡して表示をしている */}
      <p>{titleValue}</p>
      <p>{textValue}</p>

      {/* 入力させるinputタグを記述 */}
      <input type="text" value={titleValue} onChange={handleTitleChange} />
      <input type="text" value={textValue} onChange={handleTextChange} />

      {/* input 画像のファイル選択のタグ */}
      <input type="file" onChange={onChangeImageHandler} />

      {/* 送信のボタンを記述 */}
      <button onClick={addData}>送信</button>
    </div>
  );
};

export default Add;
