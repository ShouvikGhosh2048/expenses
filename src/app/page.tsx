import { getServerAuthSession } from "~/server/auth";
import NewExpenseForm from "./NewExpenseForm";
import { Flex, Stack } from "@mantine/core";
import RecentTransactions from "./RecentTransactions";
import { Suspense } from "react";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session === null) {
    return (
      <div>
        <p>Login to track expenses.</p>
      </div>
    );
  }

  // https://stackoverflow.com/a/25066844
  return (
    <Flex gap="50px" justify="center" wrap="wrap" style={{ maxWidth: "900px", margin: "auto" }}>
      <NewExpenseForm />
      <Suspense fallback={
        <Stack gap="sm" style={{ flexBasis: 0, flexGrow: 1, minWidth: "330px" }}></Stack>
      }>
        <RecentTransactions userID={session.user.id}/>
      </Suspense>
    </Flex>
  );
}
