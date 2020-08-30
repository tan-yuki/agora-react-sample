import React, { useEffect } from "react";
import { useMicrophoneAndCameraTracks } from "../hooks/useMicrophoneAndCameraTracks";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCRemoteUser,
  IAgoraRTCClient,
  ILocalTrack,
  ClientRole,
} from "agora-rtc-sdk-ng";
import { MyMediaPlayer } from "./MediaPlayer/MyMediaPlayer";
import { RemoteMediaPlayer } from "./MediaPlayer/RemoteMediaPlayer";
interface LiveScreenProps {
  client: IAgoraRTCClient;
  appId: string | undefined;
  channelName: string | undefined;
  clientRole: ClientRole | undefined;
  remoteUsers: IAgoraRTCRemoteUser[];
  alreadyJoined: boolean;
  screenShareUid: string | undefined;
  setJoinState: (state: boolean) => void;
  setRemoteUsers: (users: IAgoraRTCRemoteUser[]) => void;
}

export function LiveScreen(props: LiveScreenProps) {
  const {
    client,
    channelName,
    appId,
    clientRole,
    remoteUsers,
    setRemoteUsers,
    alreadyJoined,
    setJoinState,
  } = props;
  const [localAudioTrack, localVideoTrack] = useMicrophoneAndCameraTracks();

  useEffect(() => {
    async function join(
      audioTrack: ILocalAudioTrack,
      videoTrack: ILocalVideoTrack
    ) {
      if (!appId || !clientRole || !channelName) {
        return;
      }
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
    setJoinState,
  ]);

  // Clean up effect
  useEffect(() => {
    return () => {
      const tracks: ILocalTrack[] = [];
      localAudioTrack && tracks.push(localAudioTrack);
      localVideoTrack && tracks.push(localVideoTrack);

      client
        .unpublish(tracks)
        // clientRoleがaudienceのときはストリームをpublishしていないため
        // audienceのユーザーがunpublishをするとエラーになる。
        // そのため、unpublishでエラーがでてもかならずleaveが実行されるように
        // finallyとしている。
        .finally(() => client.leave())
        .finally(() => setJoinState(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!localAudioTrack || !localVideoTrack || !clientRole) {
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
