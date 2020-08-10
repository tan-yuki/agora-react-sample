import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";

export function createAgoraClient(channelName: string): IAgoraRTCClient {
  const client = AgoraRTC.createClient({
    mode: "live",
    codec: "vp8",
  });
  return client;
}
