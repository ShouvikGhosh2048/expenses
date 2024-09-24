import { Anchor, Card, Flex, Pill, Stack, Text, Title } from "@mantine/core";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { db } from "~/server/db";
import { expenses } from "~/server/db/schema";

export default async function RecentTransactions(props: { userID: string }) {
    const transactions = await db.query.expenses.findMany({
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
    );
}