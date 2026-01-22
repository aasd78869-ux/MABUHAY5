
import React from 'react';
import { Attraction, Language, SiteData, AboutPHContent } from './types';

export const INITIAL_TRANSLATIONS: Record<string, Record<Language, string>> = {
  navHome: { AR: 'الرئيسية', EN: 'Home', PH: 'Home' },
  navIslands: { AR: 'الجزر السياحية', EN: 'Islands', PH: 'Mga Isla' },
  navManila: { AR: 'أحياء مانيلا', EN: 'Manila Districts', PH: 'Maynila' },
  navShopping: { AR: 'التسوق والمولات', EN: 'Shopping', PH: 'Pamimili' },
  navDining: { AR: 'مطاعم عربية', EN: 'Dining', PH: 'Kainan' },
  navActivities: { AR: 'الفعاليات والأنشطة', EN: 'Activities', PH: 'Aktibidad' },
  navTravelInfo: { AR: 'دليل المسافر', EN: 'Travel Info', PH: 'Impormasyon' },
  navBook: { AR: 'احجز الآن', EN: 'Book Now', PH: 'Mag-book' },
  navVisa: { AR: 'أمور الفيزا للفلبين', EN: 'Visa Guide', PH: 'Visa' },
  navAboutPH: { AR: 'عن الفلبين', EN: 'About PH', PH: 'Tungkol sa PH' },
};

export const VISA_DATA = [
  {
    category: { AR: 'أنواع الفيزا', EN: 'Visa Types' },
    items: [
      {
        title: { AR: 'فيزا سياحية (9A)', EN: 'Tourist Visa (9A)' },
        details: { AR: 'للزيارات القصيرة، السياحة، أو زيارة الأقارب. تمنح عادة لمدة 30 إلى 59 يوماً.', EN: 'For short stays, tourism, or visiting relatives. Usually granted for 30-59 days.' }
      },
      {
        title: { AR: 'فيزا عمل (9G)', EN: 'Work Visa (9G)' },
        details: { AR: 'مخصصة للأجانب الذين يعتزمون التوظيف في شركات مسجلة في الفلبين.', EN: 'For foreigners intended for employment in registered PH companies.' }
      },
      {
        title: { AR: 'فيزا دراسة (9F)', EN: 'Student Visa (9F)' },
        details: { AR: 'للطلاب المسجلين في جامعات أو معاهد تعليمية معترف بها في الفلبين.', EN: 'For students enrolled in recognized PH universities or institutes.' }
      },
      {
        title: { AR: 'فيزا إقامة طويلة (SRRV)', EN: 'Special Resident Retiree\'s Visa (SRRV)' },
        details: { AR: 'برنامج للمتقاعدين يتيح الإقامة الدائمة بمزايا متعددة.', EN: 'Retirement program allowing permanent residency with multiple benefits.' }
      }
    ]
  },
  {
    category: { AR: 'المتطلبات العامة', EN: 'General Requirements' },
    items: [
      {
        title: { AR: 'جواز السفر', EN: 'Passport' },
        details: { AR: 'يجب أن يكون صالحاً لمدة 6 أشهر على الأقل من تاريخ الدخول.', EN: 'Must be valid for at least 6 months from entry date.' }
      },
      {
        title: { AR: 'الصور الشخصية', EN: 'Photos' },
        details: { AR: 'صورتان حديثتان بخلفية بيضاء (حجم جواز السفر).', EN: 'Two recent white background photos (passport size).' }
      },
      {
        title: { AR: 'نموذج الطلب', EN: 'Application Form' },
        details: { AR: 'تعبئة النموذج الخاص بالسفارة بدقة وتوقيعه.', EN: 'Complete embassy form accurately and sign it.' }
      },
      {
        title: { AR: 'إثبات مالي', EN: 'Financial Proof' },
        details: { AR: 'كشف حساب بنكي لآخر 3-6 أشهر أو شهادة راتب.', EN: 'Bank statement for last 3-6 months or salary certificate.' }
      }
    ]
  },
  {
    category: { AR: 'إجراءات التقديم', EN: 'Application Procedures' },
    items: [
      {
        title: { AR: 'عبر السفارة أو القنصلية', EN: 'Via Embassy or Consulate' },
        details: { AR: 'التقديم يدوياً في بلد الإقامة وحجز موعد مسبق.', EN: 'Apply manually in your country of residence by booking an appointment.' }
      },
      {
        title: { AR: 'التقديم الإلكتروني (e-Visa)', EN: 'Online e-Visa' },
        details: { AR: 'متوفر لبعض الجنسيات عبر الموقع الرسمي للحكومة الفلبينية.', EN: 'Available for some nationalities via the official government portal.' }
      }
    ]
  }
];

export const INITIAL_HERO_SLIDES = [
  {
    id: 'hero-1',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1920',
    title: { AR: 'إل نيدو: جنة البحيرات', EN: 'El Nido: Lagoon Paradise', PH: 'El Nido' },
    subtitle: { AR: 'استكشف أجمل البحيرات المخفية في جزيرة بالوان الساحرة.', EN: 'Discover the most stunning hidden lagoons in enchanting Palawan.', PH: 'Palawan.' }
  },
  {
    id: 'hero-2',
    image: 'https://images.unsplash.com/photo-1555620146-512038753177?q=80&w=1920',
    title: { AR: 'مانيلا: أفق المستقبل', EN: 'Manila: Future Skyline', PH: 'Maynila' },
    subtitle: { AR: 'استمتع بحياة الرفاهية في أرقى أحياء العاصمة مانيلا BGC.', EN: 'Experience luxury living in BGC, Manila\'s premier district.', PH: 'BGC.' }
  },
  {
    id: 'hero-3',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920',
    title: { AR: 'بوراكاي: الرمال البيضاء', EN: 'Boracay: Pure White Sands', PH: 'Boracay' },
    subtitle: { AR: 'استرخِ على رمال شاطئ وايت بيتش المصنف الأفضل عالمياً.', EN: 'Relax on the world-renowned sands of White Beach.', PH: 'Boracay.' }
  },
  {
    id: 'hero-4',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1920',
    title: { AR: 'كورون: مياه الكريستال', EN: 'Coron: Crystal Waters', PH: 'Coron' },
    subtitle: { AR: 'اكتشف أنقى البحيرات العذبة وسط منحدرات بالوان الكلسية.', EN: 'Discover the purest lakes amidst Palawan\'s limestone cliffs.', PH: 'Coron.' }
  },
  {
    id: 'hero-5',
    image: 'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=1920',
    title: { AR: 'ماكاتي: نبض الحياة', EN: 'Makati: Heartbeat of the City', PH: 'Makati' },
    subtitle: { AR: 'تسوق واسكن في المركز المالي العالمي النابض بالحياة.', EN: 'Shop and stay in the vibrant global financial center.', PH: 'Makati.' }
  }
];

export const INITIAL_ABOUT_PH: AboutPHContent = {
  id: 'main',
  title: { AR: 'اكتشف سحر الفلبين', EN: 'Discover the Magic of the Philippines', PH: 'Mabuhay Pilipinas' },
  description: { 
    AR: 'أرخبيل يضم أكثر من 7000 جزيرة، حيث تلتقي الطبيعة البكر بالضيافة الأسطورية والحداثة المتسارعة.', 
    EN: 'An archipelago of over 7,000 islands where pristine nature meets legendary hospitality and rapid modern growth.', 
    PH: 'Ang Pilipinas ay may higit sa 7,000 mga isla.' 
  },
  image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1920',
  sections: {
    geography: {
      AR: 'تتكون الفلبين من 7,641 جزيرة مقسمة إلى ثلاث مجموعات رئيسية: لوزون، فيساياس، ومينداناو. تشتهر بتنوع تضاريسها من الجبال البركانية مثل بركان مايون الشهير إلى الشواطئ الرملية البيضاء والبحيرات الكريستالية في بالوان.',
      EN: 'The Philippines consists of 7,641 islands divided into three main groups: Luzon, Visayas, and Mindanao. It is famous for its diverse topography, from volcanic mountains like the iconic Mayon Volcano to white sand beaches and crystal-clear lagoons in Palawan.',
      PH: 'Ang Pilipinas ay binubuo ng 7,641 na mga isla.'
    },
    people: {
      AR: 'يُعرف الشعب الفلبيني بكونه واحداً من أكثر الشعوب ودوداً وضيافة في العالم. الابتسامة لا تفارق وجوههم، والترحيب بالغرباء جزء أصيل من ثقافتهم، مما يجعل المسافر يشعر وكأنه في منزله منذ اللحظة الأولى.',
      EN: 'The Filipino people are known as some of the friendliest and most hospitable in the world. Their smiles are constant, and welcoming strangers is a core part of their culture, making travelers feel at home from the very first moment.',
      PH: 'Ang mga Pilipino ay kilala sa kanilang pagiging masiyahin at mapagpatuloy.'
    },
    culture: {
      AR: 'ثقافة الفلبين هي مزيج فريد من التأثيرات الآسيوية والأوروبية والأمريكية. ينعكس ذلك في المهرجانات الملونة (Fiestas)، العمارة الاستعمارية الإسبانية، واللغة التي تحتوي على العديد من الكلمات المستعارة من الإسبانية.',
      EN: 'The culture of the Philippines is a unique blend of Asian, European, and American influences. This is reflected in vibrant festivals (Fiestas), Spanish colonial architecture, and a language rich with Spanish loanwords.',
      PH: 'Ang kultura ng Pilipinas ay makulay at puno ng tradisyon.'
    },
    modernity: {
      AR: 'تشهد الفلبين تحولاً حضرياً مذهلاً، خاصة في مانيلا. مناطق مثل BGC وماكاتي تمثل الوجه الحديث للدولة بنطحات سحابها، مراكز التسوق العملاقة، والمدن الذكية التي تنافس أرقى العواصم العالمية.',
      EN: 'The Philippines is experiencing a stunning urban transformation, especially in Manila. Districts like BGC and Makati represent the modern face of the country with skyscrapers, giant shopping malls, and smart cities that rival global capitals.',
      PH: 'Ang Maynila ay isang modernong siyudad na puno ng oportunidad.'
    },
    climate: {
      AR: 'مناخ استوائي دافئ طوال العام. الموسم الجاف من نوفمبر إلى مايو هو الأفضل للزيارة، حيث تكون السماء صافية والمياه مثالية للسباحة والغوص.',
      EN: 'A tropical climate that is warm all year round. The dry season from November to May is the best time to visit, with clear skies and waters perfect for swimming and diving.',
      PH: 'Mainit at tropikal ang klima sa Pilipinas.'
    },
    cuisine: {
      AR: 'المطبخ الفلبيني غني بالنكهات، من طبق "أدوبو" الشهير إلى "ليتشون" المقرمش. كما تتوفر خيارات حلال واسعة خاصة في المناطق السياحية والمطاعم العربية في مانيلا.',
      EN: 'Filipino cuisine is rich in flavors, from the famous "Adobo" to the crispy "Lechon." Wide halal options are also available, especially in tourist areas and Arabic restaurants in Manila.',
      PH: 'Masarap ang pagkaing Pilipino.'
    },
    tips: {
      AR: 'اللغة الإنجليزية منتشرة جداً مما يسهل التواصل. العملة هي البيزو الفلبيني، ويُنصح دائماً بحمل بعض النقد عند زيارة الجزر البعيدة.',
      EN: 'English is very widely spoken, making communication easy. The currency is the Philippine Peso, and it is always advised to carry some cash when visiting remote islands.',
      PH: 'Madaling makipag-usap sa mga Pilipino gamit ang Ingles.'
    },
    bestTime: {
      AR: 'ديسمبر إلى فبراير هو الوقت المثالي للاستمتاع بالطقس المعتدل والمهرجانات الشتوية الرائعة.',
      EN: 'December to February is the ideal time to enjoy the temperate weather and wonderful winter festivals.',
      PH: 'Magandang pumunta sa Pilipinas mula Disyembre hanggang Pebrero.'
    }
  },
  extraImages: [
    'https://images.unsplash.com/photo-1555620146-512038753177?q=80&w=1200',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1200'
  ]
};

export const DEFAULT_SITE_DATA: SiteData = {
  heroSlides: INITIAL_HERO_SLIDES,
  aboutPH: INITIAL_ABOUT_PH,
  islands: [
    {
        id: 'boracay',
        name: { AR: 'جزيرة بوراكاي (Boracay)', EN: 'Boracay Island', PH: 'Boracay' },
        description: { AR: 'أشهر جزيرة في الفلبين، تمتاز بالرمال البيضاء الناعمة والمياه الفيروزية الصافية والأنشطة الليلية الحيوية.', EN: 'Famous for its White Beach and powder-soft sand.', PH: 'Puting Buhangin.' },
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200',
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200',
          'https://images.unsplash.com/photo-1540202404-a2f29016bb5d?q=80&w=1200',
          'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=1200'
        ],
        location: { AR: 'أكلان (Aklan)', EN: 'Aklan', PH: 'Aklan' },
        bestFor: { AR: 'عائلات / عرسان', EN: 'Families/Couples', PH: 'Lahat' },
        category: 'ISLAND'
    },
    {
        id: 'palawan-elnido',
        name: { AR: 'إل نيدو (Palawan - El Nido)', EN: 'El Nido, Palawan', PH: 'El Nido' },
        description: { AR: 'جنة البحيرات المخفية والمنحدرات الكلسية المذهلة.', EN: 'The gateway to Bacuit Archipelago with stunning lagoons.', PH: 'Paraiso.' },
        images: [
          'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1200',
          'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1200',
          'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200'
        ],
        location: { AR: 'بالوان (Palawan)', EN: 'Palawan', PH: 'Palawan' },
        bestFor: { AR: 'عرسان / مغامرين', EN: 'Couples/Adventurers', PH: 'Maganda' },
        category: 'ISLAND'
    }
  ],
  manilaDistricts: [
    {
        id: 'bgc',
        name: { AR: 'بي جي سي (Bonifacio Global City)', EN: 'BGC', PH: 'BGC' },
        description: { AR: 'الحي الأكثر حداثة وتطوراً في مانيلا، يشبه المدن العالمية بشوارعه المنظمة وفنه العام.', EN: 'The most modern and walkable financial district in Metro Manila.', PH: 'BGC.' },
        images: [
            'https://images.unsplash.com/photo-1555620146-512038753177?q=80&w=1200',
            'https://images.unsplash.com/photo-1512411993201-94943f721d37?q=80&w=1200',
            'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?q=80&w=1200',
            'https://images.unsplash.com/photo-1583267746897-2cf415888172?q=80&w=1200'
        ],
        location: { AR: 'تاغويغ، مانيلا', EN: 'Taguig, Manila', PH: 'Taguig' },
        bestFor: { AR: 'سكن فاخر / عائلات', EN: 'Luxury / Families', PH: 'Lahat' },
        category: 'MANILA'
    },
    {
        id: 'makati',
        name: { AR: 'حي ماكاتي (Makati City)', EN: 'Makati', PH: 'Makati' },
        description: { AR: 'القلب النابض للاقتصاد، يضم ناطحات السحاب الفاخرة وأهم مراكز التسوق العالمية.', EN: 'The central business hub with luxury hotels and premium malls.', PH: 'Negosyo.' },
        images: [
            'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=1200',
            'https://images.unsplash.com/photo-1523473827533-2a64d0d36748?q=80&w=1200',
            'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=1200',
            'https://images.unsplash.com/photo-1567401767324-df359487c67c?q=80&w=1200'
        ],
        location: { AR: 'ماكاتي، مانيلا', EN: 'Makati, Manila', PH: 'Makati' },
        bestFor: { AR: 'تسوق / رجال أعمال', EN: 'Shopping / Business', PH: 'Negosyo' },
        category: 'MANILA'
    }
  ],
  shopping: [
    {
        id: 'sm-moa',
        name: { AR: 'إس إم مول أوف آسيا (SM MOA)', EN: 'SM Mall of Asia', PH: 'MOA' },
        description: { AR: 'من أكبر المولات في العالم، يضم صالة تزلج وإطلالة رائعة على خليج مانيلا.', EN: 'One of the largest malls in the world with a sunset view.', PH: 'Napakalaki.' },
        images: [
            'https://images.unsplash.com/photo-1540611025311-01df3cef54b5?q=80&w=1200',
            'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=1200',
            'https://images.unsplash.com/photo-1567401767324-df359487c67c?q=80&w=1200',
            'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1200'
        ],
        location: { AR: 'باساي، مانيلا', EN: 'Pasay', PH: 'Pasay' },
        bestFor: { AR: 'كل شيء / عائلات', EN: 'Everything / Families', PH: 'Lahat' },
        category: 'SHOPPING'
    }
  ],
  restaurants: [
    {
        id: 'shawarma-snack-center',
        name: { AR: 'شاورما سناك سنتر (SSC)', EN: 'Shawarma Snack Center', PH: 'SSC' },
        description: { AR: 'أقدم وأشهر مطعم عربي في مانيلا، يقدم أفضل الأطباق العربية التقليدية.', EN: 'Famous Arabic restaurant in Manila.', PH: 'Masarap.' },
        images: [
            'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=1200',
            'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1200',
            'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200',
            'https://images.unsplash.com/photo-1633964913295-ceb43826e799?q=80&w=1200'
        ],
        location: { AR: 'إرميتا، مانيلا', EN: 'Ermita, Manila', PH: 'Manila' },
        bestFor: { AR: 'طعام حلال / شاورما', EN: 'Halal Food', PH: 'Kainan' },
        category: 'RESTAURANT',
        halal: true
    }
  ],
  activities: [
    {
        id: 'act-boracay-hopping',
        name: { AR: 'جولة القوارب في بوراكاي (Island Hopping)', EN: 'Boracay Island Hopping', PH: 'Hopping' },
        description: { AR: 'استكشف أجمل شواطئ بوراكاي المخفية مع الغوص السطحي ووجبة غداء بحرية.', EN: 'Explore hidden beaches with snorkeling and seafood lunch.', PH: 'Maganda' },
        images: [
            'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1200',
            'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1200',
            'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200'
        ],
        location: { AR: 'جزيرة بوراكاي', EN: 'Boracay Island', PH: 'Aklan' },
        duration: { AR: '4 ساعات', EN: '4 Hours', PH: 'Oras' },
        level: { AR: 'هادئ', EN: 'Calm', PH: 'Madali' },
        bestFor: { AR: 'عائلات / عرسان / شباب', EN: 'Families/Couples/Youth', PH: 'Lahat' },
        category: 'ACTIVITY',
        subCategory: 'MARINE'
    }
  ],
  translations: INITIAL_TRANSLATIONS
};

export const ICONS = {
  Island: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/><path d="M12 8v4l3 3"/></svg>,
  Chat: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  // Fix: Removed redundant closing polygon tag that caused syntax errors for subsequent properties
  Filter: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
};
