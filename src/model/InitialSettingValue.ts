import { ChannelName } from "./ChannelName";
import { ClientRole } from "agora-rtc-sdk-ng";

export interface InitialSettingValue {
  channelName: ChannelName;
  clientRole: ClientRole;
}
