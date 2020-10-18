import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components/App";
import { AppId } from "./model/AppId";

const appId = process.env.REACT_APP_AGORA_APP_ID as AppId;

ReactDOM.render(
  <React.StrictMode>
    <App appId={appId} />
  </React.StrictMode>,
  document.getElementById("root")
);
