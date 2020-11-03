import { UID } from "agora-rtc-sdk-ng";
import { ChannelName } from "../../model/ChannelName";
import { RecordingId } from "../../model/RecordingId";
import { ResourceId } from "../../model/ResourceId";
import { callPostApi } from "./callApi";

interface PostStartRecordingRequestParams {
  channelName: string;
  userId: string;
}

interface PostStartRecordingResponse {
  resourceId: string;
  sid: string;
}

export async function postStartRecordingApi(
  channelName: ChannelName,
  userId: UID
): Promise<{
  resourceId: ResourceId;
  recordingId: RecordingId;
}> {
  const { resourceId, sid } = await callPostApi<
    PostStartRecordingRequestParams,
    PostStartRecordingResponse
  >("/recording/start", {
    channelName,
    userId: userId.toString(),
  });

  return {
    resourceId: resourceId as ResourceId,
    recordingId: sid as RecordingId,
  };
}
