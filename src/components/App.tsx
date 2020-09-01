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
          />
        ) : null}
      </div>
    </div>
  );
}
