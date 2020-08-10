const APP_ID = process.env.REACT_APP_AGORA_APP_ID as string;

if (!APP_ID) {
  throw new Error("Please set .evn file");
}

export { APP_ID };
