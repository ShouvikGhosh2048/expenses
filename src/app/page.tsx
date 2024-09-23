import { getServerAuthSession } from "~/server/auth";
import NewExpenseForm from "./NewExpenseForm";
import { Anchor, Card, Flex, Pill, Stack, Text, Title } from "@mantine/core";
import { db } from "~/server/db";
import { desc, eq } from "drizzle-orm";
import { expenses } from "~/server/db/schema";
import Link from "next/link";
import ClientDate from "./ClientDate";

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

  return (
    <Flex gap="50px" justify="center" wrap="wrap">
      <NewExpenseForm />
      <Stack gap="sm" miw="300px" maw="400px">
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
                <Text><ClientDate date={transaction.createdAt}/></Text>
              </Flex>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Flex>
  );
}
