import React from "react";
import { createAgoraClient } from "../services/createClient";
import { LiveScreen } from "./LiveScreen";

const channelName = "test-channel";
const client = createAgoraClient("host");

export function App() {
  return <LiveScreen client={client} channelName={channelName} />;
}
