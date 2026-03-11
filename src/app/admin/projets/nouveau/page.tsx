import ProjectForm from "@/components/admin/ProjectForm";
import { getPromoters } from "@/actions/promoters";
import { getBanks } from "@/actions/banks";

export default async function NewProjectPage() {
    const [promoters, banks] = await Promise.all([
        getPromoters(),
        getBanks()
    ]);

    return (
        <ProjectForm
            promoters={promoters}
            banks={banks}
        />
    );
}
