"use client"

import { Alert, Button, Flex, NumberInput, Stack, TagsInput, TextInput, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createExpense } from "~/server/action";

function SubmitButton() {
    const formStatus = useFormStatus();
    return <Button type="submit" disabled={formStatus.pending}>Create expense</Button>;
}

export default function NewExpenseForm() {
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
        <form action={formAction} style={{ width: "300px" }}>
            <Stack gap="sm">
                <Title order={2}>New expense</Title>
                { state?.error && <Alert variant="light" color="red" title="Error">{state.error}</Alert> }
                <NumberInput name="amount" placeholder="Amount" required
                        value={amount} onChange={setAmount}
                        min={0} decimalScale={2} clampBehavior="strict"/>
                <TextInput name="description" placeholder="Description"
                            value={description} onChange={e => setDescription(e.target.value)}/>
                <TagsInput name="tags" placeholder="Tags"
                            value={tags} onChange={setTags}/>
                <Flex justify="right">
                    <SubmitButton/>
                </Flex>
            </Stack>
        </form>
    );
}