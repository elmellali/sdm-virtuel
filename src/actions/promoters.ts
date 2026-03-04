"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPromoters() {
    return prisma.promoter.findMany({
        include: {
            ville: true,
            categorie: true,
            _count: {
                select: { projets: true }
            }
        },
        orderBy: { nom: 'asc' }
    });
}

export async function getPromoterById(id: string) {
    return prisma.promoter.findUnique({
        where: { id },
        include: {
            ville: true,
            categorie: true,
            projets: true,
        }
    });
}

export async function createPromoter(data: any) {
    const promoter = await prisma.promoter.create({ data });
    revalidatePath('/admin/promoteurs');
    revalidatePath('/');
    return promoter;
}

export async function updatePromoter(id: string, data: any) {
    const promoter = await prisma.promoter.update({ where: { id }, data });
    revalidatePath('/admin/promoteurs');
    revalidatePath(`/promoteur/${id}`);
    revalidatePath('/');
    return promoter;
}

export async function deletePromoter(id: string) {
    const promoter = await prisma.promoter.delete({ where: { id } });
    revalidatePath('/admin/promoteurs');
    revalidatePath('/');
    return promoter;
}
