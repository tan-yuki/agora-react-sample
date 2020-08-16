import React, { useEffect, useState } from "react";
import { APP_ID } from "../config";
import { useMicrophoneAndCameraTracks } from "../hooks/useMicrophoneAndCameraTracks";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCRemoteUser,
  IAgoraRTCClient,
} from "agora-rtc-sdk-ng";
import { MediaPlayer } from "./MediaPlayer";
import { useRemoteUsers } from "../hooks/useRemoteUsers";

interface LiveScreenProps {
  client: IAgoraRTCClient;
  channelName: string;
}

export function LiveScreen(props: LiveScreenProps) {
  const { client, channelName } = props;
  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);
  const [localAudioTrack, localVideoTrack] = useMicrophoneAndCameraTracks();
  const [alreadyJoined, setJoinState] = useState(false);

  useEffect(() => {
    async function join(
      audioTrack: ILocalAudioTrack,
      videoTrack: ILocalVideoTrack
    ) {
      await client.join(
        APP_ID,
        channelName,
        // TODO: tokenを指定
        null
      );
      await client.publish([audioTrack, videoTrack]);

      // joinしたあとにsdk側でclientにRemoteUsersがセットされるため
      // このタイミングで改めてremoteUsersの状態を更新する
      setRemoteUsers(client.remoteUsers);
      setJoinState(true);
    }

    if (!alreadyJoined && localAudioTrack && localVideoTrack) {
      join(localAudioTrack, localVideoTrack).catch((e) => {
        // TODO: error handling
        console.log(e);
      });
    }
  }, [
    client,
    channelName,
    alreadyJoined,
    localAudioTrack,
    localVideoTrack,
    setRemoteUsers,
  ]);

  if (!localAudioTrack || !localVideoTrack) {
    return <p>Loading...</p>;
  }

  const remoteMediaPlayers = remoteUsers.map((user: IAgoraRTCRemoteUser) => {
    return (
      <MediaPlayer
        key={`remote-${user.uid}`}
        audioTrack={user.audioTrack}
        videoTrack={user.videoTrack}
      />
    );
  });

  return (
    <div>
      <MediaPlayer
        key="local"
        audioTrack={localAudioTrack}
        videoTrack={localVideoTrack}
      />
      {remoteMediaPlayers}
    </div>
  );
}
