import React, { useState } from "react";
import { UserList } from "./UserList";
import { ControlPanel } from "./ControlPanel";
import { LiveScreen } from "./LiveScreen";
import {
  IAgoraRTCClient,
  ClientRole,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { useRemoteUsers } from "../hooks/useRemoteUsers";
import { AppId } from "../model/AppId";
import { ChannelName } from "../model/ChannelName";

interface MainContentProps {
  appId: AppId | undefined;
  channelName: ChannelName | undefined;
  client: IAgoraRTCClient;
  clientRole: ClientRole | undefined;
  alreadyJoined: boolean;
  setJoinState: (state: boolean) => void;
}

export function MainContent(props: MainContentProps) {
  const {
    appId,
    channelName,
    client,
    clientRole,
    alreadyJoined,
    setJoinState,
  } = props;

  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);
  const [screenShareVideoTrack, setScreenShareVideoTrack] = useState<
    ILocalVideoTrack | undefined
  >(undefined);
  const [screenShareUid, setScreenShareUid] = useState<string | undefined>();

  return (
    <div>
      <UserList
        alreadyJoined={alreadyJoined}
        myUid={client.uid?.toString()}
        remoteUsers={remoteUsers}
      />
      <ControlPanel
        appId={appId}
        channelName={channelName}
        isStartedScreenSharing={!!screenShareVideoTrack}
        setScreenShareVideoTrack={setScreenShareVideoTrack}
        setScreenShareUid={setScreenShareUid}
      />
      <LiveScreen
        client={client}
        appId={appId}
        channelName={channelName}
        clientRole={clientRole}
        remoteUsers={remoteUsers}
        setRemoteUsers={setRemoteUsers}
        alreadyJoined={alreadyJoined}
        setJoinState={setJoinState}
        screenShareUid={screenShareUid}
      />
    </div>
  );
}
