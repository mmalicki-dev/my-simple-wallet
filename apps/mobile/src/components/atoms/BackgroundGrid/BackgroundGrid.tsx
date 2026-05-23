import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { useColors } from '@/hooks';
import { alpha } from '@/theme/colors';

const CELL = 48;

export const BackgroundGrid = () => {
  const colors = useColors();
  const { width, height } = useWindowDimensions();

  const path = useMemo(() => {
    const p = Skia.Path.Make();
    for (let y = 0; y <= height; y += CELL) {
      p.moveTo(0, y);
      p.lineTo(width, y);
    }
    for (let x = 0; x <= width; x += CELL) {
      p.moveTo(x, 0);
      p.lineTo(x, height);
    }
    return p;
  }, [width, height]);

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      <Path
        path={path}
        color={alpha(colors.neon, 0.12)}
        style="stroke"
        strokeWidth={1}
      />
    </Canvas>
  );
};
