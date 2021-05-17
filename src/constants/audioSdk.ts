import { ClientConfig } from "agora-rtc-sdk-ng";

export const AGORA_APP_ID: string = process.env
  .REACT_APP_AGORA_APP_ID as string;

export const AGORA_CLIENT_CONFIG: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};

export const AUDIO_MEDIA = "audio";
export const VIDEO_MEDIA = "video";
