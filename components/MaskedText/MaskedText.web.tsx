import { useThemeColor } from "@/hooks/useThemeColor";
import { MaskedTextProps } from "./types";
import "./masked-text.css";
import { useState } from "react";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";

export default function MaskedText({
  color,
  text,
  pathLength,
  pressing,
  baseColor,
}: MaskedTextProps) {
  const textColor = useThemeColor({}, "text");
  const [duration, setDuration] = useState(0);
  const [pressed, setPressing] = useState(false);
  console.log(pressed);

  useAnimatedReaction(
    () => pressing?.value,
    (value) => {
      runOnJS(setPressing)(!!value);
    },
    []
  );

  useAnimatedReaction(
    () => pathLength?.value,
    (value) => {
      runOnJS(setDuration)((value ?? 0) * 2);
    },
    []
  );

  const textStyle: React.CSSProperties = {
    fontSize: 15,
    color: textColor,
    fontFamily: "InterMedium",
  };

  return (
    <div className="masked-text">
      <div
        className={`progress ${pressed ? "fill" : "empty"}`}
        style={{
          backgroundColor: baseColor,
          transitionDuration: `${duration}ms`,
        }}
      />
      <div className="base" style={textStyle}>
        {text}
      </div>
      <div
        className={`overlay ${pressed ? "pressing" : "init"}`}
        style={{ ...textStyle, color, transitionDuration: `${duration}ms` }}
      >
        {text}
      </div>
    </div>
  );
}
