"use server"

import { z } from "zod";
import { db } from "./db";
import { expenses } from "./db/schema";
import { getServerAuthSession } from "./auth";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";

const expenseSchema = z.object({
    amount: z.coerce.number().nonnegative().finite(),
    description: z.string(),
    tags: z.string(),
});

export async function createExpense(
    prevState: null | { error: string, expenseID?: undefined } | { error?: undefined, expenseID: number }, 
    formData: FormData
): Promise<null | { error: string, expenseID?: undefined } | { error?: undefined, expenseID: number }> {
    const session = await getServerAuthSession();
    if (session === null) {
        return { error: "Unauthenticated" };
    }

    const { data, error } = expenseSchema.safeParse({
        amount: formData.get("amount"),
        description: formData.get("description"),
        tags: formData.get("tags"),
    });
    if (error) {
        return { error: "Invalid input" };
    }

    try {
        const id = await db.insert(expenses).values({
            amount: data.amount.toString(),
            description: data.description,
            tags: data.tags,
            createdById: session.user.id,
        }).returning({
            id: expenses.id,
        });
        revalidatePath("/");
        return { expenseID: id[0]!.id }; // Created entry so shouldn't be undefined.
    } catch {
        return { error: "Couldn't insert the expense into the DB" };
    }
};

export async function editExpense(
    id: number,
    prevState: null | { error: string, expenseID?: undefined } | { error?: undefined, expenseID: number }, 
    formData: FormData
): Promise<null | { error: string, expenseID?: undefined } | { error?: undefined, expenseID: number }> {
    const session = await getServerAuthSession();
    if (session === null) {
        return { error: "Unauthenticated" };
    }

    const { data, error } = expenseSchema.safeParse({
        amount: formData.get("amount"),
        description: formData.get("description"),
        tags: formData.get("tags"),
    });
    if (error) {
        return { error: "Invalid input" };
    }

    try {
        const res = await db.update(expenses).set({
            amount: data.amount.toString(),
            description: data.description,
            tags: data.tags,
        }).where(and(eq(expenses.id, id), eq(expenses.createdById, session.user.id))).returning({ id: expenses.id });
        if (res.length === 0) {
            return { error: "Couldn't update the expense." };
        }
        revalidatePath("/");
        return { expenseID: id };
    } catch {
        return { error: "Couldn't update the expense. (DB error)" };
    }
};