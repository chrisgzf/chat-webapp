import React, { useState, useEffect } from "react";
import "./App.css";

import { createClient, createMicrophoneAudioTrack } from "agora-rtc-react";
import { ClientConfig } from "agora-rtc-sdk-ng";

const config: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};

const appId: string = process.env.REACT_APP_AGORA_APP_ID as string;

const useClient = createClient(config);
const useMicrophoneTrack = createMicrophoneAudioTrack();

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
  const client = useClient();
  const { ready, track } = useMicrophoneTrack();

  useEffect(() => {
    // function to initialise the SDK
    let init = async (name: string) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
          user.audioTrack?.stop();
        }
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);
      });

      const token = await fetch(
        `${process.env.REACT_APP_TOKEN_ENDPOINT}chat/rtcToken?channelName=${channelName}`
      )
        .then((response) => response.json())
        .then((data) => data.key);

      await client.join(appId, name, token, null);
      if (track) await client.publish([track]);
    };

    if (ready && track) {
      console.log("init ready");
      init(channelName);
    }
  }, [channelName, client, ready, track]);

  return (
    <div className="App">
      {ready && track && <Controls track={track} setInCall={setInCall} />}
    </div>
  );
};

export const Controls = (props: any) => {
  const client = useClient();
  const { track, setInCall } = props;
  const [trackState, setTrackState] = useState({ audio: true });

  const mute = async (type: "audio" | "video") => {
    if (type === "audio") {
      await track.setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    track.close();
    setInCall(false);
  };

  return (
    <div className="controls">
      <p className={trackState.audio ? "on" : ""} onClick={() => mute("audio")}>
        {trackState.audio ? "MuteAudio" : "UnmuteAudio"}
      </p>
      {<p onClick={() => leaveChannel()}>Leave</p>}
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
      {appId === "" && (
        <p style={{ color: "red" }}>
          Please enter your App ID in .env and refresh the page
        </p>
      )}
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
