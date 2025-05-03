import { FontAwesome6 } from "@expo/vector-icons/";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const CELL_WIDTH = Dimensions.get("window").width / 7;
const INITIAL_PAN_VALUE = { x: CELL_WIDTH, y: CELL_WIDTH };
const TOTAL_CELLS = 2 * 7 * 7;
const CELLS = Array.from({ length: TOTAL_CELLS }, (_, index) => index);

const SPRING_CONFIG = {
  stiffness: 200,
  damping: 25,
  mass: 1,
};

export default function Home() {
  const panValue = useSharedValue(INITIAL_PAN_VALUE);
  const gesture = Gesture.Pan()
    .onBegin((e) => {
      panValue.value = withSpring({ x: e.x, y: e.y }, SPRING_CONFIG);
    })
    .onChange((e) => {
      panValue.value = {
        x: panValue.value.x + e.changeX,
        y: panValue.value.y + e.changeY,
      };
    })
    .onFinalize(() => {
      panValue.value = withSpring(INITIAL_PAN_VALUE, SPRING_CONFIG);
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <GestureDetector gesture={gesture}>
          <View style={styles.grid}>
            {CELLS.map((_, index) => (
              <Cell key={index} panValue={panValue} index={index} />
            ))}
          </View>
        </GestureDetector>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const Cell = ({
  index,
  panValue,
}: {
  index: number;
  panValue: SharedValue<{ x: number; y: number }>;
}) => {
  const theme = useTheme();
  const axis = useSharedValue({ x: 0, y: 0 });
  const angleToTarget = useSharedValue(0);
  const distanceToTarget = useSharedValue(0);
  const rawAngle = useSharedValue(0);
  const lastTargetAngle = useSharedValue(0);

  useDerivedValue(() => {
    const calculatedTargetAngle = calculateRotation(axis.value, panValue.value);

    let diff = calculatedTargetAngle - lastTargetAngle.value;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    rawAngle.value = rawAngle.value + diff;
    lastTargetAngle.value = calculatedTargetAngle;
    angleToTarget.value = withSpring(rawAngle.value, SPRING_CONFIG);
    distanceToTarget.value = withSpring(
      calculateDistance(axis.value, panValue.value),
      SPRING_CONFIG
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      distanceToTarget.value,
      [0, CELL_WIDTH * 3],
      [1.5, 1],
      Extrapolation.CLAMP
    );

    const translateX = interpolate(
      distanceToTarget.value,
      [0, CELL_WIDTH * 1.5, CELL_WIDTH * 4],
      [0, 10, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity: interpolate(scale, [1, 1.5], [0.4, 1]),
      transform: [
        { scale },
        { rotate: `${angleToTarget.value}deg` },
        { translateX: translateX },
      ],
    };
  });

  return (
    <View
      key={index}
      style={styles.cell}
      onLayout={({ nativeEvent }) => {
        axis.value = {
          x: nativeEvent.layout.x + nativeEvent.layout.width / 2,
          y: nativeEvent.layout.y + nativeEvent.layout.height / 2,
        };
      }}
    >
      <Animated.View style={animatedStyle}>
        <FontAwesome6 name="arrow-right" size={30} color={theme.colors.text} />
      </Animated.View>
    </View>
  );
};

const calculateRotation = (
  source: { x: number; y: number },
  target: { x: number; y: number }
) => {
  "worklet";
  const angleRad = Math.atan2(target.y - source.y, target.x - source.x);
  const angleDeg = angleRad * (180 / Math.PI);
  return angleDeg;
};

const calculateDistance = (
  source: { x: number; y: number },
  target: { x: number; y: number }
) => {
  "worklet";
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: CELL_WIDTH,
    height: CELL_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
});
