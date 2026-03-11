"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBanks() {
    return prisma.bank.findMany({ orderBy: { nom: 'asc' } });
}

export async function createBank(data: { nom: string; logo?: string; contact?: string }) {
    const bank = await prisma.bank.create({ data });
    revalidatePath('/admin/banques');
    return bank;
}

export async function deleteBank(id: string) {
    const bank = await prisma.bank.delete({ where: { id } });
    revalidatePath('/admin/banques');
    return bank;
}
