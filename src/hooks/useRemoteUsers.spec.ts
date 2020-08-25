import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";
import { UNCAPSULE_FOR_TEST } from "./useRemoteUsers";

const { mergeUser, removeUser } = UNCAPSULE_FOR_TEST;

function createUser(uid: string): IAgoraRTCRemoteUser {
  return {
    uid,
    hasAudio: true,
    hasVideo: true,
  };
}

describe("#merge", () => {
  test("merge not exists user", () => {
    const users: IAgoraRTCRemoteUser[] = [
      createUser("1"),
      createUser("2"),
      createUser("3"),
    ];

    const actual = mergeUser(users, createUser("4"));

    expect(actual.length).toBe(4);
  });

  test("merge exists user", () => {
    const users: IAgoraRTCRemoteUser[] = [
      createUser("1"),
      createUser("2"),
      createUser("3"),
    ];

    const actual = mergeUser(users, createUser("2"));

    expect(actual.length).toBe(3);
  });
});

describe("#remove", () => {
  test("remove not exists user", () => {
    const users: IAgoraRTCRemoteUser[] = [
      createUser("1"),
      createUser("2"),
      createUser("3"),
    ];

    const actual = removeUser(users, createUser("4"));

    expect(actual.length).toBe(3);
  });

  test("remove exists user", () => {
    const users: IAgoraRTCRemoteUser[] = [
      createUser("1"),
      createUser("2"),
      createUser("3"),
    ];

    const actual = removeUser(users, createUser("2"));

    expect(actual.length).toBe(2);
  });
});
