import MaskedView from "@react-native-masked-view/masked-view";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import { MaskedTextProps } from "./types";

export default function MaskedText({
  color,
  text,
  animatedStyle,
}: MaskedTextProps) {
  return (
    <>
      <ThemedText style={{ fontSize: 15 }}>{text}</ThemedText>
      <MaskedView
        style={{ flex: 1, ...StyleSheet.absoluteFillObject }}
        maskElement={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThemedText style={{ fontSize: 15, color: "#000" }}>
              {text}
            </ThemedText>
          </View>
        }
      >
        <Animated.View
          style={[
            { flex: 1, height: "100%", backgroundColor: color },
            animatedStyle,
          ]}
        />
      </MaskedView>
    </>
  );
}
