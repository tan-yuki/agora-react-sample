export type RecordingState =
  | "none" // 停止中
  | "loading" // 録画開始までのローディング
  | "recording"; // 録画中
