import React from "react";
import { UserList } from "./UserList";
import { ControlPanel } from "./ControlPanel";
import { LiveScreen } from "./LiveScreen";
import { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { InitialSettingValue } from "../model/InitialSettingValue";
import { useAgoraClient } from "../hooks/useAgoraClient";

interface MainContentProps {
  initialSettingValue: InitialSettingValue;
  client: IAgoraRTCClient;
}

export function MainContent(props: MainContentProps) {
  const { initialSettingValue, client } = props;
  const { appId, channelName, clientRole } = initialSettingValue;
  const [alreadyJoined, remoteUsers] = useAgoraClient(
    client,
    appId,
    channelName,
    clientRole
  );

  if (!alreadyJoined) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <UserList myUid={client.uid} remoteUsers={remoteUsers} />
      <ControlPanel appId={appId} channelName={channelName} />
      <LiveScreen clientRole={clientRole} remoteUsers={remoteUsers} />
    </div>
  );
}
