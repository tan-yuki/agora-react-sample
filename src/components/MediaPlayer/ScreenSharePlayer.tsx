import React from "react";
import { IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { MediaPlayer } from "./MediaPlayer";

export interface ScreenSharePlayerProps {
  videoTrack: IRemoteVideoTrack;
}

export function ScreenSharePlayer(props: ScreenSharePlayerProps) {
  const { videoTrack } = props;

  return (
    <MediaPlayer
      clientRole="host"
      audioTrack={undefined}
      videoTrack={videoTrack}
      offAudio={true}
    />
  );
}
