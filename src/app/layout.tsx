import "~/styles/globals.css";
import "@mantine/core/styles.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Avatar, ColorSchemeScript, Flex, MantineProvider, Text } from "@mantine/core";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { SigninButton, SignoutButton } from "./AuthButtons";

export const metadata: Metadata = {
  title: "Expenses",
  description: "Website to track expenses",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();


  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={GeistSans.className}>
        <MantineProvider>
          <Flex p="10px" h="50px" justify="space-between" align="center"
                style={{ "borderBottom": "1px solid rgb(210,210,210)" }}>
            <Link href="/">
              <Text size="lg">Home</Text>
            </Link>
            <Flex align="center" gap="10px">
              { session === null && <SigninButton/> }
              { session !== null && (
                <>
                  <Avatar src={session.user.image}/>
                  <SignoutButton/>
                </>
              )}
            </Flex>
          </Flex>
          <div style={{ padding: "10px" }}>
            {children}
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
