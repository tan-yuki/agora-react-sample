import { UID } from "agora-rtc-sdk-ng";

const SCREEN_SHARE_UID_RAW_VALUE = "1";

export function createRawScreenShareUID(): string {
  return SCREEN_SHARE_UID_RAW_VALUE;
}

export function isScreenShareUID(uid: UID): boolean {
  return uid.toString() === SCREEN_SHARE_UID_RAW_VALUE;
}
