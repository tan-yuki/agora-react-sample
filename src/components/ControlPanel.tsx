import React, { useCallback, useState } from "react";
import { ChannelName } from "../model/ChannelName";
import { AppId } from "../model/AppId";
import { createScreenShareClient } from "../services/createScreenShareClient";

interface ControlPanelProps {
  appId: AppId;
  channelName: ChannelName;
}

type ScreenShareState = "none" | "loading" | "sharing";

export function ControlPanel(props: ControlPanelProps) {
  const { appId, channelName } = props;

  const [screenShareState, setScreenShareState] = useState<ScreenShareState>(
    "none"
  );

  const startScreenSharing = useCallback(() => {
    async function publishScreenShare() {
      setScreenShareState("loading");
      await createScreenShareClient(appId, channelName);
      setScreenShareState("sharing");
    }

    publishScreenShare();
  }, [appId, channelName]);

  return (
    <div>
      <p>Control Panel</p>
      <ul>
        <li>
          <button
            onClick={startScreenSharing}
            disabled={screenShareState !== "none"}
          >
            Screen Share
          </button>
          {screenShareState === "loading" ? <span>Now Sharing...</span> : null}
        </li>
      </ul>
    </div>
  );
}
