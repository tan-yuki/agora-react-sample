import React, { useState, useEffect } from "react";
import { UserList } from "./UserList";
import { ControlPanel } from "./ControlPanel";
import { LiveScreen } from "./LiveScreen";
import {
  IAgoraRTCClient,
  ILocalVideoTrack,
  ILocalAudioTrack,
  ILocalTrack,
} from "agora-rtc-sdk-ng";
import { useRemoteUsers } from "../hooks/useRemoteUsers";
import { InitialSettingValue } from "../model/InitialSettingValue";
import { useMicrophoneAndCameraTracks } from "../hooks/useMicrophoneAndCameraTracks";

interface MainContentProps {
  initialSettingValue: InitialSettingValue;
  client: IAgoraRTCClient;
}

export function MainContent(props: MainContentProps) {
  const { initialSettingValue, client } = props;
  const { appId, channelName, clientRole } = initialSettingValue;

  const [alreadyJoined, setJoinState] = useState(false);
  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);
  const [screenShareVideoTrack, setScreenShareVideoTrack] = useState<
    ILocalVideoTrack | undefined
  >(undefined);
  const [localAudioTrack, localVideoTrack] = useMicrophoneAndCameraTracks();

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

    if (localAudioTrack && localVideoTrack) {
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

  if (!alreadyJoined) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <UserList myUid={client.uid} remoteUsers={remoteUsers} />
      <ControlPanel
        appId={appId}
        channelName={channelName}
        isStartedScreenSharing={!!screenShareVideoTrack}
        setScreenShareVideoTrack={setScreenShareVideoTrack}
      />
      <LiveScreen clientRole={clientRole} remoteUsers={remoteUsers} />
    </div>
  );
}
