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
      // 自分の音声ストリームは流さない。
      // 自分の音声ストリームを流してしまうと、自分の声が跳ね返って聞こえてしまい、
      // 非常に使い勝手が悪くなってしまうため。
      offAudio={true}
    />
  );
}
