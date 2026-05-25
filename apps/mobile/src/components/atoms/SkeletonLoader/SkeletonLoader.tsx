import { useRef, useEffect } from "react";
import { View, Animated, Easing, StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { useColors } from "@/hooks";
import { alpha } from "@/theme/colors";

interface SkeletonLoaderProps {
  count?: number;
  height?: number;
}

export const SkeletonLoader = ({ count = 1, height = 36 }: SkeletonLoaderProps) => {
  const colors = useColors();
  const { width: screenWidth } = useWindowDimensions();
  const scanX = useRef(new Animated.Value(-screenWidth)).current;
  const uid = useRef(Math.random().toString(36).slice(2)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(scanX, {
        toValue: screenWidth * 3,
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [scanX, screenWidth]);

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.skeleton,
            {
              height,
              backgroundColor: alpha(colors.neon, 0.08),
              borderLeftColor: alpha(colors.neon, 0.35),
            },
          ]}
        >
          <Animated.View
            style={[styles.sweep, { transform: [{ translateX: scanX }] }]}
          >
            <Svg width={screenWidth} height="100%">
              <Defs>
                <LinearGradient id={`sk-${uid}-${i}`} x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0.15" stopColor={colors.neon} stopOpacity="0" />
                  <Stop offset="0.5" stopColor={colors.neon} stopOpacity="0.65" />
                  <Stop offset="0.85" stopColor={colors.neon} stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill={`url(#sk-${uid}-${i})`} />
            </Svg>
          </Animated.View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    width: "100%",
    borderLeftWidth: 2,
    overflow: "hidden",
  },
  sweep: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
});
