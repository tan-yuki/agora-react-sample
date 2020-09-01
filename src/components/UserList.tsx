import React from "react";
import { IAgoraRTCRemoteUser, UID } from "agora-rtc-sdk-ng";

interface UserListProps {
  myUid: UID | undefined;
  remoteUsers: IAgoraRTCRemoteUser[];
}

export function UserList(props: UserListProps) {
  const { myUid, remoteUsers } = props;

  if (!myUid) {
    return null;
  }

  const userIdList = [myUid]
    .concat(
      remoteUsers.map((user: IAgoraRTCRemoteUser) => {
        return user.uid;
      })
    )
    .filter((_) => _);

  return (
    <div>
      <p>User list</p>
      <ul>
        {userIdList.map((uid) => (
          <li key={uid.toString()}>{uid.toString()}</li>
        ))}
      </ul>
    </div>
  );
}
