import React, { useCallback, useState, useEffect } from "react";
import { ChannelName } from "../model/ChannelName";
import { AppId } from "../model/AppId";
import { createScreenShareClient } from "../services/createScreenShareClient";
import { IAgoraRTCClient, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { cleanupAgoraClient } from "../services/cleanupAgoraClient";

interface ControlPanelProps {
  appId: AppId;
  channelName: ChannelName;
}

type ScreenShareState = "none" | "loading" | "sharing";

export function ControlPanel(props: ControlPanelProps) {
  const { appId, channelName } = props;

  const [screenShareClientAndVideo, setScreenShareClientAndVideo] = useState<
    [IAgoraRTCClient, ILocalVideoTrack] | undefined
  >();
  const [screenShareState, setScreenShareState] = useState<ScreenShareState>(
    "none"
  );

  // クリーンアップ関数。
  // スクリーンシェアがあらゆる条件で停止されたときに呼ばれる関数。
  const cleanup = useCallback(() => {
    // スクリーンシェアの状態を初期値に。
    setScreenShareState("none");

    // clientの生成に成功している場合は、それらのクリーンアップ処理。
    if (!screenShareClientAndVideo) {
      return;
    }
    const [screenShareClient, videoTrack] = screenShareClientAndVideo;
    cleanupAgoraClient(screenShareClient, [videoTrack]);
  }, [screenShareClientAndVideo]);

  // 初期化処理用Effect
  useEffect(() => {
    if (!screenShareClientAndVideo) {
      return;
    }

    const [, localVideoTrack] = screenShareClientAndVideo;
    localVideoTrack.on("track-ended", cleanup);
    setScreenShareState("sharing");

    return () => {
      localVideoTrack.off("track-ended", cleanup);
      setScreenShareState("none");
    };
  }, [cleanup, screenShareClientAndVideo]);

  // claenup用Effect
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  // 画面共有開始の関数
  const startScreenSharing = useCallback(() => {
    async function publishScreenShare() {
      setScreenShareState("loading");
      createScreenShareClient(appId, channelName)
        .then(([client, localVideoTrack]) => {
          setScreenShareClientAndVideo([client, localVideoTrack]);
        })
        .catch((e) => {
          cleanup();
        });
    }

    publishScreenShare();
  }, [appId, channelName, cleanup]);

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
