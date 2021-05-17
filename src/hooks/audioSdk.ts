import { useEffect } from "react";
import {
  createClient,
  createMicrophoneAudioTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-react";
import {
  EVENT_STREAM_PUBLISHED,
  EVENT_STREAM_UNPUBLISHED,
} from "../constants/events";
import { AGORA_APP_ID, AUDIO_MEDIA } from "../constants/audioSdk";
import { TOKEN_ENDPOINT } from "../constants/endpoints";

import type { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import type { MediaType } from "../types/audioSdk";

import { AGORA_CLIENT_CONFIG as config } from "../constants/audioSdk";

export const useClient = createClient(config);
export const useMicrophoneTrack = createMicrophoneAudioTrack();

export function useAudioSdk(channelName: string): {
  micReady: boolean;
  micTrack: IMicrophoneAudioTrack | null;
} {
  const client = useClient();
  const { ready, track } = useMicrophoneTrack();

  useEffect(() => {
    async function handleStreamPublished(
      user: IAgoraRTCRemoteUser,
      mediaType: MediaType
    ) {
      await client.subscribe(user, mediaType);
      if (mediaType === AUDIO_MEDIA) {
        user.audioTrack?.play();
      }
    }

    async function handleStreamUnpublished(
      user: IAgoraRTCRemoteUser,
      mediaType: MediaType
    ) {
      if (mediaType === AUDIO_MEDIA) {
        user.audioTrack?.stop();
      }
    }

    async function fetchSdkToken(): Promise<string> {
      const token = await fetch(
        `${TOKEN_ENDPOINT}chat/rtcToken?channelName=${channelName}`
      )
        .then((response) => response.json())
        .then((data) => data.key);
      return token;
    }

    let init = async (name: string) => {
      client.on(EVENT_STREAM_PUBLISHED, handleStreamPublished);
      client.on(EVENT_STREAM_UNPUBLISHED, handleStreamUnpublished);

      const token = await fetchSdkToken();

      await client.join(AGORA_APP_ID, name, token, null);
      if (track) {
        await client.publish([track]);
      }
    };

    if (ready && track) {
      init(channelName);
    }
  }, [channelName, client, ready, track]);

  return { micReady: ready, micTrack: track };
}
