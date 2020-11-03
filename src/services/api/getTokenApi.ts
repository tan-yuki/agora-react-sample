import { UID } from "agora-rtc-sdk-ng";
import { ChannelName } from "../../model/ChannelName";
import { Token } from "../../model/Token";
import { callGetApi } from "./callApi";

interface GetTokenRequestParams {
  channelName: string;
  userId: string;
}

interface GetTokenResponse {
  token: string;
}

export async function getTokenApi(
  channelName: ChannelName,
  userId: UID
): Promise<Token> {
  const response = await callGetApi<GetTokenRequestParams, GetTokenResponse>(
    "/token",
    {
      channelName,
      userId: userId.toString(),
    }
  );

  return response.token as Token;
}
