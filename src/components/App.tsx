import React, { useState } from "react";
import { createAgoraClient } from "../services/createClient";
import { InitialSettingForm } from "./InitialSettingForm";
import { MainContent } from "./MainContent";
import { InitialSettingValue } from "../model/InitialSettingValue";

const client = createAgoraClient();

export function App() {
  const [initialSettingValue, setInitialSettingValue] = useState<
    InitialSettingValue | undefined
  >();
  const [alreadyJoined, setJoinState] = useState(false);

  return (
    <div>
      <div>
        <InitialSettingForm
          isStarted={!!initialSettingValue}
          setInitialSettingValue={setInitialSettingValue}
        />
      </div>
      <div>
        {initialSettingValue ? (
          <MainContent
            appId={initialSettingValue.appId}
            channelName={initialSettingValue.channelName}
            client={client}
            clientRole={initialSettingValue.clientRole}
            alreadyJoined={alreadyJoined}
            setJoinState={setJoinState}
          />
        ) : null}
      </div>
    </div>
  );
}
