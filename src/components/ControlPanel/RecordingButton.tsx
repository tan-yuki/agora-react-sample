import React, { useCallback, useState } from "react";
import { ChannelName } from "../../model/ChannelName";
import { postStartRecordingApi } from "../../services/api/postStartRecordingApi";
import {
  initializeRecording,
  loadingRecording,
  Recording,
  RecordingAfterStarting,
  startRecording,
  stopRecording,
} from "../../model/Recording";
import { UID } from "agora-rtc-sdk-ng";
import { postStopRecordingApi } from "../../services/api/postStopRecordingApi";

interface RecordingButtonProps {
  userId: UID | undefined;
  channelName: ChannelName;
}

export function RecordingButton(props: RecordingButtonProps) {
  const { channelName, userId } = props;
  const [recording, setRecording] = useState<
    Recording | RecordingAfterStarting
  >(initializeRecording());

  const onClickStart = useCallback(() => {
    if (!userId) {
      return;
    }

    setRecording(loadingRecording(recording));
    postStartRecordingApi(channelName, userId).then((response) => {
      setRecording(
        startRecording(recording, response.recordingId, response.resourceId)
      );
    });
  }, [channelName, userId, recording]);

  const onClickStop = useCallback(() => {
    if (!userId) {
      return;
    }

    const recordingAfterStarting = recording as RecordingAfterStarting;
    if (
      !recordingAfterStarting.recordingId ||
      !recordingAfterStarting.resourceId
    ) {
      return;
    }

    postStopRecordingApi(
      recordingAfterStarting.resourceId,
      recordingAfterStarting.recordingId,
      channelName,
      userId
    ).then(() => {
      setRecording(stopRecording(recordingAfterStarting));
    });
  }, [channelName, userId, recording]);

  switch (recording.state) {
    case "none":
      return <button onClick={onClickStart}>Start Recording</button>;

    case "loading":
      return <span>Loading...</span>;

    case "recording":
      return <button onClick={onClickStop}>Stop Recording</button>;

    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = recording.state;
      return null;
  }
}
