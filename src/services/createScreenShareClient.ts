import { createAgoraClient } from "./createClient";
import { ChannelName } from "../model/ChannelName";
import { AppId } from "../model/AppId";
import AgoraRTC, { IAgoraRTCClient, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { createRawScreenShareUID } from "../model/ScreenShareUID";

export async function createScreenShareClient(
  appId: AppId,
  channelName: ChannelName
): Promise<[IAgoraRTCClient, ILocalVideoTrack]> {
  // 画面共有用のAgoraClient.
  // AgoraClientは2つのVideo Streamを同時に2つ以上publishできないため、
  // 画面共有をするときはそれ専用のAgoraClientを生成する。
  const client = createAgoraClient();
  client.setClientRole("host");

  await client.join(appId, channelName, null, createRawScreenShareUID());
  const screenTrack = await AgoraRTC.createScreenVideoTrack(
    {
      // This option is valid only Firefox.
      // see: https://agoraio-community.github.io/AgoraWebSDK-NG/api/en/interfaces/screenvideotrackinitconfig.html#screensourcetype
      screenSourceType: "window",
    },
    "disable"
  );
  await client.publish(screenTrack);

  return [client, screenTrack];
}
