import mongoose from 'mongoose';

// Sample data seeder for testing
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inzassa';

const sampleNews = [
  {
    title: {
      fr: "Le Sénégal accueille le Forum Économique Africain",
      en: "Senegal hosts African Economic Forum",
      es: "Senegal acoge el Foro Económico Africano",
      de: "Senegal richtet Afrikanisches Wirtschaftsforum aus",
      it: "Il Senegal ospita il Forum Economico Africano",
      ar: "السنغال تستضيف المنتدى الاقتصادي الأفريقي"
    },
    content: {
      fr: "Le Sénégal a accueilli cette semaine le prestigieux Forum Économique Africain, réunissant plus de 500 décideurs économiques du continent. L'événement a été marqué par des discussions sur l'innovation, le développement durable et les opportunités d'investissement en Afrique de l'Ouest.",
      en: "Senegal hosted this week the prestigious African Economic Forum, bringing together over 500 economic decision-makers from the continent. The event featured discussions on innovation, sustainable development, and investment opportunities in West Africa.",
      es: "Senegal acogió esta semana el prestigioso Foro Económico Africano, reuniendo a más de 500 tomadores de decisiones económicas del continente.",
      de: "Senegal war diese Woche Gastgeber des prestigeträchtigen Afrikanischen Wirtschaftsforums.",
      it: "Il Senegal ha ospitato questa settimana il prestigioso Forum Economico Africano.",
      ar: "استضافت السنغال هذا الأسبوع المنتدى الاقتصادي الأفريقي المرموق."
    },
    summary: {
      fr: "Plus de 500 décideurs économiques se sont réunis au Sénégal pour discuter de l'avenir économique de l'Afrique.",
      en: "Over 500 economic decision-makers gathered in Senegal to discuss Africa's economic future.",
      es: "Más de 500 tomadores de decisiones económicas se reunieron en Senegal.",
      de: "Über 500 Wirtschaftsentscheidungsträger trafen sich im Senegal.",
      it: "Oltre 500 decisori economici si sono riuniti in Senegal.",
      ar: "اجتمع أكثر من 500 صانع قرار اقتصادي في السنغال."
    },
    originalUrl: "https://example.com/news/senegal-economic-forum",
    country: "senegal",
    category: "economie",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
    featured: true,
    publishedAt: new Date('2024-10-20')
  },
  {
    title: {
      fr: "Victoire historique de l'équipe nationale du Cameroun",
      en: "Historic victory for Cameroon national team",
      es: "Victoria histórica del equipo nacional de Camerún",
      de: "Historischer Sieg der kamerunischen Nationalmannschaft",
      it: "Vittoria storica per la nazionale del Camerun",
      ar: "انتصار تاريخي للمنتخب الوطني الكاميروني"
    },
    content: {
      fr: "L'équipe nationale du Cameroun a remporté une victoire éclatante 3-0 face à son adversaire lors des qualifications pour la Coupe d'Afrique. Les Lions Indomptables ont impressionné par leur maîtrise technique et leur cohésion d'équipe.",
      en: "Cameroon's national team secured a resounding 3-0 victory against their opponent in the Africa Cup qualifiers.",
      es: "El equipo nacional de Camerún logró una victoria contundente de 3-0.",
      de: "Die kamerunische Nationalmannschaft erzielte einen überzeugenden 3:0-Sieg.",
      it: "La nazionale del Camerun ha ottenuto una vittoria schiacciante per 3-0.",
      ar: "حقق المنتخب الوطني الكاميروني فوزاً ساحقاً 3-0."
    },
    summary: {
      fr: "Les Lions Indomptables s'imposent 3-0 et se rapprochent de la qualification.",
      en: "The Indomitable Lions win 3-0 and move closer to qualification.",
      es: "Los Leones Indomables ganan 3-0.",
      de: "Die Unbezähmbaren Löwen gewinnen 3:0.",
      it: "I Leoni Indomabili vincono 3-0.",
      ar: "الأسود التي لا تقهر تفوز 3-0."
    },
    originalUrl: "https://example.com/news/cameroon-victory",
    country: "cameroon",
    category: "sport",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    featured: true,
    publishedAt: new Date('2024-10-22')
  },
  {
    title: {
      fr: "La Côte d'Ivoire lance un nouveau programme éducatif",
      en: "Ivory Coast launches new educational program",
      es: "Costa de Marfil lanza nuevo programa educativo",
      de: "Elfenbeinküste startet neues Bildungsprogramm",
      it: "La Costa d'Avorio lancia un nuovo programma educativo",
      ar: "ساحل العاج تطلق برنامجاً تعليمياً جديداً"
    },
    content: {
      fr: "Le gouvernement ivoirien a annoncé le lancement d'un programme éducatif ambitieux visant à améliorer l'accès à l'éducation numérique dans les zones rurales. Plus de 10 000 tablettes seront distribuées aux écoles.",
      en: "The Ivorian government announced the launch of an ambitious educational program.",
      es: "El gobierno de Costa de Marfil anunció el lanzamiento de un programa educativo ambicioso.",
      de: "Die ivorische Regierung kündigte den Start eines ehrgeizigen Bildungsprogramms an.",
      it: "Il governo ivoriano ha annunciato il lancio di un programma educativo ambizioso.",
      ar: "أعلنت حكومة ساحل العاج عن إطلاق برنامج تعليمي طموح."
    },
    summary: {
      fr: "10 000 tablettes pour l'éducation numérique en zones rurales.",
      en: "10,000 tablets for digital education in rural areas.",
      es: "10,000 tabletas para educación digital en zonas rurales.",
      de: "10.000 Tablets für digitale Bildung in ländlichen Gebieten.",
      it: "10.000 tablet per l'istruzione digitale nelle zone rurali.",
      ar: "10,000 جهاز لوحي للتعليم الرقمي في المناطق الريفية."
    },
    originalUrl: "https://example.com/news/cote-ivoire-education",
    country: "cote-ivoire",
    category: "societe",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    featured: false,
    publishedAt: new Date('2024-10-23')
  }
];

const sampleBooks = [
  {
    title: "Une si longue lettre",
    author: "Mariama Bâ",
    summary: {
      fr: "Roman épistolaire qui raconte l'histoire de Ramatoulaye, une femme sénégalaise qui écrit à son amie après le décès de son mari. L'œuvre explore les thèmes de la polygamie, de l'émancipation féminine et des traditions africaines.",
      en: "Epistolary novel that tells the story of Ramatoulaye, a Senegalese woman writing to her friend after her husband's death. The work explores themes of polygamy, women's emancipation and African traditions.",
      es: "Novela epistolar que cuenta la historia de Ramatoulaye, una mujer senegalesa.",
      de: "Briefroman über Ramatoulaye, eine senegalesische Frau.",
      it: "Romanzo epistolare sulla storia di Ramatoulaye.",
      ar: "رواية رسائلية تحكي قصة رماتولاي، امرأة سنغالية."
    },
    country: "senegal",
    publishedYear: 1979,
    genre: "Roman",
    featured: true
  },
  {
    title: "Les Soleils des indépendances",
    author: "Ahmadou Kourouma",
    summary: {
      fr: "Premier roman d'Ahmadou Kourouma, cette œuvre décrit le déclin d'un prince Malinké dans l'Afrique post-coloniale. Un chef-d'œuvre qui critique les déceptions de l'indépendance africaine.",
      en: "Kourouma's first novel describes the decline of a Malinke prince in post-colonial Africa.",
      es: "Primera novela de Kourouma sobre un príncipe Malinke.",
      de: "Kouroumas erster Roman über einen Malinke-Prinzen.",
      it: "Primo romanzo di Kourouma su un principe Malinke.",
      ar: "رواية كورووما الأولى عن أمير مالينكي."
    },
    country: "cote-ivoire",
    publishedYear: 1968,
    genre: "Roman",
    featured: true
  },
  {
    title: "Le Fils du pauvre",
    author: "Mouloud Feraoun",
    summary: {
      fr: "Récit autobiographique qui retrace l'enfance de l'auteur en Kabylie. Une œuvre poignante sur l'éducation, la pauvreté et l'aspiration à un avenir meilleur dans l'Algérie coloniale.",
      en: "Autobiographical narrative tracing the author's childhood in Kabylia.",
      es: "Narración autobiográfica sobre la infancia del autor en Cabilia.",
      de: "Autobiographische Erzählung über die Kindheit des Autors in der Kabylei.",
      it: "Racconto autobiografico sull'infanzia dell'autore in Cabilia.",
      ar: "رواية سيرة ذاتية عن طفولة الكاتب في منطقة القبائل."
    },
    country: "algeria",
    publishedYear: 1950,
    genre: "Autobiographie",
    featured: true
  }
];

const sampleCountries = [
  {
    name: "Sénégal",
    code: "senegal",
    description: {
      fr: "Le Sénégal est un pays d'Afrique de l'Ouest, bordé par l'océan Atlantique. Connu pour sa stabilité politique et sa riche culture, le pays est un carrefour important de l'Afrique francophone.",
      en: "Senegal is a West African country bordered by the Atlantic Ocean. Known for its political stability and rich culture, the country is an important crossroads of Francophone Africa.",
      es: "Senegal es un país de África Occidental bordeado por el Océano Atlántico.",
      de: "Senegal ist ein westafrikanisches Land am Atlantischen Ozean.",
      it: "Il Senegal è un paese dell'Africa occidentale affacciato sull'Oceano Atlantico.",
      ar: "السنغال بلد في غرب أفريقيا يطل على المحيط الأطلسي."
    },
    capital: "Dakar",
    population: 17196308,
    languages: ["Français", "Wolof", "Pulaar", "Serer"],
    currency: "Franc CFA (XOF)",
    geography: {
      fr: "Situé à l'extrême ouest du continent africain, le Sénégal s'étend sur 196 722 km². Le pays possède 700 km de côtes atlantiques.",
      en: "Located at the westernmost point of the African continent, Senegal covers 196,722 km².",
      es: "Ubicado en el punto más occidental del continente africano.",
      de: "Am westlichsten Punkt des afrikanischen Kontinents gelegen.",
      it: "Situato nel punto più occidentale del continente africano.",
      ar: "يقع في أقصى نقطة غرب القارة الأفريقية."
    },
    economy: {
      fr: "L'économie sénégalaise repose principalement sur l'agriculture, la pêche et les services. Le tourisme et les mines (phosphates) contribuent également significativement au PIB.",
      en: "The Senegalese economy is mainly based on agriculture, fishing and services.",
      es: "La economía senegalesa se basa principalmente en la agricultura.",
      de: "Die senegalesische Wirtschaft basiert hauptsächlich auf Landwirtschaft.",
      it: "L'economia senegalese si basa principalmente sull'agricoltura.",
      ar: "يعتمد الاقتصاد السنغالي بشكل أساسي على الزراعة."
    },
    culture: {
      fr: "Le Sénégal est réputé pour sa musique (mbalax), sa cuisine (thiéboudienne) et son hospitalité légendaire, résumée par la teranga.",
      en: "Senegal is renowned for its music (mbalax), cuisine (thiéboudienne) and legendary hospitality.",
      es: "Senegal es conocido por su música y cocina.",
      de: "Senegal ist bekannt für seine Musik und Küche.",
      it: "Il Senegal è rinomato per la sua musica e cucina.",
      ar: "تشتهر السنغال بموسيقاها ومأكولاتها."
    },
    featured: true
  },
  {
    name: "Cameroun",
    code: "cameroon",
    description: {
      fr: "Le Cameroun, surnommé 'l'Afrique en miniature', est un pays d'Afrique centrale qui présente une grande diversité géographique, culturelle et linguistique.",
      en: "Cameroon, nicknamed 'Africa in miniature', is a Central African country with great geographical, cultural and linguistic diversity.",
      es: "Camerún, apodado 'África en miniatura', es un país de África Central.",
      de: "Kamerun, genannt 'Afrika im Kleinformat', ist ein zentralafrikanisches Land.",
      it: "Il Camerun, soprannominato 'Africa in miniatura', è un paese dell'Africa centrale.",
      ar: "الكاميرون، الملقب بـ 'أفريقيا المصغرة'، بلد في وسط أفريقيا."
    },
    capital: "Yaoundé",
    population: 27198628,
    languages: ["Français", "Anglais"],
    currency: "Franc CFA (XAF)",
    geography: {
      fr: "D'une superficie de 475 442 km², le Cameroun s'étend des côtes du golfe de Guinée aux rives du lac Tchad.",
      en: "Covering an area of 475,442 km², Cameroon extends from the coasts of the Gulf of Guinea.",
      es: "Con una superficie de 475,442 km².",
      de: "Mit einer Fläche von 475.442 km².",
      it: "Con una superficie di 475.442 km².",
      ar: "تبلغ مساحتها 475,442 كم²."
    },
    featured: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import models
    const NewsSchema = new mongoose.Schema({
      title: { type: Map, of: String },
      content: { type: Map, of: String },
      summary: { type: Map, of: String },
      originalUrl: String,
      country: String,
      category: String,
      imageUrl: String,
      publishedAt: Date,
      featured: Boolean
    });

    const BookSchema = new mongoose.Schema({
      title: String,
      author: String,
      summary: { type: Map, of: String },
      country: String,
      publishedYear: Number,
      genre: String,
      featured: Boolean
    });

    const CountrySchema = new mongoose.Schema({
      name: String,
      code: String,
      description: { type: Map, of: String },
      capital: String,
      population: Number,
      languages: [String],
      currency: String,
      geography: { type: Map, of: String },
      economy: { type: Map, of: String },
      culture: { type: Map, of: String },
      featured: Boolean
    });

    const News = mongoose.models.News || mongoose.model('News', NewsSchema);
    const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);
    const Country = mongoose.models.Country || mongoose.model('Country', CountrySchema);

    // Clear existing data
    await News.deleteMany({});
    await Book.deleteMany({});
    await Country.deleteMany({});

    // Insert sample data
    await News.insertMany(sampleNews);
    console.log('✅ News seeded');

    await Book.insertMany(sampleBooks);
    console.log('✅ Books seeded');

    await Country.insertMany(sampleCountries);
    console.log('✅ Countries seeded');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
