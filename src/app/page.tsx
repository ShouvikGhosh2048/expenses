import { getServerAuthSession } from "~/server/auth";
import { CreateExpenseForm } from "./ExpenseForm";
import { Flex, Stack } from "@mantine/core";
import RecentExpenses from "./RecentExpenses";
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
      <CreateExpenseForm />
      <Suspense fallback={
        <Stack gap="sm" style={{ flexBasis: 0, flexGrow: 1, minWidth: "330px" }}></Stack>
      }>
        <RecentExpenses userID={session.user.id}/>
      </Suspense>
    </Flex>
  );
}
