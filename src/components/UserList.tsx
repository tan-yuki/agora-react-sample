import React from "react";
import { IAgoraRTCRemoteUser } from "agora-rtc-sdk-ng";

interface UserListProps {
  alreadyJoined: boolean;
  myUid: string | undefined;
  remoteUsers: IAgoraRTCRemoteUser[];
}

export function UserList(props: UserListProps) {
  const { alreadyJoined, myUid, remoteUsers } = props;

  if (!alreadyJoined || !myUid) {
    return null;
  }

  const userIdList = [myUid]
    .concat(
      remoteUsers.map((user: IAgoraRTCRemoteUser) => {
        return user.uid.toString();
      })
    )
    .filter((_) => _);

  return (
    <div>
      <p>User list</p>
      <ul>
        {userIdList.map((uid) => (
          <li key={uid}>{uid}</li>
        ))}
      </ul>
    </div>
  );
}
