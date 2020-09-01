import React, { useCallback } from "react";
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

export function ControlPanel(props: ControlPanelProps) {
  const {
    appId,
    channelName,
    isStartedScreenSharing,
    setScreenShareVideoTrack,
  } = props;

  const startScreenSharing = useCallback(() => {
    async function publishScreenShare() {
      // 画面共有用のAgoraClient.
      // AgoraClientは2つのVideo Streamを同時に2つ以上publishできないため、
      // 画面共有をするときはそれ専用のAgoraClientを生成する。
      const client = createAgoraClient();
      client.setClientRole("host");

      // join this client
      await client.join(appId, channelName, null);
      const screenTrack = await AgoraRTC.createScreenVideoTrack(
        {
          // This option is valid only Firefox.
          // see: https://agoraio-community.github.io/AgoraWebSDK-NG/api/en/interfaces/screenvideotrackinitconfig.html#screensourcetype
          screenSourceType: "window",
        },
        "disable"
      );
      client.publish(screenTrack);
      setScreenShareVideoTrack(screenTrack);
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
          {isStartedScreenSharing ? <span>Now Sharing...</span> : null}
        </li>
      </ul>
    </div>
  );
}
