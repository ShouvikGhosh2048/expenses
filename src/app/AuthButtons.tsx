"use client"

import { Button } from "@mantine/core"
import { signIn, signOut } from "next-auth/react";

export function SigninButton() {
    return <Button onClick={() => {
        void signIn("discord");
    }}>Sign in</Button>;
}

export function SignoutButton() {
    return <Button onClick={() => {
        void signOut();
    }}>Sign out</Button>;
}