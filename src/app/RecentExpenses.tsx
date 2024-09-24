import { Anchor, Card, Flex, Pill, Stack, Text, Title } from "@mantine/core";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { db } from "~/server/db";
import { expenses } from "~/server/db/schema";

export default async function RecentExpenses(props: { userID: string }) {
    const userExpenses = await db.query.expenses.findMany({
        where: eq(expenses.createdById, props.userID),
        orderBy: desc(expenses.createdAt),
        limit: 10,
    });

    // https://www.reddit.com/r/nextjs/comments/i9fndq/comment/g1fhao0/
    // https://stackoverflow.com/q/76014188
    // https://vercel.com/docs/edge-network/headers#x-vercel-ip-timezone
    const timeZone = headers().get("x-vercel-ip-timezone") ?? undefined;

    return (
        <Stack gap="sm" style={{ flexBasis: 0, flexGrow: 1, minWidth: "330px" }}>
            <Title order={2}>Recent expenses</Title>
            <Anchor component={Link} href="/expenses">View all expenses</Anchor>
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