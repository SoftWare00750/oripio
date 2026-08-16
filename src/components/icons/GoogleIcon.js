import React from "react";
import Svg, { Path } from "react-native-svg";

// Google "G" mark. Path data sourced from the simple-icons project
// (https://github.com/simple-icons/simple-icons, CC0), which republishes
// official brand marks for exactly this kind of "sign in with" button use.
// Rendered here as multi-color paths matching Google's real brand colors
// instead of the flat single-color simple-icons version.
export default function GoogleIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M23.52 12.273c0-.851-.076-1.67-.218-2.455H12v4.645h6.458a5.52 5.52 0 0 1-2.395 3.622v3.01h3.878c2.269-2.09 3.578-5.168 3.578-8.822Z"
      />
      <Path
        fill="#34A853"
        d="M12 24c3.24 0 5.956-1.075 7.941-2.905l-3.878-3.01c-1.075.72-2.45 1.146-4.063 1.146-3.126 0-5.77-2.112-6.716-4.947H1.28v3.11A11.998 11.998 0 0 0 12 24Z"
      />
      <Path
        fill="#FBBC05"
        d="M5.284 14.284A7.2 7.2 0 0 1 4.909 12c0-.793.136-1.564.375-2.284v-3.11H1.28A11.998 11.998 0 0 0 0 12c0 1.937.464 3.769 1.28 5.394l4.004-3.11Z"
      />
      <Path
        fill="#EA4335"
        d="M12 4.773c1.762 0 3.344.606 4.588 1.795l3.442-3.442C17.951 1.19 15.236 0 12 0 7.31 0 3.26 2.69 1.28 6.606l4.004 3.11C6.23 6.882 8.874 4.773 12 4.773Z"
      />
    </Svg>
  );
}
