import { UID } from "agora-rtc-sdk-ng";
import axios from "axios";
import { AppId } from "../../model/AppId";
import { ChannelName } from "../../model/ChannelName";
import { Token } from "../../model/Token";

const url = `${process.env.REACT_APP_API_SERVER_URL}/v1/token`;

export async function getTokenApi(
  appId: AppId,
  channelName: ChannelName,
  userId: UID
): Promise<Token> {
  const response = await axios.get(url, {
    params: {
      appId,
      channelName,
      userId: userId.toString(),
    },
  });
  return response.data.token as Token;
}
