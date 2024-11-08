"use client"

import { Member, Profile, Server } from "@prisma/client"

interface Props {
    member: Member & {profile: Profile};
    server: Server;
}

export default function ServerMember({member, server}: Props) {
  return (
    <div>ServerMember</div>
  )
}
