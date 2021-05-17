import React, { useState } from "react";
import { useHistory } from "react-router";

const PageChannelForm = () => {
  const [channelName, setChannelName] = useState<string>("");
  const history = useHistory();

  function handleJoinChannel(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    history.push(`/${channelName}`);
  }

  return (
    <form onSubmit={handleJoinChannel}>
      <input
        type="text"
        className="joinChannelTextInput"
        placeholder="Enter Channel Name"
        onChange={(e) => setChannelName(e.target.value)}
      />
      <div>
        <button type="submit">Join</button>
      </div>
    </form>
  );
};

export default PageChannelForm;
