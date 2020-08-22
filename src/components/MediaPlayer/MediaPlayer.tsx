import React, { useRef, useEffect } from "react";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  ClientRole,
} from "agora-rtc-sdk-ng";
import { TrackType } from "../../model/TrackType";

export interface MediaPlayerProps {
  trackType: TrackType;
  clientRole: ClientRole;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
}

export function MediaPlayer(props: MediaPlayerProps) {
  const { trackType, audioTrack, videoTrack, clientRole } = props;

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    videoTrack?.play(container.current);

    return () => {
      videoTrack?.stop();
    };
  }, [videoTrack]);

  useEffect(() => {
    // 自分の音声ストリームは流さない。
    // 自分の音声ストリームを流してしまうと、自分の声が跳ね返って聞こえてしまい、
    // 非常に使い勝手が悪くなってしまうため。
    if (trackType === "local") {
      return;
    }

    if (!container.current) {
      return;
    }

    audioTrack?.play();

    return () => {
      audioTrack?.stop();
    };
  }, [audioTrack, trackType]);

  if (clientRole === "audience") {
    return null;
  }

  return (
    <div
      ref={container}
      className="video-player"
      style={{ width: "320px", height: "240px" }}
    ></div>
  );
}
