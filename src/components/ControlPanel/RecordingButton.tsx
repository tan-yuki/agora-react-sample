import React, { useCallback, useState } from "react";
import { ChannelName } from "../../model/ChannelName";
import { RecordingState } from "../../model/RecordingState";
import { UID } from "agora-rtc-sdk-ng";
import {
  postStartRecordingApi,
  PostStartRecordingResponse,
} from "../../services/api/postStartRecordingApi";
import { postStopRecordingApi } from "../../services/api/postStopRecordingApi";
import { Token } from "../../model/Token";

interface RecordingButtonProps {
  userId: UID | undefined;
  channelName: ChannelName;
  token: Token | undefined;
}

export function RecordingButton(props: RecordingButtonProps) {
  const { channelName, userId, token } = props;
  const [recordingState, setRecordingState] = useState<RecordingState>("none");
  const [startApiResponse, setStartApiResponse] = useState<
    PostStartRecordingResponse | undefined
  >();

  const onClickStart = useCallback(() => {
    if (!userId || !channelName || !token || recordingState !== "none") {
      return;
    }

    setRecordingState("loading");
    postStartRecordingApi(channelName, userId, token).then((response) => {
      setRecordingState("recording");
      setStartApiResponse(response);
    });
  }, [channelName, userId, token, recordingState]);

  const onClickStop = useCallback(() => {
    if (
      !userId ||
      !token ||
      !startApiResponse ||
      recordingState !== "recording"
    ) {
      return;
    }

    postStopRecordingApi(
      startApiResponse.resourceId,
      startApiResponse.recordingId,
      channelName,
      userId
    ).then(() => {
      setRecordingState("none");
    });
  }, [channelName, userId, token, startApiResponse, recordingState]);

  switch (recordingState) {
    case "none":
      return <button onClick={onClickStart}>Start Recording</button>;

    case "loading":
      return <span>Loading...</span>;

    case "recording":
      return <button onClick={onClickStop}>Stop Recording</button>;

    default:
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = recordingState;
      return null;
  }
}
