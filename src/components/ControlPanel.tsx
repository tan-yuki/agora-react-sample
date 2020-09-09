import React from "react";
import { ChannelName } from "../model/ChannelName";
import { AppId } from "../model/AppId";
import { useScreenShare } from "../hooks/useScreenShare";

interface ControlPanelProps {
  appId: AppId;
  channelName: ChannelName;
}

export function ControlPanel(props: ControlPanelProps) {
  const { appId, channelName } = props;
  const [screenShareState, startScreenSharing] = useScreenShare(
    appId,
    channelName
  );

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
