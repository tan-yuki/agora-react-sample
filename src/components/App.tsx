import React, { useEffect, useState } from "react";
import { createAgoraClient } from "../services/createClient";
import { APP_ID } from "../config";
import { useMicrophoneAndCameraTracks } from "../hooks/useMicrophoneAndCameraTracks";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
import { MediaPlayer } from "./MediaPlayer";
import { useRemoteUsers } from "../hooks/useRemoteUsers";

const channelName = "test-channel";
const client = createAgoraClient("host");

export function App() {
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
  }, [alreadyJoined, localAudioTrack, localVideoTrack, setRemoteUsers]);

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
      <div className="App">
        <MediaPlayer
          key="local"
          audioTrack={localAudioTrack}
          videoTrack={localVideoTrack}
        />
      </div>
      {remoteMediaPlayers}
    </div>
  );
}
