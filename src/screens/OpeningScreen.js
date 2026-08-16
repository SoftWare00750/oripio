import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { colors } from "../theme/colors";

const openingVideo = require("../../assets/videos/opening.mp4");

// Plays the branded opening/loading clip once, full-screen, with no
// controls, then hands off to the rest of the app (the onboarding flow)
// via onFinish. A safety timeout guarantees the app never gets stuck on
// this screen even if playback fails to fire its "end" event for some
// reason (e.g. a slow device or an unexpected codec issue).
export default function OpeningScreen({ onFinish }) {
  const finishedRef = useRef(false);

  const player = useVideoPlayer(openingVideo, (p) => {
    p.loop = false;
    p.muted = true;
    p.play();
  });

  const finish = React.useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish?.();
  }, [onFinish]);

  useEffect(() => {
    const endSub = player.addListener("playToEnd", finish);
    const statusSub = player.addListener("statusChange", ({ status, error }) => {
      if (status === "error") {
        finish();
      }
    });

    // Safety net: the source clip is ~5-8s, so if playback hasn't
    // finished (or errored) within 10s, move on anyway.
    const timeout = setTimeout(finish, 10000);

    return () => {
      endSub.remove();
      statusSub.remove();
      clearTimeout(timeout);
    };
  }, [player, finish]);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  video: {
    flex: 1,
  },
});
