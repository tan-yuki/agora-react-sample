import React, { useEffect, useState } from "react";
import { useMicrophoneAndCameraTracks } from "../hooks/useMicrophoneAndCameraTracks";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCRemoteUser,
  IAgoraRTCClient,
  ILocalTrack,
} from "agora-rtc-sdk-ng";
import { MediaPlayer } from "./MediaPlayer";
import { useRemoteUsers } from "../hooks/useRemoteUsers";
interface LiveScreenProps {
  client: IAgoraRTCClient;
  channelName: string;
  appId: string;
}

export function LiveScreen(props: LiveScreenProps) {
  const { client, channelName, appId } = props;
  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);
  const [localAudioTrack, localVideoTrack] = useMicrophoneAndCameraTracks();
  const [alreadyJoined, setJoinState] = useState(false);

  useEffect(() => {
    async function join(
      audioTrack: ILocalAudioTrack,
      videoTrack: ILocalVideoTrack
    ) {
      await client.join(
        appId,
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
    appId,
    channelName,
    alreadyJoined,
    localAudioTrack,
    localVideoTrack,
    setRemoteUsers,
  ]);

  // Clean up effect
  useEffect(() => {
    return () => {
      const tracks: ILocalTrack[] = [];
      localAudioTrack && tracks.push(localAudioTrack);
      localVideoTrack && tracks.push(localVideoTrack);
      client.unpublish(tracks).then(() => client.leave());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
