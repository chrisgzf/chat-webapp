import { createClient, createMicrophoneAudioTrack } from "agora-rtc-react";

import { AGORA_CLIENT_CONFIG as config } from "./constants";

export const useClient = createClient(config);
export const useMicrophoneTrack = createMicrophoneAudioTrack();
