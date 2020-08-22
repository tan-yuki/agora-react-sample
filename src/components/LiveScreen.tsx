import React, { useEffect, useState } from "react";
import { useMicrophoneAndCameraTracks } from "../hooks/useMicrophoneAndCameraTracks";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCRemoteUser,
  IAgoraRTCClient,
  ILocalTrack,
  ClientRole,
} from "agora-rtc-sdk-ng";
import { useRemoteUsers } from "../hooks/useRemoteUsers";
import { MyMediaPlayer } from "./MediaPlayer/MyMediaPlayer";
import { RemoteMediaPlayer } from "./MediaPlayer/RemoteMediaPlayer";
interface LiveScreenProps {
  client: IAgoraRTCClient;
  channelName: string;
  appId: string;
  clientRole: ClientRole;
}

export function LiveScreen(props: LiveScreenProps) {
  const { client, channelName, appId, clientRole } = props;
  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);
  const [localAudioTrack, localVideoTrack] = useMicrophoneAndCameraTracks();
  const [alreadyJoined, setJoinState] = useState(false);

  useEffect(() => {
    async function join(
      audioTrack: ILocalAudioTrack,
      videoTrack: ILocalVideoTrack
    ) {
      client.setClientRole(clientRole);

      await client.join(
        appId,
        channelName,
        // TODO: tokenを指定
        null
      );

      // 音声や映像ストリームをpublishするのは
      // hostのみなので、clientRoleがhostのときのみpublishする
      if (clientRole === "host") {
        await client.publish([audioTrack, videoTrack]);
      }

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
    clientRole,
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

      // clientRoleがaudienceのときはストリームをpublishしていないため
      // audienceのユーザーがunpublishをするとエラーになる。
      // そのため、unpublishでエラーがでてもかならずleaveが実行されるように
      // finallyとしている。
      client.unpublish(tracks).finally(() => client.leave());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!localAudioTrack || !localVideoTrack) {
    return <p>Loading...</p>;
  }

  const remoteMediaPlayers = remoteUsers
    .filter((user: IAgoraRTCRemoteUser) => {
      return user.audioTrack || user.videoTrack;
    })
    .map((user: IAgoraRTCRemoteUser) => {
      return (
        <RemoteMediaPlayer
          key={`remote-${user.uid}`}
          audioTrack={user.audioTrack}
          videoTrack={user.videoTrack}
        />
      );
    });

  return (
    <div>
      <MyMediaPlayer
        clientRole={clientRole}
        audioTrack={localAudioTrack}
        videoTrack={localVideoTrack}
      />
      {remoteMediaPlayers}
    </div>
  );
}
