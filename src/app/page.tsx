import { getServerAuthSession } from "~/server/auth";
import NewExpenseForm from "./NewExpenseForm";
import { Anchor, Card, Flex, Pill, Stack, Text, Title } from "@mantine/core";
import { db } from "~/server/db";
import { desc, eq } from "drizzle-orm";
import { expenses } from "~/server/db/schema";
import Link from "next/link";
import { headers } from "next/headers";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session === null) {
    return (
      <div>
        <p>Login to track expenses.</p>
      </div>
    );
  }

  const transactions = await db.query.expenses.findMany({
    where: eq(expenses.createdById, session.user.id),
    orderBy: desc(expenses.createdAt),
    limit: 10,
  });

  // https://www.reddit.com/r/nextjs/comments/i9fndq/comment/g1fhao0/
  // https://stackoverflow.com/q/76014188
  // https://vercel.com/docs/edge-network/headers#x-vercel-ip-timezone
  const timeZone = headers().get("x-vercel-ip-timezone") ?? undefined;

  // https://stackoverflow.com/a/25066844
  return (
    <Flex gap="50px" justify="center" wrap="wrap" style={{ maxWidth: "900px", margin: "auto" }}>
      <NewExpenseForm />
      <Stack gap="sm" style={{ flexBasis: 0, flexGrow: 1, minWidth: "330px" }}>
        <Title order={2}>Recent transactions</Title>
        <Anchor component={Link} href="/transactions">View all transactions</Anchor>
        { transactions.map(transaction => (
          <Card key={transaction.id} withBorder>
            <Stack gap="5px">
              <Text fw={700}>{transaction.amount}</Text>
              {transaction.description && <Text>{transaction.description}</Text>}
              {transaction.tags && (
                <Flex wrap="wrap" gap="sm">
                  { transaction.tags.split(',').filter(tag => tag.length > 0).map((tag, i) => (
                      <Pill key={i} size="md">{tag}</Pill>
                    )) }
                </Flex>
              )}
              <Flex justify="right">
                <Text>{transaction.createdAt.toLocaleString("en-US", { timeZone })}</Text>
              </Flex>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Flex>
  );
}
