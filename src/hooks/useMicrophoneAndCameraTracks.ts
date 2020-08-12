import AgoraRTC, {
  MicrophoneAudioTrackInitConfig,
  CameraVideoTrackInitConfig,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
} from "agora-rtc-sdk-ng";
import { useState, useEffect } from "react";

export interface TrackConfig {
  audioConfig?: MicrophoneAudioTrackInitConfig;
  videoConfig?: CameraVideoTrackInitConfig;
}

export function useMicrophoneAndCameraTracks(
  trackConfig: TrackConfig = {}
): [IMicrophoneAudioTrack | undefined, ICameraVideoTrack | undefined] {
  const { audioConfig, videoConfig } = trackConfig;

  const [microphoneTrack, setMicrophoneAudioTrack] = useState<
    IMicrophoneAudioTrack | undefined
  >(undefined);
  const [cameraTrack, setCameraTrack] = useState<ICameraVideoTrack | undefined>(
    undefined
  );

  useEffect(() => {
    async function createTracks() {
      const [
        newMicrophoneTrack,
        newCameraTrack,
      ] = await AgoraRTC.createMicrophoneAndCameraTracks(
        audioConfig,
        videoConfig
      );

      setMicrophoneAudioTrack(newMicrophoneTrack);
      setCameraTrack(newCameraTrack);
    }

    createTracks();
  }, [audioConfig, videoConfig]);

  return [microphoneTrack, cameraTrack];
}
