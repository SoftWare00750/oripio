import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { colors } from "../theme/colors";

// A lightweight schematic map (roads + a route line) recreating the look
// of the tracking/checkout map cards in the design, without depending on
// a live maps SDK or external map-tile imagery.
export default function StylizedMap({ style, showPins = true }) {
  return (
    <View style={[styles.wrap, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
        <Rect x="0" y="0" width="400" height="260" fill="#EDEEF0" />
        <Path d="M0 40 H400" stroke="#DADCE0" strokeWidth="6" />
        <Path d="M0 130 H400" stroke="#DADCE0" strokeWidth="10" />
        <Path d="M0 210 H400" stroke="#DADCE0" strokeWidth="6" />
        <Path d="M70 0 V260" stroke="#DADCE0" strokeWidth="6" />
        <Path d="M180 0 V260" stroke="#DADCE0" strokeWidth="10" />
        <Path d="M310 0 V260" stroke="#DADCE0" strokeWidth="6" />

        <Path
          d="M60 220 C 110 210, 90 150, 140 140 S 200 100, 190 70 S 260 55, 300 60 S 330 45, 340 40"
          stroke={colors.primary}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="1 14"
          fill="none"
        />

        {showPins && (
          <>
            <Circle cx="60" cy="220" r="9" fill={colors.black} />
            <Circle cx="60" cy="220" r="4" fill={colors.white} />
            <Circle cx="340" cy="40" r="9" fill={colors.primary} />
            <Circle cx="340" cy="40" r="4" fill={colors.white} />
          </>
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", height: "100%", overflow: "hidden", backgroundColor: "#EDEEF0" },
});
