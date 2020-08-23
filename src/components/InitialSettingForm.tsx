import React, { useCallback, ChangeEvent, MouseEvent } from "react";
import { ClientRole } from "agora-rtc-sdk-ng";

export interface InitialSettingForm {
  isStarted: boolean;
  setIsStarted: (isStarted: boolean) => void;
  appId: string;
  setAppId: (appId: string) => void;
  channelName: string;
  setChannelName: (channelName: string) => void;
  clientRole: ClientRole;
  setClientRole: (clientRole: ClientRole) => void;
}

export function InitialSettingForm(props: InitialSettingForm) {
  const {
    isStarted,
    setIsStarted,
    appId,
    setAppId,
    channelName,
    setChannelName,
    clientRole,
    setClientRole,
  } = props;

  const onChangeAppId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAppId(e.target.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeChannelName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setChannelName(e.target.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onChangeRole = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setClientRole(e.target.value === "host" ? "host" : "audience");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLive = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsStarted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
      <button onClick={startLive} disabled={isStarted}>
        Open
      </button>
    </form>
  );
}
