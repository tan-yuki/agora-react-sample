import { IAgoraRTCClient, ILocalTrack } from "agora-rtc-sdk-ng";

export async function cleanupAgoraClient(
  client: IAgoraRTCClient,
  tracks: ILocalTrack[]
): Promise<void> {
  return (
    client
      .unpublish(tracks)
      // clientRoleがaudienceのときはストリームをpublishしていないため
      // audienceのユーザーがunpublishをするとエラーになる。
      // そのため、unpublishでエラーがでてもかならずleaveが実行されるように
      // finallyとしている。
      .finally(() => client.leave())
  );
}
