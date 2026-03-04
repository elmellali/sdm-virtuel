import ProjectForm from "@/components/admin/ProjectForm";
import { getPromoters } from "@/actions/promoters";

export default async function NewProjectPage() {
    const promoters = await getPromoters();

    return (
        <ProjectForm
            promoters={promoters}
        />
    );
}
