import PromoterForm from "@/components/admin/PromoterForm";
import { getCities, getCategories } from "@/actions/taxonomies";
import { getBanks } from "@/actions/banks";

export default async function NewPromoterPage() {
    const [cities, categories, banks] = await Promise.all([
        getCities(),
        getCategories(),
        getBanks()
    ]);

    return (
        <PromoterForm
            cities={cities}
            categories={categories}
            banks={banks}
        />
    );
}
