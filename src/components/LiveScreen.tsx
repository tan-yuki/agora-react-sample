import React from "react";
import { useMicrophoneAndCameraTracks } from "../hooks/useMicrophoneAndCameraTracks";
import { IAgoraRTCRemoteUser, ClientRole } from "agora-rtc-sdk-ng";
import { MyMediaPlayer } from "./MediaPlayer/MyMediaPlayer";
import { RemoteMediaPlayer } from "./MediaPlayer/RemoteMediaPlayer";
import { isScreenShareUID } from "../model/ScreenShareUID";
import { ScreenSharePlayer } from "./MediaPlayer/ScreenSharePlayer";

interface LiveScreenProps {
  clientRole: ClientRole;
  remoteUsers: IAgoraRTCRemoteUser[];
}

export function LiveScreen(props: LiveScreenProps) {
  const { clientRole, remoteUsers } = props;
  const [localAudioTrack, localVideoTrack] = useMicrophoneAndCameraTracks();

  if (!localAudioTrack || !localVideoTrack) {
    return null;
  }

  const [screenShareUser, remoteUsersExceptScreenShare] = remoteUsers.reduce(
    (acc, user) => {
      if (isScreenShareUID(user.uid)) {
        return [user, acc[1]];
      }
      return [acc[0], [...acc[1], user]];
    },
    [undefined as IAgoraRTCRemoteUser | undefined, [] as IAgoraRTCRemoteUser[]]
  );

  const remoteMediaPlayers = remoteUsersExceptScreenShare
    .filter((user: IAgoraRTCRemoteUser) => {
      return user.audioTrack || user.videoTrack;
    })
    .map((user: IAgoraRTCRemoteUser) => {
      return (
        <RemoteMediaPlayer
          key={`remote-${user.uid.toString()}`}
          audioTrack={user.audioTrack}
          videoTrack={user.videoTrack}
        />
      );
    });

  return (
    <div>
      {screenShareUser?.videoTrack ? (
        <ScreenSharePlayer videoTrack={screenShareUser.videoTrack} />
      ) : null}
      <MyMediaPlayer
        clientRole={clientRole}
        audioTrack={localAudioTrack}
        videoTrack={localVideoTrack}
      />
      {remoteMediaPlayers}
    </div>
  );
}
