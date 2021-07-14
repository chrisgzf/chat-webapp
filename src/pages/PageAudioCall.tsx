import React, { useState } from "react";
import {
  useHistory,
  useLocation,
  useParams,
  RouteComponentProps,
} from "react-router-dom";

import { Helmet } from "react-helmet";

import { useAudioSdk, useClient, useMicrophoneTrack } from "../hooks/audioSdk";
import type { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

interface PageParams {
  uid: string;
}
interface PageProps extends RouteComponentProps<PageParams> {
  uid: string;
}

const PageAudioCall = () => {
  const { channelName } = useParams<{ channelName: string }>();
  const { ready: micReady, track: micTrack } = useMicrophoneTrack();
  const [hasJoinedCall, setHasJoinedCall] = useState<boolean>(false);
  const location = useLocation<PageProps>();
  return (
    <>
      <Helmet>
        <title>Chad - {channelName}</title>
        <link rel="canonical" href="https://chat.christopher.sg" />
      </Helmet>
      <h1>{channelName}</h1>
      {hasJoinedCall ? (
        <PageInCall
          channelName={channelName}
          setHasJoinedCall={setHasJoinedCall}
          track={micTrack}
          ready={micReady}
          username={location.state?.uid}
        />
      ) : (
        <PageJoinCall setHasJoinedCall={setHasJoinedCall} track={micTrack} />
      )}
    </>
  );
};

function PageJoinCall(props: {
  setHasJoinedCall: React.Dispatch<React.SetStateAction<boolean>>;
  track: IMicrophoneAudioTrack | null;
}) {
  const { setHasJoinedCall, track } = props;
  const history = useHistory();

  const handleClickJoinCall = () => setHasJoinedCall(true);

  const handleLeaveChannel = () => {
    track?.close();
    history.push("/");
  };

  return (
    <>
      <button onClick={handleClickJoinCall}>Join call</button>
      <button onClick={handleLeaveChannel}>Exit channel</button>
    </>
  );
}

function PageInCall(props: {
  channelName: string;
  setHasJoinedCall: React.Dispatch<React.SetStateAction<boolean>>;
  track: IMicrophoneAudioTrack | null;
  ready: boolean;
  username: string;
}) {
  const { channelName, setHasJoinedCall, track, ready, username } = props;
  const client = useClient();
  useAudioSdk(channelName, ready, track, username);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const handleToggleMute = async () => {
    await track?.setEnabled(isMuted);
    setIsMuted(!isMuted);
  };

  const handleLeaveCall = async () => {
    await client.leave();
    client.removeAllListeners();
    setHasJoinedCall(false);
  };

  return (
    <>
      <p>Current: {isMuted ? "Muted" : "Not muted"}</p>
      <p>You are {username}</p>
      <button onClick={handleToggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
      <button onClick={handleLeaveCall}>Leave</button>
    </>
  );
}

export default PageAudioCall;
