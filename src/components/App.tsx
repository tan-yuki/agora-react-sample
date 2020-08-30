import React, { useState, useCallback } from "react";
import { createAgoraClient } from "../services/createClient";
import { LiveScreen } from "./LiveScreen";
import { ClientRole, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useRemoteUsers } from "../hooks/useRemoteUsers";
import { InitialSettingForm } from "./InitialSettingForm";
import { UserList } from "./UserList";
import { ControlPanel } from "./ControlPanel";

const client = createAgoraClient();

export function App() {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [appId, setAppId] = useState<string | undefined>();
  const [channelName, setChannelName] = useState<string | undefined>();
  const [clientRole, setClientRole] = useState<ClientRole | undefined>();
  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);
  const [alreadyJoined, setJoinState] = useState(false);
  const [screenShareVideoTrack, setScreenShareVideoTrack] = useState<
    ILocalVideoTrack | undefined
  >(undefined);
  const [screenShareUid, setScreenShareUid] = useState<string | undefined>();

  const startLiveCallback = useCallback(() => {
    setIsStarted(true);
  }, []);

  const LiveComponent = isStarted ? (
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
  ) : null;

  return (
    <div>
      <div>
        <InitialSettingForm
          isStarted={isStarted}
          startLiveCallback={startLiveCallback}
          setAppId={setAppId}
          setChannelName={setChannelName}
          setClientRole={setClientRole}
        />
      </div>
      <div>{LiveComponent}</div>
    </div>
  );
}
