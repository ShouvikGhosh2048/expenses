"use client"

import { Button, Card, Flex, Pill, rem, Stack, Text } from "@mantine/core";
import { expenses } from "~/server/db/schema";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import { EditExpenseForm } from "./ExpenseForm";

export default function ExpenseCard({ timeZone, expense }: {
    timeZone?: string,
    expense: typeof expenses.$inferSelect,
}) {
    const [view, setView] = useState<"view"|"edit">("view");
    if (view === "view") {
        return (
            <Card key={expense.id} withBorder>
                <Stack gap="5px">
                <Flex justify="space-between" align="center">
                    <Text fw={700}>{expense.amount}</Text>
                    <Button color="gray" size="xs" onClick={() => setView("edit")}>
                        <IconEdit 
                            style={{ width: rem(20), height: rem(20) }}
                        />
                    </Button>
                </Flex>
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
        );
    } else {
        return (
            <Card key={expense.id} withBorder>
                <EditExpenseForm expense={expense} onExit={() => setView("view")}/>
            </Card>
        );
    }
}