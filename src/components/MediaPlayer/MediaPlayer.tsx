import React, { useRef, useEffect } from "react";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  ClientRole,
} from "agora-rtc-sdk-ng";

export interface MediaPlayerProps {
  offAudio: boolean;
  clientRole: ClientRole;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
}

export function MediaPlayer(props: MediaPlayerProps) {
  const { offAudio, audioTrack, videoTrack, clientRole } = props;

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
    if (offAudio) {
      return;
    }

    if (!container.current) {
      return;
    }

    audioTrack?.play();

    return () => {
      audioTrack?.stop();
    };
  }, [audioTrack, offAudio]);

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
