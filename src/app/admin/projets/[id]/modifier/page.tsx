import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectById } from "@/actions/projects";
import { getPromoters } from "@/actions/promoters";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const [project, promoters] = await Promise.all([
        getProjectById(resolvedParams.id),
        getPromoters()
    ]);

    if (!project) {
        notFound();
    }

    return (
        <ProjectForm
            initialData={project}
            promoters={promoters}
        />
    );
}
