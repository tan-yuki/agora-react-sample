import React, { useState, ChangeEvent, MouseEvent, useCallback } from "react";
import { createAgoraClient } from "../services/createClient";
import { LiveScreen } from "./LiveScreen";
import { ClientRole, IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { useRemoteUsers } from "../hooks/useRemoteUsers";

const client = createAgoraClient();

export function App() {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [appId, setAppId] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("");
  const [clientRole, setClientRole] = useState<ClientRole>("host");
  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);
  const [alreadyJoined, setJoinState] = useState(false);

  const onChangeAppId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAppId(e.target.value);
  }, []);

  const onChangeChannelName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setChannelName(e.target.value);
    },
    []
  );

  const onChangeRole = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setClientRole(e.target.value === "host" ? "host" : "audience");
  }, []);

  const startLive = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsStarted(true);
  }, []);

  const closeLive = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsStarted(false);
  }, []);

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
        <form>
          <div>
            <label>App Id: </label>
            <input
              type="text"
              value={appId}
              onChange={onChangeAppId}
              disabled={isStarted}
            />
            <label>Channel Name: </label>
            <input
              type="text"
              value={channelName}
              onChange={onChangeChannelName}
              disabled={isStarted}
            />
          </div>
          <div>
            <span>Client Role: </span>
            <label>
              <input
                type="radio"
                name="role"
                value="host"
                checked={clientRole === "host"}
                onChange={onChangeRole}
                disabled={isStarted}
              />
              Host
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="audience"
                checked={clientRole === "audience"}
                onChange={onChangeRole}
                disabled={isStarted}
              />
              Audience
            </label>
          </div>
          {isStarted ? (
            <button onClick={closeLive}>Close</button>
          ) : (
            <button onClick={startLive}>Open</button>
          )}
        </form>
      </div>
      <div>{UserListComponent}</div>
      <div>{LiveScreenComponent}</div>
    </div>
  );
}
