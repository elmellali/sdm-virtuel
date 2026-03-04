import PromoterForm from "@/components/admin/PromoterForm";
import { getCities, getCategories } from "@/actions/taxonomies";

export default async function NewPromoterPage() {
    const [cities, categories] = await Promise.all([
        getCities(),
        getCategories()
    ]);

    return (
        <PromoterForm
            cities={cities}
            categories={categories}
        />
    );
}
