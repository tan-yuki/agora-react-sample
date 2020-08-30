import React, { useState, useCallback } from "react";
import { createAgoraClient } from "../services/createClient";
import { ClientRole } from "agora-rtc-sdk-ng";
import { InitialSettingForm } from "./InitialSettingForm";
import { MainContent } from "./MainContent";

const client = createAgoraClient();

export function App() {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [appId, setAppId] = useState<string | undefined>();
  const [channelName, setChannelName] = useState<string | undefined>();
  const [clientRole, setClientRole] = useState<ClientRole | undefined>();
  const [alreadyJoined, setJoinState] = useState(false);
  const startLiveCallback = useCallback(() => {
    setIsStarted(true);
  }, []);

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
      <div>
        {isStarted ? (
          <MainContent
            appId={appId}
            channelName={channelName}
            client={client}
            clientRole={clientRole}
            alreadyJoined={alreadyJoined}
            setJoinState={setJoinState}
          />
        ) : null}
      </div>
    </div>
  );
}
