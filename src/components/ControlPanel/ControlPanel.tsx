import React from "react";
import { ChannelName } from "../../model/ChannelName";
import { AppId } from "../../model/AppId";
import { RecordingButton } from "./RecordingButton";
import { UID } from "agora-rtc-sdk-ng";
import { ScreenShareButton } from "./ScreenShareButton";

interface ControlPanelProps {
  appId: AppId;
  myUid: UID | undefined;
  channelName: ChannelName;
}

export function ControlPanel(props: ControlPanelProps) {
  const { appId, myUid, channelName } = props;
  return (
    <div>
      <p>Control Panel</p>
      <ul>
        <li>
          <ScreenShareButton appId={appId} channelName={channelName} />
        </li>
        <li>
          <RecordingButton userId={myUid} channelName={channelName} />
        </li>
      </ul>
    </div>
  );
}
