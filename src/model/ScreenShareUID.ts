import { UID } from "agora-rtc-sdk-ng";

/**
 * ScreenShare専用のUID。
 *
 * AgoraではどのVideoStreamが画面共有の動画のStreamかを判断することができないため、
 * 専用のUIDを作成し、そのUIDのユーザーからのストリームは画面共有であると判断する。
 */
const SCREEN_SHARE_UID_RAW_VALUE = 1;

export function createRawScreenShareUID(): number {
  return SCREEN_SHARE_UID_RAW_VALUE;
}

export function isScreenShareUID(uid: UID): boolean {
  return uid === SCREEN_SHARE_UID_RAW_VALUE;
}
