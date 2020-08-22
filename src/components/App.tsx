import React, { useState, ChangeEvent, MouseEvent } from "react";
import { createAgoraClient } from "../services/createClient";
import { LiveScreen } from "./LiveScreen";

const client = createAgoraClient("host");

export function App() {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [appId, setAppId] = useState<string>("");
  const [channelName, setChannelName] = useState<string>("");

  function onChangeAppId(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setAppId(e.target.value);
  }

  function onChangeChannelName(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setChannelName(e.target.value);
  }

  function startLive(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsStarted(true);
  }

  function closeLive(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsStarted(false);
  }

  const LiveScreenComponent = isStarted ? (
    <LiveScreen client={client} channelName={channelName} appId={appId} />
  ) : null;

  return (
    <div>
      <div>
        <form>
          <label>App Id</label>
          <input
            type="text"
            value={appId}
            onChange={onChangeAppId}
            disabled={isStarted}
          />
          <label>Channel Name</label>
          <input
            type="text"
            value={channelName}
            onChange={onChangeChannelName}
            disabled={isStarted}
          />
          {isStarted ? (
            <button onClick={closeLive}>Close</button>
          ) : (
            <button onClick={startLive}>Open</button>
          )}
        </form>
      </div>

      <div>{LiveScreenComponent}</div>
    </div>
  );
}
