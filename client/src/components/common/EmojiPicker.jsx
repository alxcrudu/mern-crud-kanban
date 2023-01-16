import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const EmojiPicker = (props) => {
  const { theme } = useContext(ThemeContext);
  const [selectedEmoji, setSelectedEmoji] = useState();
  const [isShowPicker, setIsShowPicker] = useState(false);

  useEffect(() => {
    setSelectedEmoji(props.icon);
  }, [props.icon]);

  const selectEmoji = (e) => {
    const sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    const emoji = String.fromCodePoint(...codesArray);
    setIsShowPicker(false);
    props.onChange(emoji);
  };

  const showPicker = () => setIsShowPicker(!isShowPicker);

  return (
    <div className="relative w-min">
      <h3 className="cursor-pointer text-4xl" onClick={showPicker}>
        {selectedEmoji}
      </h3>
      <div
        style={{
          display: isShowPicker ? "block" : "none",
          position: "absolute",
          top: "100%",
          zIndex: "10",
        }}
      >
        <Picker theme={theme} data={data} onEmojiSelect={selectEmoji} showPreview={false} />
      </div>
    </div>
  );
};

export default EmojiPicker;
