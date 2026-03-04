"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProjects() {
    return prisma.project.findMany({
        include: {
            promoter: true,
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getProjectById(id: string) {
    return prisma.project.findUnique({
        where: { id },
        include: {
            promoter: true,
        }
    });
}

export async function createProject(data: any) {
    if (data.dateLivraison) {
        data.dateLivraison = new Date(data.dateLivraison);
    }
    if (data.surface) {
        data.surface = parseFloat(data.surface);
    }
    const project = await prisma.project.create({ data });
    revalidatePath('/admin/projets');
    if (project.promoterId) {
        revalidatePath(`/promoteur/${project.promoterId}`);
    }
    return project;
}

export async function updateProject(id: string, data: any) {
    if (data.dateLivraison) {
        data.dateLivraison = new Date(data.dateLivraison);
    }
    if (data.surface) {
        data.surface = parseFloat(data.surface);
    }
    const project = await prisma.project.update({ where: { id }, data });
    revalidatePath('/admin/projets');
    revalidatePath(`/projet/${id}`);
    if (project.promoterId) {
        revalidatePath(`/promoteur/${project.promoterId}`);
    }
    return project;
}

export async function deleteProject(id: string) {
    const project = await prisma.project.delete({ where: { id } });
    revalidatePath('/admin/projets');
    if (project.promoterId) {
        revalidatePath(`/promoteur/${project.promoterId}`);
    }
    return project;
}
