import AgoraRTC, { IAgoraRTCClient, ClientRole } from "agora-rtc-sdk-ng";

export function createAgoraClient(role: ClientRole): IAgoraRTCClient {
  const client = AgoraRTC.createClient({
    mode: "live",
    codec: "vp8",
  });

  client.setClientRole(role);

  return client;
}
