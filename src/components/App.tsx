import React, { useEffect } from "react";
import "./App.css";
import { createAgoraClient } from "../services/createClient";
import { APP_ID } from "../config";

function App() {
  useEffect(() => {
    const client = createAgoraClient("test-channel");
    client.setClientRole("host");
  }, []);

  return (
    <div className="App">
      <h1>Hello world</h1>
    </div>
  );
}

export default App;
