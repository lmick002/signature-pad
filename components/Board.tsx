import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import DrawPad from "./Drawpad";
import { Eraser, LucideProps, PenLine, Type, Undo } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";

const ICON_PROPS: LucideProps = {
  size: 21,
  strokeWidth: 1.8,
};

export default function Board() {
  const text = useThemeColor({}, "text");
  const padRef = useRef<any>(null);

  const handleErase = () => {
    if (padRef.current) {
      padRef.current.erase();
    }
  };
  const handleUndo = () => {
    if (padRef.current) {
      padRef.current.play();
    }
  };

  return (
    <View
      style={{
        boxShadow: "0px 2px 8px #00000015",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: text + "25",
      }}
    >
      <HeaderBar />
      <DrawPad height={180} width={330} ref={padRef} />
      <ActionBar onErase={handleErase} onUndo={handleUndo} />
    </View>
  );
}
const ActionBar = ({
  onErase,
  onUndo,
}: {
  onErase?: () => void;
  onUndo?: () => void;
}) => {
  const text = useThemeColor({}, "text");

  const iconProps: LucideProps = {
    ...ICON_PROPS,
    color: text,
  };

  return (
    <View style={{ padding: 12 }}>
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          opacity: 0.6,
        }}
      >
        <Pressable onPress={onUndo} style={styles.button}>
          <Undo {...iconProps} />
        </Pressable>
        <Pressable onPress={onErase} style={styles.button}>
          <Eraser {...iconProps} />
        </Pressable>
      </View>
    </View>
  );
};

const HeaderBar = () => {
  const text = useThemeColor({}, "text");

  const iconProps: LucideProps = {
    ...ICON_PROPS,
    size: 20,
    color: text,
  };

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        opacity: 0.6,
        paddingHorizontal: 12,
        alignItems: "center",
      }}
    >
      <Pressable>
        <PenLine {...iconProps} />
      </Pressable>
      <ThemedText style={{ lineHeight: 48 }}>Draw signature</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
  },
});
