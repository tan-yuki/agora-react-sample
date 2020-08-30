import React, { useCallback } from "react";
import AgoraRTC, { ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { createAgoraClient } from "../services/createClient";

interface ControlPanelProps {
  appId: string | undefined;
  channelName: string | undefined;
  isStartedScreenSharing: boolean;
  setScreenShareVideoTrack: (videoTrack: ILocalVideoTrack) => void;
  setScreenShareUid: (uid: string) => void;
}

export function ControlPanel(props: ControlPanelProps) {
  const {
    appId,
    channelName,
    isStartedScreenSharing,
    setScreenShareVideoTrack,
    setScreenShareUid,
  } = props;

  const startScreenSharing = useCallback(() => {
    async function publishScreenShare() {
      if (!appId || !channelName) {
        return;
      }

      // 画面共有用のAgoraClient.
      // AgoraClientは2つのVideo Streamを同時に2つ以上publishできないため、
      // 画面共有をするときはそれ専用のAgoraClientを生成する。
      const client = createAgoraClient();
      client.setClientRole("host");

      // join this client
      const screenShareUid = await client.join(appId, channelName, null);
      const screenTrack = await AgoraRTC.createScreenVideoTrack(
        {
          // This option is valid only Firefox.
          // see: https://agoraio-community.github.io/AgoraWebSDK-NG/api/en/interfaces/screenvideotrackinitconfig.html#screensourcetype
          screenSourceType: "window",
        },
        "disable"
      );
      client.publish(screenTrack);
      setScreenShareUid(screenShareUid.toString());
      setScreenShareVideoTrack(screenTrack);
    }

    publishScreenShare();
  }, [appId, channelName, setScreenShareVideoTrack, setScreenShareUid]);

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
