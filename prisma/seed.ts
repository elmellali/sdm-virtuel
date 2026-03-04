import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database with Promoters...')

    // 0. Clean up existing data to prevent duplication
    await prisma.project.deleteMany()
    await prisma.promoter.deleteMany()
    await prisma.category.deleteMany()
    await prisma.city.deleteMany()
    await prisma.user.deleteMany()

    // 1. Create Admin User
    const password = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@sdm.ma' },
        update: {},
        create: {
            email: 'admin@sdm.ma',
            name: 'Admin SDM',
            password,
        },
    })
    console.log(`Created admin user: ${admin.email}`)

    // 2. Create Cities
    const citiesData = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Dakhla']
    const cities = []
    for (const cityName of citiesData) {
        const city = await prisma.city.create({ data: { nom: cityName } })
        cities.push(city)
    }
    console.log(`Created ${cities.length} cities`)

    // 3. Create Categories (Real Estate)
    const categoriesData = ['Villas de Luxe', 'Appartements Haut Standing', 'Résidences Balnéaires', 'Plateaux Bureaux', 'Lots de Terrain', 'Projets Mixtes', 'Social et Moyen Standing']
    const categories = []
    for (const catName of categoriesData) {
        const category = await prisma.category.create({ data: { nom: catName } })
        categories.push(category)
    }
    console.log(`Created ${categories.length} categories`)

    const promotersData = [
        { nom: 'CGI Immobilier', villeId: cities[1].id, categorieId: categories[5].id, contact: 'contact@cgi.ma', description: 'Leader de l\'aménagement et du développement immobilier au Maroc (Groupe CDG).', logo: 'https://ui-avatars.com/api/?name=CGI+Immobilier&background=3BE8B0&color=0A1F18&size=200&font-size=0.4&bold=true' },
        { nom: 'Prestigia', villeId: cities[0].id, categorieId: categories[0].id, contact: 'prestigia@addoha.ma', description: 'Marque haut de gamme offrant des villas luxueuses (Bouskoura, Plage des Nations).', logo: 'https://ui-avatars.com/api/?name=Prestigia&background=10B981&color=ffffff&size=200&font-size=0.4&bold=true' },
        { nom: 'Eagle Hills', villeId: cities[1].id, categorieId: categories[5].id, contact: 'info@eaglehillsmaroc.ma', description: 'Société d\'investissement et de développement immobilier privé basée à Rabat Marina.', logo: 'https://ui-avatars.com/api/?name=Eagle+Hills&background=0A1F18&color=3BE8B0&size=200&font-size=0.4&bold=true' },
        { nom: 'Alliances Création', villeId: cities[0].id, categorieId: categories[1].id, contact: 'sales@alliances.ma', description: 'Filiale dédiée au segment moyen/haut standing du Groupe Alliances.', logo: 'https://ui-avatars.com/api/?name=Alliances&background=064e3b&color=D1FAE5&size=200&font-size=0.4&bold=true' },
        { nom: 'Palmeraie Développement', villeId: cities[2].id, categorieId: categories[0].id, contact: 'contact@palmeraie.ma', description: 'Créateur du Palmeraie Resort et acteur incontournable de l\'immobilier de luxe à Marrakech.', logo: 'https://ui-avatars.com/api/?name=Palmeraie&background=047857&color=ECFDF5&size=200&font-size=0.4&bold=true' },
        { nom: 'Al Omrane', villeId: cities[1].id, categorieId: categories[4].id, contact: 'contact@alomrane.gov.ma', description: 'Le grand aménageur public pour l\'habitat et les lots de terrain équipés.', logo: 'https://ui-avatars.com/api/?name=Al+Omrane&background=34D399&color=064e3b&size=200&font-size=0.4&bold=true' },
        { nom: 'Yasmine Immobilier', villeId: cities[0].id, categorieId: categories[1].id, contact: 'info@yasmine-immo.com', description: 'Reconnu pour ses tours végétalisées et ses résidences avant-gardistes.', logo: 'https://ui-avatars.com/api/?name=Yasmine&background=10B981&color=ffffff&size=200&font-size=0.4&bold=true' },
        { nom: 'KLK Khayatey Living', villeId: cities[0].id, categorieId: categories[1].id, contact: 'sales@klk.ma', description: 'Créateur d\'espaces de vie urbains modernes sur Casablanca.', logo: 'https://ui-avatars.com/api/?name=KLK&background=3BE8B0&color=0A1F18&size=200&font-size=0.4&bold=true' },
        { nom: 'Walili Immobilier', villeId: cities[5].id, categorieId: categories[0].id, contact: 'contact@walili.ma', description: 'Promoteur de référence dans la création de complexes résidentiels fermés.', logo: 'https://ui-avatars.com/api/?name=Walili&background=0A1F18&color=3BE8B0&size=200&font-size=0.4&bold=true' },
        { nom: 'Asma Invest', villeId: cities[0].id, categorieId: categories[3].id, contact: 'info@asmainvest.ma', description: 'Société maroco-saoudienne pour l\'investissement et le développement immobilier professionnel.', logo: 'https://ui-avatars.com/api/?name=Asma&background=059669&color=ffffff&size=200&font-size=0.4&bold=true' },
        { nom: 'Chaabi Lil Iskane', villeId: cities[0].id, categorieId: categories[6].id, contact: 'commercial@chaabi.ma', description: 'Opérateur historique du logement pour tous au Maroc (Groupe Ynna).', logo: 'https://ui-avatars.com/api/?name=Chaabi&background=D1FAE5&color=064e3b&size=200&font-size=0.4&bold=true' },
        { nom: 'Kettani Immobilier', villeId: cities[0].id, categorieId: categories[1].id, contact: 'ventes@kettani.ma', description: 'Savoir-faire et expertise dans le développement de résidences haut de gamme au centre de Casa.', logo: 'https://ui-avatars.com/api/?name=Kettani&background=10B981&color=ffffff&size=200&font-size=0.4&bold=true' },
        { nom: 'Casanearshore Park', villeId: cities[0].id, categorieId: categories[3].id, contact: 'contact@medz.ma', description: 'Développeur et gestionnaire de plateaux bureaux pour professionnels de la tech.', logo: 'https://ui-avatars.com/api/?name=Casa+Nearshore&background=047857&color=D1FAE5&size=200&font-size=0.4&bold=true' },
        { nom: 'Marina Agadir', villeId: cities[4].id, categorieId: categories[2].id, contact: 'marina@agadir.ma', description: 'Promotions balnéaires luxueuses avec vue sur océan et marina.', logo: 'https://ui-avatars.com/api/?name=Marina&background=0A1F18&color=3BE8B0&size=200&font-size=0.4&bold=true' },
        { nom: 'Tanger City Center', villeId: cities[3].id, categorieId: categories[5].id, contact: 'info@tangercc.ma', description: 'Immobilier multifonctions : résidentiel, hôtels et mall à la corniche de Tanger.', logo: 'https://ui-avatars.com/api/?name=Tanger+City&background=34D399&color=064e3b&size=200&font-size=0.4&bold=true' },
        { nom: 'Prestige Villas', villeId: cities[2].id, categorieId: categories[0].id, contact: 'premium@prestigevillas.ma', description: 'Conception de villas d\'exception sur mesure à Marrakech.', logo: 'https://ui-avatars.com/api/?name=Prestige&background=10B981&color=ffffff&size=200&font-size=0.4&bold=true' },
        { nom: 'Foncière Chellah', villeId: cities[1].id, categorieId: categories[3].id, contact: 'locatif@chellah.ma', description: 'Acteur majeur de l\'immobilier tertiaire locatif et de bureaux premium.', logo: 'https://ui-avatars.com/api/?name=Fonciere+Chellah&background=064e3b&color=3BE8B0&size=200&font-size=0.4&bold=true' },
        { nom: 'Ametys', villeId: cities[0].id, categorieId: categories[1].id, contact: 'commercial@ametys.ma', description: 'Projets résidentiels qualitatifs dans les régions émergentes de Bouskoura / Dar Bouazza.', logo: 'https://ui-avatars.com/api/?name=Ametys&background=3BE8B0&color=0A1F18&size=200&font-size=0.4&bold=true' },
        { nom: 'Dakhla Ocean Bay', villeId: cities[7].id, categorieId: categories[2].id, contact: 'invest@dakhlaob.ma', description: 'Promotion de résidences de vacances et resorts au cœur de la péninsule de Dakhla.', logo: 'https://ui-avatars.com/api/?name=Dakhla+Ocean&background=047857&color=ffffff&size=200&font-size=0.4&bold=true' },
        { nom: 'A.R.B Promoteurs', villeId: cities[0].id, categorieId: categories[1].id, contact: 'sales@arb.ma', description: 'Créateurs d\'immeubles de très haut standing dans le triangle d\'or casablancais.', logo: 'https://ui-avatars.com/api/?name=ARB&background=ffffff&color=064e3b&size=200&font-size=0.4&bold=true' },
    ]

    const promoters = []
    for (const data of promotersData) {
        const promoter = await prisma.promoter.create({ data })
        promoters.push(promoter)
    }
    console.log(`Created ${promoters.length} promoters`)

    // 5. Create Projects (2 for each promoter -> 40 projects)
    const local360Images = [
        '/360/shot-panoramic-composition-bathroom.jpg',
        '/360/shot-panoramic-composition-bedroom (1).jpg',
        '/360/shot-panoramic-composition-bedroom (2).jpg',
        '/360/shot-panoramic-composition-bedroom.jpg',
        '/360/shot-panoramic-composition-kitchen.jpg',
        '/360/shot-panoramic-composition-living-room (1).jpg',
        '/360/shot-panoramic-composition-living-room (2).jpg',
        '/360/shot-panoramic-composition-living-room.jpg'
    ];

    const projectsData: any[] = []
    for (const promoter of promoters) {
        projectsData.push({
            nom: `Résidence Majorelle - ${promoter.nom}`,
            promoterId: promoter.id,
            localisation: 'Quartier Premium',
            surface: Math.floor(Math.random() * 500) + 100, // Surface appart/villa
            statut: 'En cours',
            description: `Un projet résidentiel majeur par ${promoter.nom}. Une architecture raffinée offrant des espaces de vie lumineux et des finitions en marbre de première qualité.`,
            image360: local360Images[Math.floor(Math.random() * local360Images.length)]
        })
        projectsData.push({
            nom: `Les Jardins de l'Atlas - Phase 2`,
            promoterId: promoter.id,
            localisation: 'Périphérie Chic',
            surface: Math.floor(Math.random() * 800) + 300,
            statut: 'Livré',
            description: `Complexe fermé livré avec succès incluant piscines communes, club house, et sécurité 24/7. Excellence signée ${promoter.nom}.`,
            image360: local360Images[Math.floor(Math.random() * local360Images.length)]
        })
    }

    for (const proj of projectsData) {
        await prisma.project.create({ data: proj })
    }
    console.log(`Created ${projectsData.length} projects`)

    console.log('Database successfully seeded!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
