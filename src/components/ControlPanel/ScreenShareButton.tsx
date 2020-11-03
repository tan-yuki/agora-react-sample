import React from "react";
import { useScreenShare } from "../../hooks/useScreenShare";
import { AppId } from "../../model/AppId";
import { ChannelName } from "../../model/ChannelName";

interface ScreenShareButtonProps {
  appId: AppId;
  channelName: ChannelName;
}

export function ScreenShareButton(props: ScreenShareButtonProps) {
  const { appId, channelName } = props;
  const [screenShareState, startScreenSharing] = useScreenShare(
    appId,
    channelName
  );

  return (
    <>
      <button
        onClick={startScreenSharing}
        disabled={screenShareState !== "none"}
      >
        Screen Share
      </button>
      {screenShareState === "loading" ? <span>Now Sharing...</span> : null}
    </>
  );
}
