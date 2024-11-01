"use client"

import { Alert, Button, Flex, NumberInput, Stack, TagsInput, TextInput, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createExpense, editExpense } from "~/server/action";
import { type expenses } from "~/server/db/schema";

function SubmitButton({ text } : { text: string }) {
    const formStatus = useFormStatus();
    return <Button type="submit" disabled={formStatus.pending}>{text}</Button>;
}

function CancelButton({ onClick }: { onClick: () => void }) {
    const formStatus = useFormStatus();
    return <Button onClick={onClick} color="red" disabled={formStatus.pending}>Cancel</Button>;
}

export function CreateExpenseForm() {
    const [state, formAction] = useFormState(createExpense, null);
    const [amount, setAmount] = useState<number | string>("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        if (state?.expenseID) {
            setAmount("");
            setDescription("");
            setTags([]);
        }
    }, [state?.expenseID]);

    return (
        <form action={formAction} style={{ flexBasis: 0, flexGrow: 1, minWidth: "330px" }}>
            <Stack gap="sm">
                <Title order={2}>Create expense</Title>
                { state?.error && <Alert variant="light" color="red" title="Error">{state.error}</Alert> }
                <NumberInput name="amount" placeholder="Amount" required
                        value={amount} onChange={setAmount}
                        min={0} decimalScale={2} clampBehavior="strict"/>
                <TextInput name="description" placeholder="Description"
                            value={description} onChange={e => setDescription(e.target.value)}/>
                <TagsInput name="tags" placeholder="Tags"
                            value={tags} onChange={setTags}/>
                <Flex justify="right">
                    <SubmitButton text="Create expense"/>
                </Flex>
            </Stack>
        </form>
    );
}

export function EditExpenseForm({ expense, onExit }: {
    expense: typeof expenses.$inferSelect,
    onExit: () => void,
}) {
    const [state, formAction] = useFormState(editExpense.bind(null, expense.id), null);
    const [amount, setAmount] = useState<number | string>(expense.amount);
    const [description, setDescription] = useState(expense.description);
    const [tags, setTags] = useState<string[]>(expense.tags.split(",").filter(s => s.length > 0));

    useEffect(() => {
        if (state?.expenseID) {
            onExit();
        }
    }, [state?.expenseID]);

    return (
        <form action={formAction} style={{ flexBasis: 0, flexGrow: 1, minWidth: "330px" }}>
            <Stack gap="sm">
                <Title order={2}>Edit expense</Title>
                { state?.error && <Alert variant="light" color="red" title="Error">{state.error}</Alert> }
                <NumberInput name="amount" placeholder="Amount" required
                        value={amount} onChange={setAmount}
                        min={0} decimalScale={2} clampBehavior="strict"/>
                <TextInput name="description" placeholder="Description"
                            value={description} onChange={e => setDescription(e.target.value)}/>
                <TagsInput name="tags" placeholder="Tags"
                            value={tags} onChange={setTags}/>
                <Flex justify="right" gap="sm">
                    <SubmitButton text="Edit"/>
                    <CancelButton onClick={onExit}/>
                </Flex>
            </Stack>
        </form>
    );
}