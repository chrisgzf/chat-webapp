import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useAudioSdk, useClient, useMicrophoneTrack } from "../hooks/audioSdk";
import type { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

const PageAudioCall = () => {
  const { channelName } = useParams<{ channelName: string }>();
  const { ready: micReady, track: micTrack } = useMicrophoneTrack();
  const [hasJoinedCall, setHasJoinedCall] = useState<boolean>(false);

  return (
    <>
      <h1>{channelName}</h1>
      {hasJoinedCall ? (
        <PageInCall
          channelName={channelName}
          setHasJoinedCall={setHasJoinedCall}
          track={micTrack}
          ready={micReady}
        />
      ) : (
        <PageJoinCall setHasJoinedCall={setHasJoinedCall} />
      )}
    </>
  );
};

function PageJoinCall(props: {
  setHasJoinedCall: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setHasJoinedCall } = props;
  const handleClickJoinCall = () => setHasJoinedCall(true);
  return <button onClick={handleClickJoinCall}>Join Call</button>;
}

function PageInCall(props: {
  channelName: string;
  setHasJoinedCall: React.Dispatch<React.SetStateAction<boolean>>;
  track: IMicrophoneAudioTrack | null;
  ready: boolean;
}) {
  const { channelName, setHasJoinedCall, track, ready } = props;
  const client = useClient();
  useAudioSdk(channelName, ready, track);

  const [isMuted, setIsMuted] = useState<boolean>(false);

  const handleToggleMute = async () => {
    await track?.setEnabled(isMuted);
    setIsMuted(!isMuted);
  };

  const handleLeaveCall = async () => {
    await client.leave();
    client.removeAllListeners();
    // track?.close();
    setHasJoinedCall(false);
  };

  return (
    <>
      <p>Current: {isMuted ? "Muted" : "Not muted"}</p>
      <button onClick={handleToggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
      <button onClick={handleLeaveCall}>Leave</button>
    </>
  );
}

export default PageAudioCall;
