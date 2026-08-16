import React from "react";
import Svg, { Circle, Polygon } from "react-native-svg";
import { colors } from "../theme/colors";

// Recreates the Oripio mark: a red disc with a white 4-blade pinwheel,
// as shown in the brand guide screenshot.
export default function Logo({ size = 40, background = colors.primary, blade = colors.white }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Circle cx="100" cy="100" r="98" fill={background} />
      <Polygon points="100,100 100,20 60,100" fill={blade} />
      <Polygon points="100,100 20,100 100,140" fill={blade} />
      <Polygon points="100,100 100,180 140,100" fill={blade} />
      <Polygon points="100,100 180,100 100,60" fill={blade} />
    </Svg>
  );
}
