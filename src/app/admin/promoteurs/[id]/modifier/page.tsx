import PromoterForm from "@/components/admin/PromoterForm";
import { getPromoterById } from "@/actions/promoters";
import { getCities, getCategories } from "@/actions/taxonomies";
import { getBanks } from "@/actions/banks";
import { notFound } from "next/navigation";

export default async function EditPromoterPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const [promoter, cities, categories, banks] = await Promise.all([
        getPromoterById(resolvedParams.id),
        getCities(),
        getCategories(),
        getBanks()
    ]);

    if (!promoter) {
        notFound();
    }

    return (
        <PromoterForm
            initialData={promoter}
            cities={cities}
            categories={categories}
            banks={banks}
        />
    );
}
