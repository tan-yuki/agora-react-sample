import React, { useState } from "react";
import { createAgoraClient } from "../services/createAgoraClient";
import { InitialSettingForm } from "./InitialSettingForm";
import { MainContent } from "./MainContent";
import { InitialSettingValue } from "../model/InitialSettingValue";
import { AppId } from "../model/AppId";

const client = createAgoraClient();

interface AppProps {
  appId: AppId;
}

export function App(props: AppProps) {
  const { appId } = props;
  const [initialSettingValue, setInitialSettingValue] = useState<
    InitialSettingValue | undefined
  >();

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
            initialSettingValue={initialSettingValue}
            client={client}
            appId={appId}
          />
        ) : null}
      </div>
    </div>
  );
}
