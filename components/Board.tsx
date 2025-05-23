import { Easing, Pressable, StyleSheet, View } from "react-native";
import React, { useRef } from "react";
import DrawPad from "./Drawpad";
import {
  Eraser,
  Eye,
  LucideProps,
  PenLine,
  RotateCcw,
  Undo,
} from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MaskedView from "@react-native-masked-view/masked-view";

const ICON_PROPS: LucideProps = {
  size: 21,
  strokeWidth: 1.8,
};

export default function Board() {
  const text = useThemeColor({}, "text");
  const padRef = useRef<any>(null);
  const pathLength = useSharedValue<number>(0);
  const playing = useSharedValue<boolean>(false);
  const signed = useSharedValue<boolean>(false);

  const handleErase = () => {
    if (padRef.current) {
      padRef.current.erase();
    }
  };
  const handleUndo = () => {
    if (padRef.current) {
      padRef.current.undo();
    }
  };
  const handleReset = () => {
    if (padRef.current) {
      padRef.current.erase();
    }
  };
  const handlePreview = () => {
    if (padRef.current) {
      padRef.current.play();
    }
  };

  const handleStop = () => {
    if (padRef.current) {
      padRef.current.stop();
    }
  };

  const handleSign = () => {
    if (padRef.current) {
      handleStop();
      setTimeout(() => {
        playing.value = true;
      }, 0);
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
      <HeaderBar
        onReset={handleReset}
        onPreview={handlePreview}
        pathLength={pathLength}
      />
      <DrawPad
        height={180}
        width={340}
        ref={padRef}
        stroke={text}
        pathLength={pathLength}
        playing={playing}
      />
      <ActionBar
        onErase={handleErase}
        onUndo={handleUndo}
        onStop={handleStop}
        onPlay={handleSign}
        pathLength={pathLength}
        signed={signed}
      />
    </View>
  );
}
const ActionBar = ({
  onErase,
  onUndo,
  onStop,
  onPlay,
  pathLength,
  signed,
}: {
  onErase: () => void;
  onUndo: () => void;
  onStop: () => void;
  onPlay: () => void;
  pathLength: SharedValue<number>;
  signed: SharedValue<boolean>;
}) => {
  const text = useThemeColor({}, "text");
  const buttonWidth = 140;
  const pressing = useSharedValue(false);

  const iconProps: LucideProps = {
    ...ICON_PROPS,
    color: text,
  };

  useAnimatedReaction(
    () => pressing.value,
    (isPressing) => {
      if (isPressing) {
        runOnJS(onPlay)();
      } else {
        runOnJS(onStop)();
      }
    }
  );

  const progress = useDerivedValue(() => {
    return pressing.value && pathLength.value > 0
      ? withTiming(
          1,
          {
            duration: pathLength.value * 2,
          },
          () => {
            signed.value = true;
          }
        )
      : 0;
  });

  const slideAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: buttonWidth * progress.value,
    };
  });

  return (
    <View
      style={{
        padding: 8,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
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
      <Pressable
        style={[
          styles.confirmBtn,
          { backgroundColor: text + "20", width: buttonWidth },
        ]}
        onPressIn={() => {
          pressing.value = true;
        }}
        onPressOut={() => {
          pressing.value = false;
        }}
      >
        <OverlayMask
          color="#D1FADC"
          element={
            <View
              style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
            />
          }
          animatedStyle={slideAnimatedStyle}
        />
        <ThemedText style={{ fontSize: 15 }}>Hold to confirm</ThemedText>
        <OverlayMask
          color="#1B7F3E"
          element={
            <ThemedText style={{ fontSize: 15, color: "#000" }}>
              Hold to confirm
            </ThemedText>
          }
          animatedStyle={slideAnimatedStyle}
        />
      </Pressable>
    </View>
  );
};

const OverlayMask = ({
  color,
  element,
  animatedStyle,
}: {
  color: string;
  element: React.ReactNode;
  animatedStyle?: any;
}) => {
  return (
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
          {element}
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
  );
};

const HeaderBar = ({
  onReset,
  onPreview,
  pathLength,
}: {
  onPreview?: () => void;
  onReset?: () => void;
  pathLength: SharedValue<number>;
}) => {
  const text = useThemeColor({}, "text");

  const iconProps: LucideProps = {
    ...ICON_PROPS,
    size: 20,
    color: text,
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(pathLength.value > 0 ? 0 : -50, {
            duration: 300,
          }),
        },
      ],
    };
  });

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
      <Animated.View
        style={[
          {
            flex: 1,
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            justifyContent: "flex-end",
          },
          animatedStyle,
        ]}
      >
        <Pressable onPress={onPreview} style={styles.headerBtn}>
          <Eye {...iconProps} size={22} />
        </Pressable>
        <Pressable onPress={onReset} style={styles.headerBtn}>
          <RotateCcw {...iconProps} size={19} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingLeft: 12,
  },
  headerBtn: {
    paddingRight: 6,
  },
  confirmBtn: {
    padding: 8,
    alignItems: "center",
    borderRadius: 6,
    overflow: "hidden",
  },
});
