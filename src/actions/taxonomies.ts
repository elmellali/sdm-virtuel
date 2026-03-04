"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCities() {
    return prisma.city.findMany({ orderBy: { nom: 'asc' } });
}

export async function createCity(data: { nom: string }) {
    const city = await prisma.city.create({ data });
    revalidatePath('/admin/villes');
    return city;
}

export async function deleteCity(id: string) {
    const city = await prisma.city.delete({ where: { id } });
    revalidatePath('/admin/villes');
    return city;
}

export async function getCategories() {
    return prisma.category.findMany({ orderBy: { nom: 'asc' } });
}

export async function createCategory(data: { nom: string }) {
    const category = await prisma.category.create({ data });
    revalidatePath('/admin/categories');
    return category;
}

export async function deleteCategory(id: string) {
    const category = await prisma.category.delete({ where: { id } });
    revalidatePath('/admin/categories');
    return category;
}
