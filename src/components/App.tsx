import React, { useState } from "react";
import { createAgoraClient } from "../services/createClient";
import { LiveScreen } from "./LiveScreen";
import { ClientRole, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { useRemoteUsers } from "../hooks/useRemoteUsers";
import { InitialSettingForm } from "./InitialSettingForm";

const client = createAgoraClient();

export function App() {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [appId, setAppId] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("");
  const [clientRole, setClientRole] = useState<ClientRole>("host");
  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);
  const [alreadyJoined, setJoinState] = useState(false);

  const userIdList = [client.uid]
    .concat(
      remoteUsers.map((user: IAgoraRTCRemoteUser) => {
        return user.uid;
      })
    )
    .filter((_) => _);

  const UserListComponent =
    alreadyJoined && client.uid ? (
      <div>
        <p>User list</p>
        <ul>
          {userIdList.map((uid) => (
            <li key={uid}>{uid}</li>
          ))}
        </ul>
      </div>
    ) : null;

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
      <div>{UserListComponent}</div>
      <div>{LiveScreenComponent}</div>
    </div>
  );
}
