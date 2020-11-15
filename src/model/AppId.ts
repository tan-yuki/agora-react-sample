export type AppId = string & { __appId: never };
export const appId = process.env.REACT_APP_AGORA_APP_ID as AppId;
