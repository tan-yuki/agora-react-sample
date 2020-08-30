import { AppId } from "./AppId";
import { ChannelName } from "./ChannelName";
import { ClientRole } from "agora-rtc-sdk-ng";

export interface InitialSettingValue {
  appId: AppId;
  channelName: ChannelName;
  clientRole: ClientRole;
}
