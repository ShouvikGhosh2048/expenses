import { Card, Flex, Pill, Stack, Text, Title } from "@mantine/core";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { expenses } from "~/server/db/schema";

export default async function Expenses() {
    const session = await getServerAuthSession();
    if (session === null) {
      return (
        <div>
          <p>Login to view expenses.</p>
        </div>
      );
    }

    const userExpenses = await db.query.expenses.findMany({
        where: eq(expenses.createdById, session.user.id),
        orderBy: desc(expenses.createdAt),
    });

    const timeZone = headers().get("x-vercel-ip-timezone") ?? undefined;

    return (
        <Stack gap="sm" maw="700px" m="auto">
            <Title order={2}>Expenses</Title>
            { userExpenses.map(expense => (
                <Card key={expense.id} withBorder>
                    <Stack gap="5px">
                    <Text fw={700}>{expense.amount}</Text>
                    {expense.description && <Text>{expense.description}</Text>}
                    {expense.tags && (
                        <Flex wrap="wrap" gap="sm">
                        { expense.tags.split(',').filter(tag => tag.length > 0).map((tag, i) => (
                            <Pill key={i} size="md">{tag}</Pill>
                        )) }
                        </Flex>
                    )}
                    <Flex justify="right">
                        <Text>{expense.createdAt.toLocaleString("en-US", { timeZone })}</Text>
                    </Flex>
                    </Stack>
                </Card>
            ))}
        </Stack>
    );
}