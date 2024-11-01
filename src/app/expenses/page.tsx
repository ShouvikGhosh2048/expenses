import { Box, Card, Flex, Pill, Stack, Text, Title } from "@mantine/core";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { expenses } from "~/server/db/schema";
import ExpenseCard from "../ExpenseCard";

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

    const monthFormat = new Intl.DateTimeFormat("en-US", { timeZone, month: "long", year: "numeric" });
    const cards: JSX.Element[] = [];
    for (let i = 0; i < userExpenses.length; i++) {
        const month = monthFormat.format(userExpenses[i]!.createdAt);

        let total = Number(userExpenses[i]!.amount);
        let j = i + 1;
        for (; j < userExpenses.length; j++) {
            if (monthFormat.format(userExpenses[j]!.createdAt) !== month) {
                break;
            }
            total += Number(userExpenses[j]!.amount);
        }

        cards.push(
            <Box p="sm" bg="#e9ecef" key={month}>
                <Flex justify="space-between">
                    <Title order={4}>{month}</Title>
                    <Title order={4}>{total}</Title>
                </Flex>
            </Box>
        );
        for (let k = i; k < j; k++) {
            const expense = userExpenses[k]!;
            cards.push(<ExpenseCard key={expense.id} expense={expense} timeZone={timeZone}/>);
        }
        i = j;
    }

    return (
        <Stack gap="sm" maw="700px" m="auto">
            <Title order={2}>Expenses</Title>
            { cards }
        </Stack>
    );
}