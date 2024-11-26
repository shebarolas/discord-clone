"use client";

import { useEffect, useState } from "react";
import CreateServer from "../modals/CreateServer";
import InvitePeople from "../modals/InvitePeople";
import EditServer from "../modals/EditServer";
import EditMembers from "../modals/EditMembers";
import CreateChannel from "../modals/CreateChannel";
import LeaveServer from "../modals/LeaveServer";
import DeleteServer from "../modals/DeleteServer";
import EditChannel from "../modals/EditChannel";
import DeleteChannel from "../modals/DeleteChannels";
import MessageFile from "../modals/MessageFile";
import DeleteMessage from "../modals/DeleteMessage";

export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <div>
      <CreateServer />
      <InvitePeople />
      <EditServer />
      <EditMembers />
      <CreateChannel />
      <LeaveServer />
      <DeleteServer/>
      <EditChannel/>
      <DeleteChannel/>
      <MessageFile/>
      <DeleteMessage/>
    </div>
  );
}
