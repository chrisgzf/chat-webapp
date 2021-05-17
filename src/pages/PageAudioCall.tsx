import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useAudioSdk, useClient } from "../hooks/audioSdk";
import type { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

const PageAudioCall = () => {
  const { channelName } = useParams<{ channelName: string }>();
  console.log(`CHANNEL NAME IS: ${channelName}`);
  const { micReady, micTrack } = useAudioSdk(channelName);

  return (
    <div className="App">
      <h1>{channelName}</h1>
      {micReady && micTrack && (
        <>
          <Controls track={micTrack} />
        </>
      )}
    </div>
  );
};

const Controls = (props: { track: IMicrophoneAudioTrack }) => {
  const client = useClient();
  const { track } = props;
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const history = useHistory();

  const handleToggleMute = async () => {
    await track.setEnabled(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleLeaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    track.close();
    history.push("/");
  };

  return (
    <div className="controls">
      <p className={isMuted ? "" : "on"} onClick={handleToggleMute}>
        {isMuted ? "Unmute" : "Mute"}
      </p>
      {<p onClick={handleLeaveChannel}>Leave</p>}
    </div>
  );
};

export default PageAudioCall;
