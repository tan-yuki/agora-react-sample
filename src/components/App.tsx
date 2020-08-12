import React, { useEffect, useState } from "react";
import { createAgoraClient } from "../services/createClient";
import { APP_ID } from "../config";
import { useMicrophoneAndCameraTracks } from "../hooks/useMicrophoneAndCameraTracks";
import { ILocalAudioTrack, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { MediaPlayer } from "./MediaPlayer";

const channelName = "test-channel";

export function App() {
  const client = createAgoraClient("host");
  const [localAudioTrack, localVideoTrack] = useMicrophoneAndCameraTracks();

  const [alreadyJoined, setJoinState] = useState(false);

  useEffect(() => {
    async function join(
      audioTrack: ILocalAudioTrack,
      videoTrack: ILocalVideoTrack
    ) {
      // TODO: tokenを指定
      await client.join(APP_ID, channelName, null);
      await client.publish([audioTrack, videoTrack]);
      setJoinState(true);
    }

    if (!alreadyJoined && localAudioTrack && localVideoTrack) {
      join(localAudioTrack, localVideoTrack).catch((e) => {
        // TODO: error handling
        console.log(e);
      });
    }
  }, [client, alreadyJoined, localAudioTrack, localVideoTrack]);

  if (!localAudioTrack || !localVideoTrack) {
    return <p>Loading...</p>;
  }

  return (
    <div className="App">
      <MediaPlayer audioTrack={localAudioTrack} videoTrack={localVideoTrack} />
    </div>
  );
}
