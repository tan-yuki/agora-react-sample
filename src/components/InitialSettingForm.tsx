import React, { useCallback, ChangeEvent, MouseEvent, useState } from "react";
import { ClientRole } from "agora-rtc-sdk-ng";
import { InitialSettingValue } from "../model/InitialSettingValue";
import { ChannelName } from "../model/ChannelName";
import { AppId } from "../model/AppId";

export interface InitialSettingForm {
  isStarted: boolean;
  setInitialSettingValue: (v: InitialSettingValue) => void;
}

export function InitialSettingForm(props: InitialSettingForm) {
  const { isStarted, setInitialSettingValue } = props;

  const [draftAppId, setDraftAppId] = useState("");
  const [draftChannelName, setDraftChannelName] = useState("");
  const [draftRole, setDraftRole] = useState<ClientRole>("host");

  const onChangeAppId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDraftAppId(e.target.value);
  }, []);

  const onChangeChannelName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setDraftChannelName(e.target.value);
    },
    []
  );

  const onChangeRole = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDraftRole(e.target.value === "host" ? "host" : "audience");
  }, []);

  const startLive = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      setInitialSettingValue({
        appId: draftAppId as AppId,
        channelName: draftChannelName as ChannelName,
        clientRole: draftRole,
      });
    },
    [draftAppId, draftChannelName, draftRole, setInitialSettingValue]
  );

  return (
    <form>
      <div>
        <label>App Id: </label>
        <input
          type="text"
          value={draftAppId}
          onChange={onChangeAppId}
          disabled={isStarted}
        />
        <label>Channel Name: </label>
        <input
          type="text"
          value={draftChannelName}
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
            checked={draftRole === "host"}
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
            checked={draftRole === "audience"}
            onChange={onChangeRole}
            disabled={isStarted}
          />
          Audience
        </label>
      </div>
      <button onClick={startLive} disabled={isStarted}>
        Open
      </button>
    </form>
  );
}
