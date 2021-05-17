import React, { useState } from "react";
import "./App.css";

import { useAudioSdk, useClient } from "./hooks/audioSdk";

function App() {
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("");

  return (
    <div>
      <h1 className="heading">Chad App</h1>
      {inCall ? (
        <AudioCall setInCall={setInCall} channelName={channelName} />
      ) : (
        <ChannelForm setInCall={setInCall} setChannelName={setChannelName} />
      )}
    </div>
  );
}

const AudioCall = (props: {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  channelName: string;
}) => {
  const { setInCall, channelName } = props;
  const { micReady, micTrack } = useAudioSdk(channelName);

  return (
    <div className="App">
      {micReady && micTrack && (
        <>
          <Controls track={micTrack} setInCall={setInCall} />
        </>
      )}
    </div>
  );
};

export const Controls = (props: any) => {
  const client = useClient();
  const { track, setInCall } = props;
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const handleToggleMute = async () => {
    await track.setEnabled(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleLeaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    track.close();
    setInCall(false);
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

const ChannelForm = (props: {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  setChannelName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { setInCall, setChannelName } = props;

  return (
    <form className="join">
      <input
        type="text"
        placeholder="Enter Channel Name"
        onChange={(e) => setChannelName(e.target.value)}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          setInCall(true);
        }}
      >
        Join
      </button>
    </form>
  );
};

export default App;
