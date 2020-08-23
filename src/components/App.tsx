import React, { useState } from "react";
import { createAgoraClient } from "../services/createClient";
import { LiveScreen } from "./LiveScreen";
import { ClientRole } from "agora-rtc-sdk-ng";
import { useRemoteUsers } from "../hooks/useRemoteUsers";
import { InitialSettingForm } from "./InitialSettingForm";
import { UserList } from "./UserList";

const client = createAgoraClient();

export function App() {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [appId, setAppId] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("");
  const [clientRole, setClientRole] = useState<ClientRole>("host");
  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);
  const [alreadyJoined, setJoinState] = useState(false);

  const LiveScreenComponent = isStarted ? (
    <LiveScreen
      client={client}
      channelName={channelName}
      appId={appId}
      clientRole={clientRole}
      remoteUsers={remoteUsers}
      setRemoteUsers={setRemoteUsers}
      alreadyJoined={alreadyJoined}
      setJoinState={setJoinState}
    />
  ) : null;

  return (
    <div>
      <div>
        <InitialSettingForm
          isStarted={isStarted}
          setIsStarted={setIsStarted}
          appId={appId}
          setAppId={setAppId}
          channelName={channelName}
          setChannelName={setChannelName}
          clientRole={clientRole}
          setClientRole={setClientRole}
        />
      </div>
      <div>
        <UserList
          alreadyJoined={alreadyJoined}
          myUid={client.uid as string | undefined}
          remoteUsers={remoteUsers}
        />
      </div>
      <div>{LiveScreenComponent}</div>
    </div>
  );
}
