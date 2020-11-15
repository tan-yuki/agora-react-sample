import { UID } from "agora-rtc-sdk-ng";
import { ChannelName } from "../../model/ChannelName";
import { RecordingId } from "../../model/RecordingId";
import { ResourceId } from "../../model/ResourceId";
import { Token } from "../../model/Token";
import { callPostApi } from "./callApi";

interface PostStartRecordingRequestParams {
  channelName: string;
  userId: string;
  token: string;
}

interface RawPostStartRecordingResponse {
  resourceId: string;
  sid: string;
}

export interface PostStartRecordingResponse {
  resourceId: ResourceId;
  recordingId: RecordingId;
}

export async function postStartRecordingApi(
  channelName: ChannelName,
  userId: UID,
  token: Token
): Promise<PostStartRecordingResponse> {
  const { resourceId, sid } = await callPostApi<
    PostStartRecordingRequestParams,
    RawPostStartRecordingResponse
  >("/recording/start", {
    channelName,
    userId: userId.toString(),
    token,
  });

  return {
    resourceId: resourceId as ResourceId,
    recordingId: sid as RecordingId,
  };
}
