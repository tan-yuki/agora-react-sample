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

export function useAgoraClient(
  client: IAgoraRTCClient,
  appId: AppId,
  channelName: ChannelName,
  clientRole: ClientRole
): [boolean, IAgoraRTCRemoteUser[]] {
  const [localAudioTrack, localVideoTrack] = useMicrophoneAndCameraTracks();
  const [alreadyJoined, setJoinState] = useState(false);
  const [remoteUsers, setRemoteUsers] = useRemoteUsers(client);

  useEffect(() => {
    async function join(
      audioTrack: ILocalAudioTrack,
      videoTrack: ILocalVideoTrack
    ) {
      client.setClientRole(clientRole);

      await client.join(
        appId,
        channelName,
        // TODO: tokenを指定
        null
      );

      // 音声や映像ストリームをpublishするのは
      // hostのみなので、clientRoleがhostのときのみpublishする
      if (clientRole === "host") {
        await client.publish([audioTrack, videoTrack]);
      }

      // joinしたあとにsdk側でclientにRemoteUsersがセットされるため
      // このタイミングで改めてremoteUsersの状態を更新する
      setRemoteUsers(client.remoteUsers);
      setJoinState(true);
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

      client
        .unpublish(tracks)
        // clientRoleがaudienceのときはストリームをpublishしていないため
        // audienceのユーザーがunpublishをするとエラーになる。
        // そのため、unpublishでエラーがでてもかならずleaveが実行されるように
        // finallyとしている。
        .finally(() => client.leave())
        .finally(() => setJoinState(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [alreadyJoined, remoteUsers];
}
