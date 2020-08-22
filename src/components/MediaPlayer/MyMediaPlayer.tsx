import React from "react";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  ClientRole,
} from "agora-rtc-sdk-ng";
import { MediaPlayer } from "./MediaPlayer";

export interface MyMediaPlayerProps {
  clientRole: ClientRole;
  audioTrack: ILocalAudioTrack | undefined;
  videoTrack: ILocalVideoTrack | undefined;
}

export function MyMediaPlayer(props: MyMediaPlayerProps) {
  const { audioTrack, videoTrack, clientRole } = props;

  return (
    <MediaPlayer
      clientRole={clientRole}
      audioTrack={audioTrack}
      videoTrack={videoTrack}
      trackType="local"
    />
  );
}
