import { RecordingId } from "./RecordingId";
import { ResourceId } from "./ResourceId";

type RecordingState =
  | "none" // 停止中
  | "loading" // 録画開始までのローディング
  | "recording"; // 録画中

function assertRecordingStatus(
  currentRecording: Recording,
  expectState: RecordingState,
  msg?: string
): asserts currentRecording {
  if (currentRecording.state !== expectState) {
    throw new Error(msg ?? `Unexpected recording status: ${expectState}`);
  }
}

export interface Recording {
  state: RecordingState;
}

export interface RecordingAfterStarting extends Recording {
  recordingId: RecordingId;
  resourceId: ResourceId;
}

export function initializeRecording(): Recording {
  return {
    state: "none",
  };
}

export function loadingRecording(currentRecording: Recording): Recording {
  assertRecordingStatus(currentRecording, "none");

  return {
    state: "loading",
  };
}

export function startRecording(
  currentRecording: Recording,
  recordingId: RecordingId,
  resourceId: ResourceId
): RecordingAfterStarting {
  assertRecordingStatus(currentRecording, "loading");

  return {
    recordingId,
    resourceId,
    state: "recording",
  };
}

export function stopRecording(currentRecording: Recording): Recording {
  assertRecordingStatus(currentRecording, "recording");

  return initializeRecording();
}
