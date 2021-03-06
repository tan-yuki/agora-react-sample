import { useEffect, useState } from "react";
import {
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCClient,
  ClientRole,
  ILocalTrack,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
import { ChannelName } from "../model/ChannelName";
import { AppId } from "../model/AppId";
import { useRemoteUsers } from "./useRemoteUsers";
import { useMicrophoneAndCameraTracks } from "./useMicrophoneAndCameraTracks";
import { cleanupAgoraClient } from "../services/cleanupAgoraClient";
import { getTokenApi } from "../services/api/getTokenApi";
import { createDummyUID } from "../services/createDummyUID";
import { Token } from "../model/Token";

export function useAgoraClient(
  client: IAgoraRTCClient,
  appId: AppId,
  channelName: ChannelName,
  clientRole: ClientRole
): [boolean, IAgoraRTCRemoteUser[], Token | undefined] {
  const [localAudioTrack, localVideoTrack] = useMicrophoneAndCameraTracks();
  const [alreadyJoined, setJoinState] = useState(false);
  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);
  const [token, setToken] = useState<Token | undefined>();

  useEffect(() => {
    async function join(
      audioTrack: ILocalAudioTrack,
      videoTrack: ILocalVideoTrack
    ) {
      client.setClientRole(clientRole);

      const uid = createDummyUID();
      const token = await getTokenApi(channelName, uid);
      await client.join(appId, channelName, token, uid);

      // 音声や映像ストリームをpublishするのは
      // hostのみなので、clientRoleがhostのときのみpublishする
      if (clientRole === "host") {
        await client.publish([audioTrack, videoTrack]);
      }

      // joinしたあとにsdk側でclientにRemoteUsersがセットされるため
      // このタイミングで改めてremoteUsersの状態を更新する
      setRemoteUsers(client.remoteUsers);
      setJoinState(true);
      setToken(token);
    }

    if (localAudioTrack && localVideoTrack) {
      join(localAudioTrack, localVideoTrack).catch((e) => {
        // TODO: error handling
        console.log(e);
      });
    }
  }, [
    client,
    clientRole,
    appId,
    channelName,
    localAudioTrack,
    localVideoTrack,
    setRemoteUsers,
    setJoinState,
  ]);

  // Clean up effect
  useEffect(() => {
    return () => {
      const tracks: ILocalTrack[] = [];
      localAudioTrack && tracks.push(localAudioTrack);
      localVideoTrack && tracks.push(localVideoTrack);
      cleanupAgoraClient(client, tracks).finally(() => setJoinState(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [alreadyJoined, remoteUsers, token];
}
