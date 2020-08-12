import React, { useRef, useEffect } from "react";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";

export interface MediaPlayerProps {
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack;
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack;
}

export function MediaPlayer(props: MediaPlayerProps) {
  const { audioTrack, videoTrack } = props;

  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    videoTrack.play(container.current);

    return () => {
      videoTrack.stop();
    };
  }, [videoTrack]);

  useEffect(() => {
    if (!container.current) {
      return;
    }

    audioTrack.play();

    return () => {
      audioTrack.stop();
    };
  }, [audioTrack]);

  return (
    <div
      ref={container}
      className="video-player"
      style={{ width: "320px", height: "240px" }}
    ></div>
  );
}
