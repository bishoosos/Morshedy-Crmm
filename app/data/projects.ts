export interface PaymentSystem {
  name: string;
  downPayment: number;
  secondPayment?: number;
  maintenance?: number;
  years: number;
  discount: number;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  minArea: number;
  maxArea: number;
  defaultPrice: number;
  monthlyRatio: number;
  yearlyRatio: number;
  defaultDiscount: number;
  cashDiscount: number;
  delivery: string;
  paymentSystems: PaymentSystem[];
}

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'zahra',
    name: 'زهرة (Zahra North Coast)',
    location: 'الساحل الشمالي',
    minArea: 26,
    maxArea: 255,
    defaultPrice: 94500,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 5,
    cashDiscount: 35,
    delivery: 'استلام فوري / دفعات متغيرة',
    paymentSystems: [
      { name: 'شاليهات Cape / Zone 2 (استلام فوري)', downPayment: 5, secondPayment: 10, maintenance: 10, years: 6, discount: 5 },
      { name: 'زونات 1&4&5&6 (استلام فوري)', downPayment: 5, secondPayment: 10, maintenance: 10, years: 7, discount: 10 },
      { name: 'Down Town 1&2 (غير جاهزة)', downPayment: 5, secondPayment: 20, maintenance: 10, years: 7, discount: 5 },
      { name: 'Zone 9 Azul', downPayment: 5, secondPayment: 10, maintenance: 10, years: 6, discount: 5 },
      { name: 'Sandro / Vida (توين / تاون / دوبلكس)', downPayment: 5, secondPayment: 20, maintenance: 10, years: 7, discount: 5 }
    ]
  },
  {
    id: 'one_katameya',
    name: 'وان قطامية (One Katameya)',
    location: 'القطامية',
    minArea: 60,
    maxArea: 249,
    defaultPrice: 67400,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 5,
    cashDiscount: 45,
    delivery: 'استلام فوري (اسكن وقسط)',
    paymentSystems: [
      { name: 'استلام فوري (الأدوار المتكررة)', downPayment: 15, secondPayment: 0, maintenance: 10, years: 6, discount: 5 },
      { name: 'الدور الأول (سعر المتر 72,700 ج)', downPayment: 15, secondPayment: 0, maintenance: 10, years: 4.5, discount: 5 },
      { name: 'الأرضي والمنخفض برج O212', downPayment: 15, secondPayment: 0, maintenance: 10, years: 5, discount: 5 },
      { name: 'وحدات C1105 / C1107', downPayment: 30, secondPayment: 0, maintenance: 10, years: 6, discount: 5 }
    ]
  },
  {
    id: 'degla_landmarks',
    name: 'دجلة لاند مارك (Degla Landmarks)',
    location: 'مدينة نصر',
    minArea: 47,
    maxArea: 370,
    defaultPrice: 52800,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 3,
    cashDiscount: 35,
    delivery: 'استلام فوري / 2-3 سنوات',
    paymentSystems: [
      { name: 'استلام فوري (أدوار متكررة 2-11)', downPayment: 10, secondPayment: 5, maintenance: 10, years: 8, discount: 3 },
      { name: 'الأرضي والمتكرر برج 11 الحربي', downPayment: 15, secondPayment: 0, maintenance: 10, years: 6, discount: 5 },
      { name: 'برج 13 الدور الأول النصف الأمامي', downPayment: 5, secondPayment: 20, maintenance: 10, years: 8, discount: 5 },
      { name: 'أبراج 11 و12 (متكرر والأول)', downPayment: 5, secondPayment: 20, maintenance: 10, years: 8, discount: 3 }
    ]
  },
  {
    id: 'lake_front',
    name: 'ليك فرونت (Lake Front)',
    location: '6 أكتوبر',
    minArea: 109,
    maxArea: 344,
    defaultPrice: 53000,
    monthlyRatio: 20,
    yearlyRatio: 80,
    defaultDiscount: 3,
    cashDiscount: 35,
    delivery: 'جاهز استلام فوري / خلال سنة لسنتين',
    paymentSystems: [
      { name: 'استلام فوري جاهز', downPayment: 10, secondPayment: 0, maintenance: 10, years: 6, discount: 3 },
      { name: 'عرض برج H23 (سعر المتر 42,000 ج)', downPayment: 10, secondPayment: 0, maintenance: 10, years: 7, discount: 7 },
      { name: 'عرض وحدات أرضي حتي 5 (سعر المتر 43,300 ج)', downPayment: 10, secondPayment: 0, maintenance: 10, years: 7, discount: 7 },
      { name: 'استلام غير جاهز (سنتين)', downPayment: 5, secondPayment: 20, maintenance: 10, years: 8, discount: 3 }
    ]
  },
  {
    id: 'sky_line',
    name: 'سكاي لاين (Sky Line)',
    location: 'القطامية',
    minArea: 40,
    maxArea: 165,
    defaultPrice: 57800,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 3,
    cashDiscount: 35,
    delivery: 'تسليم 3.5 سنة',
    paymentSystems: [
      { name: 'مساحات أقل من 105م', downPayment: 5, secondPayment: 25, maintenance: 10, years: 10, discount: 3 },
      { name: 'مساحات من 105م فأعلى', downPayment: 5, secondPayment: 25, maintenance: 10, years: 12, discount: 4 }
    ]
  },
  {
    id: 'bavaria_town',
    name: 'بافاريا تاون (Bavaria Town)',
    location: 'المعادي / الدائري',
    minArea: 34,
    maxArea: 230,
    defaultPrice: 47800,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 5,
    cashDiscount: 50,
    delivery: 'استلام فوري',
    paymentSystems: [
      { name: 'نظام التقسيط الأساسي', downPayment: 15, secondPayment: 0, maintenance: 10, years: 6, discount: 5 }
    ]
  },
  {
    id: 'reyana_plaza',
    name: 'ريحانة بلازا (Rayana Plaza)',
    location: 'المعادي',
    minArea: 102,
    maxArea: 207,
    defaultPrice: 64900,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 5,
    cashDiscount: 35,
    delivery: 'فوري / 3 شهور / 6 شهور',
    paymentSystems: [
      { name: 'Section A-F-G (استلام فوري)', downPayment: 10, secondPayment: 0, maintenance: 10, years: 10, discount: 5 },
      { name: 'Section E-B-H (استلام بعد 6 شهور)', downPayment: 5, secondPayment: 5, maintenance: 10, years: 10, discount: 5 },
      { name: 'Section C-D (استلام بعد 3 شهور)', downPayment: 5, secondPayment: 5, maintenance: 10, years: 10, discount: 5 }
    ]
  },
  {
    id: 'reyana_avenue',
    name: 'ريحانة افينيو (Rayana Avenue)',
    location: 'المعادي',
    minArea: 73,
    maxArea: 207,
    defaultPrice: 71800,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 5,
    cashDiscount: 35,
    delivery: 'استلام فوري',
    paymentSystems: [
      { name: 'استلام فوري دور متكرر وأول', downPayment: 10, secondPayment: 0, maintenance: 10, years: 9, discount: 5 }
    ]
  },
  {
    id: 'reyana_residence',
    name: 'ريحانة ريزيدانس (Rayana Residence)',
    location: 'المعادي',
    minArea: 169,
    maxArea: 300,
    defaultPrice: 45600,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 7,
    cashDiscount: 35,
    delivery: 'استلام فوري',
    paymentSystems: [
      { name: 'تقسيط 9 سنوات', downPayment: 10, secondPayment: 0, maintenance: 10, years: 9, discount: 7 }
    ]
  },
  {
    id: 'grand_gate',
    name: 'جراند جيت (Grand Gate)',
    location: 'المعادي',
    minArea: 80,
    maxArea: 205,
    defaultPrice: 67400,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 5,
    cashDiscount: 45,
    delivery: 'استلام فوري',
    paymentSystems: [
      { name: 'استلام فوري A2 & A3', downPayment: 10, secondPayment: 0, maintenance: 10, years: 10, discount: 5 }
    ]
  },
  {
    id: 'degla_view',
    name: 'دجلة فيو (Degla View)',
    location: 'المعادي',
    minArea: 102,
    maxArea: 290,
    defaultPrice: 44000,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 7,
    cashDiscount: 35,
    delivery: 'استلام فوري',
    paymentSystems: [
      { name: 'تقسيط 9 سنوات', downPayment: 10, secondPayment: 0, maintenance: 10, years: 9, discount: 7 }
    ]
  },
  {
    id: 'crystal_plaza',
    name: 'كريستال بالزا (Crystal Plaza)',
    location: 'المعادي',
    minArea: 70,
    maxArea: 300,
    defaultPrice: 47800,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 5,
    cashDiscount: 45,
    delivery: 'استلام فوري',
    paymentSystems: [
      { name: 'تقسيط 9 سنوات (مساحات > 200م خصم 7%)', downPayment: 10, secondPayment: 0, maintenance: 10, years: 9, discount: 5 }
    ]
  },
  {
    id: 'west_courts',
    name: 'ويست كورتس (West Courts)',
    location: '6 أكتوبر',
    minArea: 60,
    maxArea: 130,
    defaultPrice: 48600,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 0,
    cashDiscount: 35,
    delivery: '4 سنوات',
    paymentSystems: [
      { name: 'تقسيط 12 سنة بدون خصم', downPayment: 5, secondPayment: 20, maintenance: 10, years: 12, discount: 0 },
      { name: 'تقسيط 10 سنوات بدون خصم', downPayment: 5, secondPayment: 20, maintenance: 10, years: 10, discount: 0 },
      { name: 'استلام فوري (تقسيط 8 سنوات)', downPayment: 10, secondPayment: 0, maintenance: 10, years: 8, discount: 7 }
    ]
  },
  {
    id: 'degla_towers',
    name: 'دجلة تاورز (Degla Towers)',
    location: 'مدينة نصر',
    minArea: 49,
    maxArea: 165,
    defaultPrice: 58000,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 5,
    cashDiscount: 35,
    delivery: 'استلام فوري',
    paymentSystems: [
      { name: 'استلام فوري برج DT حمام السباحة', downPayment: 10, secondPayment: 0, maintenance: 10, years: 9, discount: 5 }
    ]
  },
  {
    id: 'katameya_gate',
    name: 'قطامية جيت (Katameya Gate)',
    location: 'القطامية',
    minArea: 39,
    maxArea: 156,
    defaultPrice: 57800,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 5,
    cashDiscount: 35,
    delivery: 'استلام فوري',
    paymentSystems: [
      { name: 'استلام فوري تقسيط 6 سنوات', downPayment: 10, secondPayment: 0, maintenance: 10, years: 6, discount: 3 },
      { name: 'برج الفيروز (32,300 ج للمتر)', downPayment: 20, secondPayment: 20, maintenance: 10, years: 5, discount: 5 }
    ]
  },
  {
    id: 'grand_city',
    name: 'جراند سيتي (Grand City)',
    location: 'المعادي',
    minArea: 50,
    maxArea: 200,
    defaultPrice: 51100,
    monthlyRatio: 30,
    yearlyRatio: 70,
    defaultDiscount: 5,
    cashDiscount: 45,
    delivery: 'استلام فوري',
    paymentSystems: [
      { name: 'استلام فوري الدور الأول السكني', downPayment: 10, secondPayment: 0, maintenance: 10, years: 9, discount: 5 },
      { name: 'عرض الدور الثاني عشر (تقسيط 3 سنوات)', downPayment: 10, secondPayment: 0, maintenance: 10, years: 3, discount: 30 }
    ]
  },
  {
    id: 'degla_palms',
    name: 'دجلة بالمز وجاردنز (Degla Palms)',
    location: '6 أكتوبر',
    minArea: 35,
    maxArea: 160,
    defaultPrice: 32300,
    monthlyRatio: 20,
    yearlyRatio: 80,
    defaultDiscount: 0,
    cashDiscount: 50,
    delivery: 'استلام فوري / 3 شهور',
    paymentSystems: [
      { name: 'اسكن وقسط (50% مقدم + سنتين)', downPayment: 50, secondPayment: 0, maintenance: 10, years: 2, discount: 0 },
      { name: 'رووف مرحلة ثالثة دور 4 (تراس)', downPayment: 5, secondPayment: 5, maintenance: 10, years: 5, discount: 0 },
      { name: 'وحدات بالمز (10% مقدم + 8 سنوات)', downPayment: 10, secondPayment: 0, maintenance: 10, years: 8, discount: 0 }
    ]
  }
];