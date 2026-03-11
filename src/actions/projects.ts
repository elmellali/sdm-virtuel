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
            banks: true,
        } as any
    });
}

export async function createProject(data: any) {
    const bankIds = data.bankIds || [];
    if ('bankIds' in data) delete data.bankIds;

    if (data.dateLivraison) {
        data.dateLivraison = new Date(data.dateLivraison);
    }
    if (data.surface) {
        data.surface = parseFloat(data.surface);
    }
    
    const project = await prisma.project.create({ 
        data: {
            ...data,
            banks: {
                connect: bankIds.map((id: string) => ({ id }))
            }
        } 
    });
    
    revalidatePath('/admin/projets');
    if (project.promoterId) {
        revalidatePath(`/promoteur/${project.promoterId}`);
    }
    return project;
}

export async function updateProject(id: string, data: any) {
    const bankIds = data.bankIds || [];
    const hasBanksKey = 'bankIds' in data;
    if (hasBanksKey) delete data.bankIds;

    if (data.dateLivraison) {
        data.dateLivraison = new Date(data.dateLivraison);
    }
    if (data.surface) {
        data.surface = parseFloat(data.surface);
    }

    const updateData: any = { ...data };
    if (hasBanksKey) {
        updateData.banks = {
            set: bankIds.map((bid: string) => ({ id: bid }))
        };
    }

    const project = await prisma.project.update({ 
        where: { id }, 
        data: updateData 
    });
    
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
