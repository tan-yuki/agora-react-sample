import { UID } from "agora-rtc-sdk-ng";
import { ChannelName } from "../../model/ChannelName";
import { RecordingId } from "../../model/RecordingId";
import { ResourceId } from "../../model/ResourceId";
import { callPostApi } from "./callApi";

interface PostStopRecordingRequestParams {
  resourceId: string;
  sid: string;
  channelName: string;
  userId: string;
}

interface RawPostStopRecordingResponse {
  files: { fileName: string }[];
}

export interface FileResponse {
  fileName: string;
}

export interface PostStopRecordingResponse {
  files: FileResponse[];
}

export async function postStopRecordingApi(
  resourceId: ResourceId,
  recordingId: RecordingId,
  channelName: ChannelName,
  userId: UID
): Promise<PostStopRecordingResponse> {
  const { files } = await callPostApi<
    PostStopRecordingRequestParams,
    RawPostStopRecordingResponse
  >("/recording/stop", {
    resourceId,
    sid: recordingId,
    channelName,
    userId: userId.toString(),
  });

  return { files };
}
