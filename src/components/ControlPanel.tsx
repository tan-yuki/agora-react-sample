import React, { useCallback, useState } from "react";
import AgoraRTC, { ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { createAgoraClient } from "../services/createClient";
import { ChannelName } from "../model/ChannelName";
import { AppId } from "../model/AppId";

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

      // 画面共有用のAgoraClient.
      // AgoraClientは2つのVideo Streamを同時に2つ以上publishできないため、
      // 画面共有をするときはそれ専用のAgoraClientを生成する。
      const client = createAgoraClient();
      client.setClientRole("host");

      await client.join(appId, channelName, null);
      const screenTrack = await AgoraRTC.createScreenVideoTrack(
        {
          // This option is valid only Firefox.
          // see: https://agoraio-community.github.io/AgoraWebSDK-NG/api/en/interfaces/screenvideotrackinitconfig.html#screensourcetype
          screenSourceType: "window",
        },
        "disable"
      );
      await client.publish(screenTrack);
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
