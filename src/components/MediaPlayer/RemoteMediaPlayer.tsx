import React from "react";
import { IRemoteAudioTrack, IRemoteVideoTrack } from "agora-rtc-sdk-ng";
import { MediaPlayer } from "./MediaPlayer";

export interface RemoteMediaPlayerProps {
  audioTrack: IRemoteAudioTrack | undefined;
  videoTrack: IRemoteVideoTrack | undefined;
}

/**
 * リモートユーザーの画像または音声ストリームを流す。
 * このComponentはremoteユーザーのclientRoleがhostである前提で呼び出す。
 *
 * AgoraSDKが提供しているリモートユーザーを表す型定義には、
 * clientRoleを判断するプロパティが存在しないので、
 * 音声トラックまたはビデオトラックが存在するかどうかで判断する。
 * どちらか一方でも存在するのであれば、このComponentを呼び出せる。
 *
 * @param props
 */
export function RemoteMediaPlayer(props: RemoteMediaPlayerProps) {
  const { audioTrack, videoTrack } = props;

  return (
    <MediaPlayer
      clientRole="host" // audioやvideoのストリームが来ている前提で、hostとして扱う
      audioTrack={audioTrack}
      videoTrack={videoTrack}
      offAudio={false}
    />
  );
}
