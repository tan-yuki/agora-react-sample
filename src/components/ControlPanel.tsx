import React, { useCallback, useState } from "react";
import { ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { ChannelName } from "../model/ChannelName";
import { AppId } from "../model/AppId";
import { createScreenShareClient } from "../services/createScreenShareClient";

interface ControlPanelProps {
  appId: AppId;
  channelName: ChannelName;
  isStartedScreenSharing: boolean;
  setScreenShareVideoTrack: (videoTrack: ILocalVideoTrack) => void;
}

type ScreenShareLoadingState = "none" | "loading";

export function ControlPanel(props: ControlPanelProps) {
  const {
    appId,
    channelName,
    isStartedScreenSharing,
    setScreenShareVideoTrack,
  } = props;

  const [screenShareLoadingState, setScreenShareLoadingState] = useState<
    ScreenShareLoadingState
  >("none");

  const startScreenSharing = useCallback(() => {
    async function publishScreenShare() {
      setScreenShareLoadingState("loading");
      const [, screenTrack] = await createScreenShareClient(appId, channelName);
      setScreenShareVideoTrack(screenTrack);
      setScreenShareLoadingState("none");
    }

    publishScreenShare();
  }, [appId, channelName, setScreenShareVideoTrack]);

  return (
    <div>
      <p>Control Panel</p>
      <ul>
        <li>
          <button
            onClick={startScreenSharing}
            disabled={isStartedScreenSharing}
          >
            Screen Share
          </button>
          {screenShareLoadingState === "loading" ? (
            <span>Now Sharing...</span>
          ) : null}
        </li>
      </ul>
    </div>
  );
}
