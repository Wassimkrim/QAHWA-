export type Lang = 'en' | 'fr' | 'ar';
export type SunPhase = 'morning' | 'noon' | 'golden' | 'evening';

export interface LocalizedText {
  en: string;
  fr: string;
  ar: string;
}

export interface DrinkPosterItem {
  id: string;
  menuCategoryId: string;
  title: LocalizedText;
  blurb: LocalizedText;
  image: string;
  /** 'tl' | 'tr' | 'bl' | 'br' slices an exact unaltered quadrant from the 2x2 kraft sheet */
  quadrant?: 'tl' | 'tr' | 'bl' | 'br';
  pegOffsetY: number; // px offset along the wavy rope
  tiltDeg: number;
}

export interface BlankKraftTagItem {
  id: string;
  menuCategoryId: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  tiltDeg: number;
  pegOffsetY: number;
}

export interface MenuItem {
  id: string;
  name: LocalizedText;
  note: LocalizedText;
  price: string; // Empty by default — never invent prices
  posterId?: string; // Links to a poster on The Line
}

export interface MenuCategory {
  id: string;
  label: LocalizedText;
  items: MenuItem[];
}

export interface SceneItem {
  id: string;
  title: LocalizedText;
  image: string;
  matchedPosterId: string;
  slipMood: LocalizedText;
}

export interface CeramicPiece {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  image: string;
}

export interface PolaroidItem {
  id: string;
  image: string;
  caption: LocalizedText;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export const VENUE_CONFIG = {
  brandName: 'QAHWA',
  handle: '@qahwathecoffee',
  instagramUrl: 'https://www.instagram.com/qahwathecoffee/',
  googleMapsUrl: 'https://maps.app.goo.gl/RpAznZCHjmahrZnF8',
  // Set an official Google Maps embed iframe URL below when ready;
  // if empty, VisitSection builds a keyless embed from mapQuery and falls back cleanly if unavailable.
  mapEmbedUrl: '',
  mapQuery: 'Qahwa The Coffee Hydra Algiers',
  address: {
    en: 'Rue Mohamed BAG, Hydra 16000, Algiers',
    fr: 'Rue Mohamed BAG, Hydra 16000, Alger',
    ar: 'شارع محمد باق، حيدرة 16000، الجزائر العاصمة',
  },
  plusCode: 'P2WQ+MH Hydra',
  // Toggleable Google Maps listing info chips (never presented as menu prices)
  visitChips: {
    delivery: true,
    driveThrough: true,
    typicalSpend: true,
  },
  // Handwritten "How to find us" lines — clearly marked placeholders until confirmed with the café
  landmarks: [
    {
      en: 'Add landmark direction 1 in content.ts (e.g. near …)',
      fr: 'Ajouter un repère 1 dans content.ts (ex. près de …)',
      ar: 'أضف وصف المعلم الأول في ملف الإعدادات (مثلاً: بالقرب من…)',
    },
    {
      en: 'Add landmark direction 2 in content.ts (e.g. corner across from …)',
      fr: 'Ajouter un repère 2 dans content.ts (ex. en face de …)',
      ar: 'أضف وصف المعلم الثاني في ملف الإعدادات (مثلاً: مقابل…)',
    },
  ],
  // TODO: WhatsApp number placeholder — leave empty until the café provides their official number
  whatsappNumber: '',
  whatsappUrl: '',
  timezone: 'Africa/Algiers',
  // TODO: Google currently lists "Closes 9:30 PM", while Instagram says 21:00.
  // Keep both values below; VisitSection displays hoursInstagram until the café confirms.
  hoursInstagram: {
    weekdayOpen: '08:00',
    weekdayClose: '21:00',
    fridayMorningOpen: '09:00',
    fridayMorningClose: '12:30',
    fridayAfternoonOpen: '14:30',
    fridayAfternoonClose: '21:00',
  },
  hoursGoogle: {
    closesLabel: {
      en: 'Closes 9:30 PM (on Google)',
      fr: 'Ferme à 21h30 (sur Google)',
      ar: 'يغلق ٢١:٣٠ (بحسب جوجل)',
    },
  },
  ambientAudioUrl: '', // Placeholder audio source; gentle WebAudio warmth runs if empty
  assets: {
    logoPng: '/assets/aistudio/718597196_18100132085133647_1931031191460707489_n.-removebg-preview_a0eb5dd5.png',
    heroVideo: '/assets/aistudio/Coffee_pouring_into_ceramic_cup_aa75f190_e49f2518.mp4',
    ritualVideo: '/assets/aistudio/AQPA-QDVRak2Lj3cu8yFVl9StRJBR4oqiUD940YM8JUoiEO3hiromcDqPvhLvRLvpYub8-ypccTCAc6gLZ55sBZ58hGOD1Wb_6151cf69.mp4',
    // Photo A: Espresso cups (Used exclusively in Section 7 "The First Pour")
    photoAEspressoCups: '/assets/aistudio/Photo_A_is_the_espresso_cups_defe532d.jpg',
    // Photo B: Blend #2 bag stack (Reference for suede+leaf shadow & Section 8)
    photoBBlendBags: '/assets/aistudio/Photo_B_is_the_bag_stack_91b54d2d.jpg',
    quadKraftCards: '/assets/aistudio/686893576_18097221806133647_4997152541282475798_n._015e3501.jpg',
    icedDatesCard: '/assets/aistudio/687807067_18097221797133647_7188009607317114276_n._a788e4b7.jpg',
    spicedMatcha: '/assets/aistudio/680478870_18096049211133647_784787339826179194_n._c536e34a.jpg',
    dimpledCup: '/assets/aistudio/687721736_18098075114133647_1708833269242165109_n._cad42545.jpg',
    cocoaStencilCup: '/assets/aistudio/833701662_18112202711133647_5476413023168865656_n._99b46f5b.jpg',
    nicheShelves: '/assets/aistudio/784491384_18107987531133647_1996329865374714116_n._7c641551.jpg',
    interiorChess: '/assets/aistudio/784590250_18107987552133647_2756620713953839603_n._f4344437.jpg',
    storefrontWindow: '/assets/aistudio/736342958_18103287032133647_6843369650397827294_n._30ea960e.jpg',
    orangeVestStorefront: '/assets/aistudio/735734820_18103287020133647_7956094542789783746_n._20f3bf2a.jpg',
    redWallCap: '/assets/aistudio/788948727_18108501752133647_306899417334082700_n._14ba0054.jpg',
    blendPoster: '/assets/aistudio/912519755_18117351656133647_2520662836600483757_n._2da8a4bf.jpg',
    brookie: '/assets/aistudio/705127065_18098745149133647_8982043309285044186_n._bd34a53a.jpg',
    croissants: '/assets/aistudio/833198529_18112202702133647_1901568207171643991_n._26eb2244.jpg',
  },
};

/**
 * The 5 supplied kraft drink photos — displayed unaltered with their original titles and taste bars intact.
 */
export const DRINK_POSTERS: DrinkPosterItem[] = [
  {
    id: 'strawberry-hojicha',
    menuCategoryId: 'hojicha',
    title: { en: 'Strawberry Hojicha', fr: 'Hojicha Fraise', ar: 'هوجيتشا بالفراولة' },
    blurb: {
      en: 'Toasted Uji hojicha poured slowly over house strawberry compote and cold cream. Warm, comforting, and low-caffeine enough for golden hour.',
      fr: 'Hojicha torréfié versé lentement sur une compotée de fraises maison et crème froide. Doux, réconfortant et délicat pour la fin d’après-midi.',
      ar: 'هوجيتشا محمص يُسكب ببطء فوق مربى الفراولة المنزلي والكريمة الباردة. مذاق دافئ ومريح يناسب ساعات العصر.',
    },
    image: VENUE_CONFIG.assets.quadKraftCards,
    quadrant: 'tl',
    pegOffsetY: -6,
    tiltDeg: -2.4,
  },
  {
    id: 'yuzu-matcha-lemonade',
    menuCategoryId: 'matcha',
    title: { en: 'Yuzu Matcha Lemonade', fr: 'Citronnade Matcha Yuzu', ar: 'ليموناضة الماتشا واليوزو' },
    blurb: {
      en: 'First-harvest Kagoshima matcha whisked to order over sparkling yuzu and fresh lemon juice. Built for bright afternoons on the terrace.',
      fr: 'Matcha de Kagoshima fouetté minute sur du yuzu pétillant et jus de citron frais. Pensé pour les après-midis ensoleillés.',
      ar: 'ماتشا كاغوشيما الفاخر مخفوق طازجاً فوق اليوزو المنعش وعصير الليمون. رفيق الظهيرة المشمسة.',
    },
    image: VENUE_CONFIG.assets.quadKraftCards,
    quadrant: 'tr',
    pegOffsetY: 14,
    tiltDeg: 1.9,
  },
  {
    id: 'dirty-matcha',
    menuCategoryId: 'matcha',
    title: { en: 'Dirty Matcha', fr: 'Dirty Matcha', ar: 'ديرتي ماتشا' },
    blurb: {
      en: 'Ceremonial green tea grounded by a double pull of Blend #2 espresso. Earthy umami meets bright cacao and stone-fruit crema.',
      fr: 'Thé vert cérémoniel ancré par une double extraction de notre Blend #2. L’umami végétal rencontre des notes de cacao franc.',
      ar: 'ماتشا احتفالي تلتقي فيه نعومة الشاي الأخضر مع جرعة مزدوجة من إسبريسو الخلطة الثانية لإشراقة متوازنة.',
    },
    image: VENUE_CONFIG.assets.quadKraftCards,
    quadrant: 'bl',
    pegOffsetY: -10,
    tiltDeg: -1.6,
  },
  {
    id: 'berry-iced-tea',
    menuCategoryId: 'non-coffee',
    title: { en: 'Berry Iced Tea', fr: 'Thé Glacé aux Baies', ar: 'شاي مثلج بالتوت' },
    blurb: {
      en: 'Ruby hibiscus and wild berry steep served cold with crisp lime wedges. Zero caffeine, vivid color, clean finish.',
      fr: 'Infusion rubis d’hibiscus et baies sauvages servie glacée au citron vert. Sans caféine, vif et désaltérant.',
      ar: 'نقيع الكركديه والتوت البري المثلج مع شرائح الليمون الحامض. خالٍ من الكافيين ومنعش حتى الرشفة الأخيرة.',
    },
    image: VENUE_CONFIG.assets.quadKraftCards,
    quadrant: 'br',
    pegOffsetY: 10,
    tiltDeg: 2.3,
  },
  {
    id: 'iced-dates-latte',
    menuCategoryId: 'signature',
    title: { en: 'Iced Dates & Orange Blossom Latte', fr: 'Latte Glacé Dattes & Fleur d’Oranger', ar: 'لاتيه التمر وماء الزهر المثلج' },
    blurb: {
      en: 'Our love letter to Algiers: Deglet Nour dates steeped with fragrant orange blossom water, shaken with chilled milk and espresso.',
      fr: 'Notre déclaration à Alger : dattes Deglet Nour, eau de fleur d’oranger, lait glacé et espresso velouté.',
      ar: 'رسالة حب للجزائر: تمر دقلة نور مع عبق ماء الزهر، الحليب البارد وإسبريسو ناعم المذاق.',
    },
    image: VENUE_CONFIG.assets.icedDatesCard,
    pegOffsetY: -4,
    tiltDeg: -1.8,
  },
];

/**
 * Drinks without supplied kraft posters hang between posters as small blank kraft tags
 */
export const KRAFT_TAGS: BlankKraftTagItem[] = [
  {
    id: 'tag-pistachio',
    menuCategoryId: 'signature',
    title: { en: 'Pistachio Spanish Latte', fr: 'Spanish Latte Pistache', ar: 'سبانيش لاتيه بالفستق' },
    subtitle: { en: 'Signature · House praline', fr: 'Signature · Praliné maison', ar: 'توقيع قهوة · فستق محمص' },
    tiltDeg: 4.5,
    pegOffsetY: 6,
  },
  {
    id: 'tag-orange-tonic',
    menuCategoryId: 'signature',
    title: { en: 'Orange Espresso Tonic', fr: 'Espresso Tonic Orange', ar: 'إسبريسو تونيك بالبرتقال' },
    subtitle: { en: 'Fresh press · Dry tonic', fr: 'Jus frais · Tonic sec', ar: 'برتقال طازج · تونيك فوار' },
    tiltDeg: -5,
    pegOffsetY: -8,
  },
  {
    id: 'tag-tiramisu',
    menuCategoryId: 'signature',
    title: { en: 'Tiramisu Latte', fr: 'Tiramisu Latte', ar: 'تيراميسو لاتيه' },
    subtitle: { en: 'Mascarpone · Cocoa dust', fr: 'Mascarpone · Cacao amer', ar: 'ماسكاربوني · كاكاو' },
    tiltDeg: 3.2,
    pegOffsetY: 12,
  },
  {
    id: 'tag-ceremonial-matcha',
    menuCategoryId: 'matcha',
    title: { en: 'Ceremonial Matcha', fr: 'Matcha Cérémoniel', ar: 'ماتشا احتفالي' },
    subtitle: { en: 'Kagoshima · Oatly', fr: 'Kagoshima · Avoine', ar: 'كاغوشيما · حليب الشوفان' },
    tiltDeg: -3.8,
    pegOffsetY: -4,
  },
];

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'classics',
    label: { en: 'Qahwa Classics', fr: 'Classiques Qahwa', ar: 'كلاسيكيات قهوة' },
    items: [
      { id: 'espresso', name: { en: 'Espresso', fr: 'Espresso', ar: 'إسبريسو' }, note: { en: 'Blend #2 single or double pull', fr: 'Simple ou double extraction Blend #2', ar: 'استخلاص فردي أو مزدوج من الخلطة الثانية' }, price: '' },
      { id: 'cortado', name: { en: 'Cortado', fr: 'Cortado', ar: 'كورتادو' }, note: { en: 'Equal parts espresso & steamed milk', fr: 'À parts égales espresso et lait texturé', ar: 'إسبريسو متوازن مع حليب مبخر بنسب متساوية' }, price: '' },
      { id: 'flat-white', name: { en: 'Flat White', fr: 'Flat White', ar: 'فلات وايت' }, note: { en: 'Double ristretto with micro-foam', fr: 'Double ristretto et micromousse soyeuse', ar: 'ريستريتو مزدوج مع رغوة حريرية دقيقة' }, price: '' },
      { id: 'cappuccino', name: { en: 'Cappuccino', fr: 'Cappuccino', ar: 'كابتشينو' }, note: { en: 'Served in hand-thrown ceramic with cocoa dust', fr: 'Servi en céramique artisanale, voile de cacao', ar: 'يُقدّم في كوب فخاري يدوي مع رشة كاكاو' }, price: '' },
      { id: 'latte', name: { en: 'Café Latte', fr: 'Café Latte', ar: 'كافيه لاتيه' }, note: { en: 'Hot or iced, oat milk available', fr: 'Chaud ou glacé, lait d’avoine disponible', ar: 'ساخن أو مثلج، متوفر بحليب الشوفان' }, price: '' },
      { id: 'salted-caramel', name: { en: 'Iced Salted Caramel Latte', fr: 'Latte Glacé Caramel Beurre Salé', ar: 'لاتيه الكراميل المملح المثلج' }, note: { en: 'House caramel & flaky sea salt', fr: 'Caramel maison et fleur de sel', ar: 'كراميل محلي الصنع مع ملح البحر' }, price: '' },
    ],
  },
  {
    id: 'matcha',
    label: { en: 'Matcha', fr: 'Matcha', ar: 'ماتشا' },
    items: [
      { id: 'ceremonial-matcha', name: { en: 'Ceremonial Matcha Latte', fr: 'Matcha Latte Cérémoniel', ar: 'ماتشا لاتيه احتفالي' }, note: { en: 'Kagoshima first-harvest matcha & Oatly', fr: 'Matcha de Kagoshima première récolte & Oatly', ar: 'ماتشا كاغوشيما الفاخر مع حليب الشوفان' }, price: '' },
      { id: 'vanilla-matcha', name: { en: 'Vanilla Matcha Latte', fr: 'Matcha Latte Vanille', ar: 'ماتشا لاتيه بالفانيليا' }, note: { en: 'Whisked to order with warm vanilla bean', fr: 'Fouetté minute à la gousse de vanille', ar: 'مخفوق طازجاً مع خلاصة الفانيليا الطبيعية' }, price: '' },
      { id: 'dirty-matcha-item', name: { en: 'Dirty Matcha', fr: 'Dirty Matcha', ar: 'ديرتي ماتشا' }, note: { en: 'Oat matcha crowned with Blend #2 espresso', fr: 'Matcha avoine et shot d’espresso Blend #2', ar: 'ماتشا مع جرعة إسبريسو محمصة بعناية' }, price: '', posterId: 'dirty-matcha' },
      { id: 'yuzu-matcha', name: { en: 'Yuzu Matcha Lemonade', fr: 'Citronnade Matcha Yuzu', ar: 'ليموناضة الماتشا واليوزو' }, note: { en: 'Bright Japanese yuzu, lemon & ceremonial green tea', fr: 'Yuzu japonais, citron pressé et thé vert', ar: 'يوزو ياباني منعش مع الليمون والماتشا' }, price: '', posterId: 'yuzu-matcha-lemonade' },
    ],
  },
  {
    id: 'hojicha',
    label: { en: 'Hojicha', fr: 'Hojicha', ar: 'هوجيتشا' },
    items: [
      { id: 'roasted-hojicha', name: { en: 'Roasted Hojicha Latte', fr: 'Hojicha Latte Torréfié', ar: 'لاتيه الهوجيتشا المحمص' }, note: { en: 'Toasted green tea notes of caramel & cacao', fr: 'Thé vert torréfié aux notes de caramel et cacao', ar: 'شاي أخضر محمص بنفحات الكراميل والكاكاو' }, price: '' },
      { id: 'strawberry-hojicha-item', name: { en: 'Strawberry Hojicha', fr: 'Hojicha Fraise', ar: 'هوجيتشا بالفراولة' }, note: { en: 'House strawberry compote, cream & roasted hojicha', fr: 'Compotée de fraises maison, crème et hojicha', ar: 'مربى الفراولة المنزلي مع الكريمة والهوجيتشا' }, price: '', posterId: 'strawberry-hojicha' },
      { id: 'iced-amber-hojicha', name: { en: 'Iced Amber Hojicha', fr: 'Hojicha Ambré Glacé', ar: 'هوجيتشا مثلج بالعنبر' }, note: { en: 'Low-caffeine, nutty roast over crystal ice', fr: 'Douceur torréfiée faible en théine sur glace', ar: 'نكهة محمصة لطيفة ومنخفضة الكافيين على الثلج' }, price: '' },
    ],
  },
  {
    id: 'signature',
    label: { en: 'Signature by Qahwa', fr: 'Signatures Qahwa', ar: 'توقيع قهوة' },
    items: [
      { id: 'dates-orange-blossom', name: { en: 'Iced Dates & Orange Blossom Latte', fr: 'Latte Glacé Dattes & Fleur d’Oranger', ar: 'لاتيه التمر وماء الزهر المثلج' }, note: { en: 'Deglet Nour dates, orange blossom & espresso', fr: 'Dattes Deglet Nour, fleur d’oranger et espresso', ar: 'تمر دقلة نور مع ماء الزهر وإسبريسو ناعم' }, price: '', posterId: 'iced-dates-latte' },
      { id: 'pistachio-spanish', name: { en: 'Pistachio Spanish Latte', fr: 'Spanish Latte Pistache', ar: 'سبانيش لاتيه بالفستق' }, note: { en: 'Roasted pistachio cream & velvety milk', fr: 'Crème de pistache grillée et lait velouté', ar: 'كريمة الفستق المحمص والحليب المخملي' }, price: '' },
      { id: 'orange-tonic', name: { en: 'Orange Espresso Tonic', fr: 'Espresso Tonic à l’Orange', ar: 'إسبريسو تونيك بالبرتقال' }, note: { en: 'Fresh citrus juice, dry tonic & espresso', fr: 'Jus d’orange frais, tonic sec et espresso', ar: 'عصير برتقال طازج مع ماء التونيك والإسبريسو' }, price: '' },
      { id: 'tiramisu-item', name: { en: 'Tiramisu Latte', fr: 'Tiramisu Latte', ar: 'تيراميسو لاتيه' }, note: { en: 'Mascarpone foam, Valrhona cocoa & savoiardi', fr: 'Mousse mascarpone, cacao Valrhona et biscuit', ar: 'رغوة الماسكاربوني وكاكاو فالرونا وبسكويت' }, price: '' },
    ],
  },
  {
    id: 'non-coffee',
    label: { en: 'Non-Coffee', fr: 'Sans Café', ar: 'بدون قهوة' },
    items: [
      { id: 'berry-tea', name: { en: 'Berry Iced Tea', fr: 'Thé Glacé aux Baies', ar: 'شاي مثلج بالتوت' }, note: { en: 'Hibiscus & wild berry slow cold brew', fr: 'Infusion à froid hibiscus et fruits des bois', ar: 'نقيع بارد من الكركديه والتوت البري' }, price: '', posterId: 'berry-iced-tea' },
      { id: 'valrhona-cacao', name: { en: 'Valrhona Hot Chocolate', fr: 'Chocolat Chaud Valrhona', ar: 'شوكولاتة ساخنة فالرونا' }, note: { en: '70% dark chocolate melted into steamed milk', fr: 'Chocolat noir 70% fondu dans un lait onctueux', ar: 'شوكولاتة داكنة 70% مذابة في حليب دافئ' }, price: '' },
      { id: 'qahwa-brookie', name: { en: 'Qahwa Brookie', fr: 'Brookie Qahwa', ar: 'بروكي قهوة' }, note: { en: 'Valrhona chocolate & sea salt', fr: 'Chocolat Valrhona et fleur de sel', ar: 'شوكولاتة فالرونا مع ملح البحر' }, price: '' },
      { id: 'raspberry-croissant', name: { en: 'Raspberry Bicolor Croissant', fr: 'Croissant Bicolore Framboise', ar: 'كرواسان التوت الثنائي اللون' }, note: { en: 'Flaky butter lamination & tart jam', fr: 'Feuilletage pur beurre et confit framboise', ar: 'عجينة مورّقة بالزبدة وحشوة التوت' }, price: '' },
    ],
  },
  {
    id: 'juices',
    label: { en: 'Fresh Juices', fr: 'Jus Pressés', ar: 'عصائر طازجة' },
    items: [
      { id: 'fresh-orange', name: { en: 'Fresh Orange Juice', fr: 'Jus d’Orange Pressé', ar: 'عصير برتقال طازج' }, note: { en: 'Pressed to order with dehydrated citrus', fr: 'Pressé minute avec rondelle séchée', ar: 'معصور عند الطلب مع شريحة برتقال مجفف' }, price: '' },
      { id: 'green-apple-ginger', name: { en: 'Green Apple & Ginger', fr: 'Pomme Verte & Gingembre', ar: 'تفاح أخضر وزنجبيل' }, note: { en: 'Crisp orchard press with warm ginger', fr: 'Extraction fraîche relevée au gingembre', ar: 'عصير تفاح طازج مع لمسة زنجبيل' }, price: '' },
      { id: 'pomegranate-citrus', name: { en: 'Pomegranate Citrus', fr: 'Grenade & Agrumes', ar: 'رمان وحمضيات' }, note: { en: 'Seasonal ruby pomegranate & blood orange', fr: 'Grenade de saison et orange sanguine', ar: 'رمان موسمي مع البرتقال الأحمر' }, price: '' },
    ],
  },
  {
    id: 'smoothies',
    label: { en: 'Smoothies & Wellness Shots', fr: 'Smoothies & Shots', ar: 'سموذي ومقويات' },
    items: [
      { id: 'nectarine-kiwi', name: { en: 'Nectarine Kiwi Smoothie', fr: 'Smoothie Nectarine Kiwi', ar: 'سموذي النكتارين والكيوي' }, note: { en: 'Velvety orchard nectarine & green kiwi', fr: 'Nectarine veloutée et kiwi acidulé', ar: 'نكتارين ناعم ممزوج بالكيوي الطازج' }, price: '' },
      { id: 'ginger-turmeric-shot', name: { en: 'Ginger Turmeric Shot', fr: 'Shot Gingembre Curcuma', ar: 'جرعة الزنجبيل والكركم' }, note: { en: 'Cold-pressed roots, lemon & black pepper', fr: 'Racines pressées à froid, citron et poivre', ar: 'جذور معصورة على البارد مع الليمون' }, price: '' },
      { id: 'matcha-citrus-shot', name: { en: 'Matcha Citrus Shot', fr: 'Shot Matcha Agrumes', ar: 'جرعة الماتشا والحمضيات' }, note: { en: 'Concentrated ceremonial lift in one sip', fr: 'Élan cérémoniel concentré en une gorgée', ar: 'تركيز نقاء الماتشا مع الحمضيات' }, price: '' },
    ],
  },
];

export const SCENES: SceneItem[] = [
  {
    id: 'sunny-window',
    title: { en: 'Sunny Storefront', fr: 'Vitrine Ensoleillée', ar: 'الواجهة المشمسة' },
    image: VENUE_CONFIG.assets.storefrontWindow,
    matchedPosterId: 'yuzu-matcha-lemonade',
    slipMood: {
      en: 'You paused under the neon squiggle. We’d hand you a cold Yuzu Matcha Lemonade.',
      fr: 'Vous vous êtes arrêté sous le néon jaune. On vous sert une Citronnade Matcha Yuzu bien fraîche.',
      ar: 'توقّفت تحت الخط الأصفر المضيء. سنبدأ لك بليموناضة الماتشا واليوزو المنعشة.',
    },
  },
  {
    id: 'cozy-interior',
    title: { en: 'Chess & Warm Tables', fr: 'Échecs & Tables Animées', ar: 'طاولات الشطرنج الدافئة' },
    image: VENUE_CONFIG.assets.interiorChess,
    matchedPosterId: 'strawberry-hojicha',
    slipMood: {
      en: 'You settled into a corner match. We’d pour you a Strawberry Hojicha to linger over.',
      fr: 'Vous vous installez pour une partie d’échecs. Un Hojicha Fraise pour accompagner l’après-midi.',
      ar: 'جلست في ركن الشطرنج الهادئ. سنصبّ لك هوجيتشا بالفراولة يرافق طول الجلسة.',
    },
  },
  {
    id: 'red-wall',
    title: { en: 'Red Wall & Orange Cap', fr: 'Mur Rouge & Casquette', ar: 'الجدار الأحمر والقبعة' },
    image: VENUE_CONFIG.assets.redWallCap,
    matchedPosterId: 'dirty-matcha',
    slipMood: {
      en: 'You walked in loud. We’d start you on the Dirty Matcha.',
      fr: 'Vous êtes entré avec panache. On vous prépare d’emblée un Dirty Matcha.',
      ar: 'دخلت بحضور لافت. سنبدأ لك فوراً بكوب ديرتي ماتشا جريء.',
    },
  },
  {
    id: 'ceramic-niche',
    title: { en: 'Arched Ceramic Niche', fr: 'Niche en Céramique', ar: 'رفوف الفخار المقوسة' },
    image: VENUE_CONFIG.assets.nicheShelves,
    matchedPosterId: 'iced-dates-latte',
    slipMood: {
      en: 'You lingered by the handmade cups. Yours is the Iced Dates & Orange Blossom Latte.',
      fr: 'Vous admirez les tasses façonnées à la main. Voici le Latte Glacé Dattes & Fleur d’Oranger.',
      ar: 'تأمّلت الأكواب الفخارية بعناية. خيارك هو لاتيه التمر وماء الزهر المثلج.',
    },
  },
];

export const SURPRISE_SLIP_MOOD: LocalizedText = {
  en: 'Left it up to the sun and leaf shadows. A Berry Iced Tea just hit the counter.',
  fr: 'Vous avez laissé faire le hasard et la lumière. Un Thé Glacé aux Baies vous attend.',
  ar: 'تركت الاختيار لضوء الشمس وظلال الورق. شاي التوت المثلج في انتظارك.',
};

// Calibration origin (% on Photo B) for Stage 1 camera push-in (use ?debug=1 to inspect crosshair)
export const BLEND_PUSH_IN_ORIGIN = {
  xPercent: 55,
  yPercent: 52,
};

export interface BlendRayFact {
  id: string;
  kind: 'flavor' | 'fact';
  /** Normalized ray length weight: flavors scale by intensity (0..1); facts stay uniform */
  intensity: number;
  category: LocalizedText;
  value: LocalizedText;
}

export interface BlendDataset {
  id: 'bag' | 'label';
  title: LocalizedText;
  stampHeadline: LocalizedText;
  specs: Array<{
    label: LocalizedText;
    value: LocalizedText;
  }>;
  rays: BlendRayFact[];
}

// TODO: confirm current batch with the café
export const ACTIVE_BLEND_DATASET_ID: 'bag' | 'label' = 'bag';

export const BLEND_DATASETS: Record<'bag' | 'label', BlendDataset> = {
  // Default dataset printed on Photo B's Blend #2 bag
  bag: {
    id: 'bag',
    title: { en: 'Blend #2', fr: 'Blend #2', ar: 'الخلطة الثانية #2' },
    stampHeadline: { en: 'BLEND #2.', fr: 'BLEND #2.', ar: 'الخلطة #2.' },
    specs: [
      {
        label: { en: 'Origin', fr: 'Origine', ar: 'المنشأ' },
        value: { en: 'El Salvador & Colombia', fr: 'El Salvador & Colombie', ar: 'السلفادور وكولومبيا' },
      },
      {
        label: { en: 'Producers', fr: 'Producteurs', ar: 'المنتجون' },
        value: {
          en: 'Rigoberto A. Aguirre & Walter Castañeda',
          fr: 'Rigoberto A. Aguirre & Walter Castañeda',
          ar: 'ريغوبيرتو أ. أغيري ووالتر كاستانيدا',
        },
      },
      {
        label: { en: 'Flavor Profile', fr: 'Profil de saveur', ar: 'ملف النكهات' },
        value: {
          en: 'Red fruits, lemon and liqueur, cacao notes',
          fr: 'Fruits rouges, citron et liqueur, notes de cacao',
          ar: 'فواكه حمراء، ليمون ولمسة ليكور، إيحاءات كاكاو',
        },
      },
    ],
    rays: [
      {
        id: 'bag-red-fruits',
        kind: 'flavor',
        intensity: 0.78,
        category: { en: 'Flavor Note', fr: 'Note de dégustation', ar: 'إيحاء التذوق' },
        value: { en: 'Red Fruits', fr: 'Fruits Rouges', ar: 'فواكه حمراء' },
      },
      {
        id: 'bag-lemon',
        kind: 'flavor',
        intensity: 0.66,
        category: { en: 'Flavor Note', fr: 'Note de dégustation', ar: 'إيحاء التذوق' },
        value: { en: 'Lemon', fr: 'Citron', ar: 'ليمون' },
      },
      {
        id: 'bag-liqueur',
        kind: 'flavor',
        intensity: 0.74,
        category: { en: 'Flavor Note', fr: 'Note de dégustation', ar: 'إيحاء التذوق' },
        value: { en: 'Liqueur', fr: 'Liqueur', ar: 'لمسة ليكور' },
      },
      {
        id: 'bag-cacao',
        kind: 'flavor',
        intensity: 0.96,
        category: { en: 'Flavor Note', fr: 'Note de dégustation', ar: 'إيحاء التذوق' },
        value: { en: 'Cacao Notes', fr: 'Notes de Cacao', ar: 'إيحاءات الكاكاو' },
      },
      {
        id: 'bag-origin',
        kind: 'fact',
        intensity: 0.56,
        category: { en: 'Origin', fr: 'Origine', ar: 'المنشأ' },
        value: { en: 'El Salvador & Colombia', fr: 'El Salvador & Colombie', ar: 'السلفادور وكولومبيا' },
      },
      {
        id: 'bag-producers',
        kind: 'fact',
        intensity: 0.56,
        category: { en: 'Producers', fr: 'Producteurs', ar: 'المنتجون' },
        value: {
          en: 'R. A. Aguirre & W. Castañeda',
          fr: 'R. A. Aguirre & W. Castañeda',
          ar: 'ر. أغيري وو. كاستانيدا',
        },
      },
    ],
  },

  // Older Blend label image dataset kept separate (never mixed with Photo B's active batch)
  label: {
    id: 'label',
    title: { en: 'Blend 2#', fr: 'Blend 2#', ar: 'الخلطة 2#' },
    stampHeadline: { en: 'BLEND 2#.', fr: 'BLEND 2#.', ar: 'الخلطة 2#.' },
    specs: [
      {
        label: { en: 'Producers', fr: 'Producteurs', ar: 'المنتجون' },
        value: { en: 'Argueta & Castaneda', fr: 'Argueta & Castaneda', ar: 'أرغيتا وكاستانيدا' },
      },
      {
        label: { en: 'Region of Origin', fr: 'Région d’origine', ar: 'منطقة المنشأ' },
        value: { en: 'El Salvador & Peru', fr: 'El Salvador & Pérou', ar: 'السلفادور وبيرو' },
      },
      {
        label: { en: 'Altitude', fr: 'Altitude', ar: 'الارتفاع' },
        value: { en: '1400–1700 m', fr: '1400–1700 m', ar: '١٤٠٠–١٧٠٠ م' },
      },
      {
        label: { en: 'Harvest', fr: 'Récolte', ar: 'القطف' },
        value: { en: 'Hand-picked, selective', fr: 'Manuelle, sélective', ar: 'قطف يدوي انتقائي' },
      },
      {
        label: { en: 'Process', fr: 'Processus', ar: 'المعالجة' },
        value: { en: 'Washed', fr: 'Lavé', ar: 'مغسولة' },
      },
      {
        label: { en: 'Tasting Notes', fr: 'Notes de dégustation', ar: 'ملاحظات التذوق' },
        value: { en: 'Pineapple, Lime, Cacao (strong)', fr: 'Ananas, Citron vert, Cacao (fort)', ar: 'أناناس، ليمون أخضر، كاكاو (قوي)' },
      },
    ],
    rays: [
      {
        id: 'lbl-pineapple',
        kind: 'flavor',
        intensity: 0.72,
        category: { en: 'Tasting Note', fr: 'Note de dégustation', ar: 'إيحاء التذوق' },
        value: { en: 'Pineapple', fr: 'Ananas', ar: 'أناناس' },
      },
      {
        id: 'lbl-lime',
        kind: 'flavor',
        intensity: 0.66,
        category: { en: 'Tasting Note', fr: 'Note de dégustation', ar: 'إيحاء التذوق' },
        value: { en: 'Lime', fr: 'Citron Vert', ar: 'ليمون أخضر' },
      },
      {
        id: 'lbl-cacao-strong',
        kind: 'flavor',
        intensity: 1.0,
        category: { en: 'Dominant Note', fr: 'Note dominante', ar: 'النكهة الأقوى' },
        value: { en: 'Cacao (Strong)', fr: 'Cacao (Fort)', ar: 'كاكاو (قوي)' },
      },
      {
        id: 'lbl-origin',
        kind: 'fact',
        intensity: 0.56,
        category: { en: 'Origin', fr: 'Origine', ar: 'المنشأ' },
        value: { en: 'El Salvador & Peru', fr: 'El Salvador & Pérou', ar: 'السلفادور وبيرو' },
      },
      {
        id: 'lbl-altitude',
        kind: 'fact',
        intensity: 0.56,
        category: { en: 'Altitude', fr: 'Altitude', ar: 'الارتفاع' },
        value: { en: '1400–1700 m', fr: '1400–1700 m', ar: '١٤٠٠–١٧٠٠ م' },
      },
      {
        id: 'lbl-harvest',
        kind: 'fact',
        intensity: 0.56,
        category: { en: 'Harvest', fr: 'Récolte', ar: 'القطف' },
        value: { en: 'Hand-picked', fr: 'Manuelle', ar: 'يدوي انتقائي' },
      },
      {
        id: 'lbl-process',
        kind: 'fact',
        intensity: 0.56,
        category: { en: 'Process', fr: 'Processus', ar: 'المعالجة' },
        value: { en: 'Washed', fr: 'Lavé', ar: 'مغسولة' },
      },
    ],
  },
};

export const CERAMIC_PIECES: CeramicPiece[] = [
  {
    id: 'dimpled-latte',
    title: { en: 'Hand-Dimpled Flat White Vessel', fr: 'Tasse Alvéolée Main', ar: 'كوب الفلات وايت المنقوش يدوياً' },
    subtitle: { en: 'Thumb-pressed clay ridges glazed in warm plaster cream', fr: 'Empreintes modelées à la main sous un émail plâtre chaud', ar: 'نقوش إصبعية يدوية مغطاة بطلاء الجص الكريمي الدافئ' },
    image: VENUE_CONFIG.assets.dimpledCup,
  },
  {
    id: 'cocoa-stencil-bowl',
    title: { en: 'Speckled Stoneware Cappuccino Bowl', fr: 'Bol Cappuccino en Grès', ar: 'وعاء الكابتشينو الحجري' },
    subtitle: { en: 'Wide wheel-thrown rim crafted for slow foam & cocoa dust', fr: 'Rebord large tourné au tour pour mousse lente et cacao', ar: 'حافة عريضة مشكلة على العجلة للرغوة والكاكاو' },
    image: VENUE_CONFIG.assets.cocoaStencilCup,
  },
  {
    id: 'niche-collection',
    title: { en: 'Arched Niche Studio Edition', fr: 'Édition Niche Voûtée', ar: 'مجموعة الرفوف المقوسة' },
    subtitle: { en: 'Checkerboard, pistachio stripe, and terracotta glazed tumblers', fr: 'Gobelets damier, rayures pistache et terre cuite émaillée', ar: 'أكواب الشطرنج والخطوط الخضراء والطين المحروق' },
    image: VENUE_CONFIG.assets.nicheShelves,
  },
  {
    id: 'spiced-ceramic',
    title: { en: 'Sunlit Atelier Glass & Saucer', fr: 'Verre & Soucoupe d’Atelier', ar: 'كأس المرسم تحت الشمس' },
    subtitle: { en: 'Golden-hour pours paired with seasonal spiced matcha', fr: 'Service à l’heure dorée avec matcha épicé maison', ar: 'تقديم الساعة الذهبية مع الماتشا المتبلة' },
    image: VENUE_CONFIG.assets.spicedMatcha,
  },
];

export interface GoogleReviewItem {
  id: string;
  name: string;
  badge: LocalizedText;
  stars: 5;
  text: string; // Verbatim English text as shown on Google Maps (never completed or altered)
  translations: {
    fr: string;
    ar: string;
  };
  truncated: boolean;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

export interface GoogleMentionStone {
  id: string;
  count: number;
  label: LocalizedText;
  action: 'menu-matcha' | 'line-pistachio-latte' | 'wobble';
}

export interface GuestPhotoItem {
  id: string;
  image: string;
  alt: LocalizedText;
}

/**
 * 11b. TABLE TALK — Real Google Maps data for "Qahwa The Coffee"
 * Only real supplied data. Do not invent reviews, counts, or ratings.
 */
export const TABLE_TALK_DATA = {
  rating: 4.7,
  reviewCount: 830,
  asOf: 'Nov 2026', // Refreshable timestamp for the 830 Google review count
  googleReviewsUrl: 'https://maps.app.goo.gl/RpAznZCHjmahrZnF8',
  // Placeholder until direct Google "Write a review" URL is supplied by the café
  writeReviewUrl: '',
  // Set true only after the café confirms permission to show guest photos
  showGuestPhotos: false,
  guestPhotos: [] as GuestPhotoItem[],
  mentions: [
    {
      id: 'mention-matcha',
      count: 125,
      label: { en: 'matcha', fr: 'matcha', ar: 'ماتشا' },
      action: 'menu-matcha',
    },
    {
      id: 'mention-pistachio-cookie',
      count: 32,
      label: { en: 'pistachio cookie', fr: 'cookie pistache', ar: 'كوكيز الفستق' },
      action: 'wobble',
    },
    {
      id: 'mention-welcoming-staff',
      count: 30,
      label: { en: 'welcoming staff', fr: 'accueil chaleureux', ar: 'فريق مرحّب' },
      action: 'wobble',
    },
    {
      id: 'mention-pistachio-latte',
      count: 5,
      label: { en: 'pistachio spanish latte', fr: 'spanish latte pistache', ar: 'سبانيش لاتيه بالفستق' },
      action: 'line-pistachio-latte',
    },
  ] as GoogleMentionStone[],
  reviews: [
    {
      id: 'rev-veselina',
      name: 'Veselina M.',
      badge: { en: 'Google Local Guide', fr: 'Local Guide Google', ar: 'مرشد محلي على جوجل' },
      stars: 5,
      text: 'I would say that the place is a little escape from the city and the vibe is so good and different. The staff is super super friendly and spoke English which made our experience and ordering easier. We had the chance to meet the owner who …',
      translations: {
        fr: 'Je dirais que cet endroit est une petite parenthèse hors de la ville et l’ambiance est si belle et différente. L’équipe est vraiment très chaleureuse et parlait anglais, ce qui a rendu notre passage et notre commande très faciles. Nous avons eu la chance de rencontrer le propriétaire qui …',
        ar: 'أقول إن هذا المكان ملاذ صغير بعيداً عن ضجيج المدينة، وأجواؤه جميلة ومختلفة حقاً. الطاقم ودود للغاية ويتحدث الإنجليزية مما جعل تجربتنا والطلب أكثر سهولة. وأُتيحت لنا فرصة لقاء المالك الذي …',
      },
      truncated: true,
      rotation: -2.6,
      offsetX: -8,
      offsetY: 4,
    },
    {
      id: 'rev-julio',
      name: 'Julio O.',
      badge: { en: 'Google Local Guide', fr: 'Local Guide Google', ar: 'مرشد محلي على جوجل' },
      stars: 5,
      text: "This is one of these cafes that you go and come back to with all the pleasure in the world. Good options of specialty coffees, a very nice staff (Joseph and Abdu (sorry if it's not written like that 😅) and a cozy atmosphere. …",
      translations: {
        fr: 'C’est l’un de ces cafés où l’on vient et l’on revient avec tout le plaisir du monde. De belles options de cafés de spécialité, une équipe très gentille (Joseph et Abdu, désolé pour l’orthographe 😅) et une atmosphère chaleureuse. …',
        ar: 'هذا واحد من المقاهي التي تذهب إليها وتعود إليها بكل سرور الدنيا. خيارات مميزة من القهوة المختصة، وفريق لطيف جداً (جوزيف وعبدو، المعذرة إن لم يُكتب الاسم هكذا 😅) وأجواء دافئة ومريحة. …',
      },
      truncated: true,
      rotation: 2.1,
      offsetX: 6,
      offsetY: -8,
    },
    {
      id: 'rev-mohamed',
      name: 'Mohamed K.',
      badge: { en: 'Google Local Guide', fr: 'Local Guide Google', ar: 'مرشد محلي على جوجل' },
      stars: 5,
      text: 'Absolutely fantastic experience! This coffee shop has a truly wonderful setup with a very cool, cozy atmosphere …',
      translations: {
        fr: 'Expérience absolument fantastique ! Ce café offre un agencement vraiment magnifique avec une atmosphère très agréable et chaleureuse …',
        ar: 'تجربة رائعة بكل المقاييس! يتمتع هذا المقهى بتصميم بديع حقاً مع أجواء مريحة ودافئة للغاية …',
      },
      truncated: true,
      rotation: -1.5,
      offsetX: -4,
      offsetY: 10,
    },
  ] as GoogleReviewItem[],
};

export const POLAROIDS: PolaroidItem[] = [
  {
    id: 'p1',
    image: VENUE_CONFIG.assets.redWallCap,
    caption: { en: 'Red wall, burnt-orange cap & afternoon tonic.', fr: 'Mur rouge, casquette orange et tonic d’après-midi.', ar: 'جدار أحمر، قبعة برتقالية وتونيك بعد الظهر.' },
    rotation: -5,
    offsetX: -10,
    offsetY: 8,
  },
  {
    id: 'p2',
    image: VENUE_CONFIG.assets.storefrontWindow,
    caption: { en: 'Under the neon squiggle on Rue Qahwa.', fr: 'Sous le néon ondulé devant la vitrine.', ar: 'تحت الخط المضيء أمام واجهة المقهى.' },
    rotation: 4,
    offsetX: 6,
    offsetY: -8,
  },
  {
    id: 'p3',
    image: VENUE_CONFIG.assets.orangeVestStorefront,
    caption: { en: 'Terracotta cut-out & summer knit.', fr: 'Enseigne découpée et maille d’été.', ar: 'شعار الطين المحروق وإطلالة الصيف.' },
    rotation: -2.5,
    offsetX: -4,
    offsetY: 12,
  },
  {
    id: 'p4',
    image: VENUE_CONFIG.assets.brookie,
    caption: { en: 'Valrhona brookie + flaky sea salt.', fr: 'Brookie Valrhona et fleur de sel.', ar: 'بروكي فالرونا مع ملح البحر.' },
    rotation: 5.5,
    offsetX: 8,
    offsetY: -4,
  },
  {
    id: 'p5',
    image: VENUE_CONFIG.assets.croissants,
    caption: { en: 'Morning trays still warm from the oven.', fr: 'Fournée du matin encore tiède.', ar: 'صواني الصباح الدافئة من الفرن.' },
    rotation: -4,
    offsetX: -6,
    offsetY: 6,
  },
];

export const COPY = {
  loader: {
    preparing: { en: 'Shaping the clay', fr: 'Façonnage de la terre', ar: 'تشكيل الطين' },
  },
  nav: {
    line: { en: 'The Line', fr: 'La Ligne', ar: 'الحبل' },
    menu: { en: 'Menu', fr: 'Carte', ar: 'القائمة' },
    ceramics: { en: 'Ceramics', fr: 'Céramique', ar: 'الفخار' },
    balance: { en: 'Balance', fr: 'Équilibre', ar: 'التوازن' },
    visit: { en: 'Visit', fr: 'Visiter', ar: 'زورونا' },
    soundOn: { en: 'Sound on', fr: 'Son activé', ar: 'الصوت مفعل' },
    soundOff: { en: 'Sound off', fr: 'Son coupé', ar: 'الصوت صامت' },
  },
  hero: {
    tagline: { en: 'More than coffee.', fr: 'Plus que du café.', ar: 'أكثر من مجرّد قهوة.' },
    headlineLine1: { en: 'Coffee.', fr: 'Café.', ar: 'قهوة.' },
    headlineLine2: { en: 'Ceramic.', fr: 'Céramique.', ar: 'فخار.' },
    headlineLine3: { en: 'Matcha.', fr: 'Matcha.', ar: 'ماتشا.' },
    headlineMore: { en: 'MORE.', fr: 'PLUS.', ar: 'وأكثر.' },
    ctaMenu: { en: 'See the menu', fr: 'Voir la carte', ar: 'استكشف القائمة' },
    ctaVisit: { en: 'Find us', fr: 'Nous trouver', ar: 'موقعنا' },
    scrollCue: { en: 'Scroll slowly', fr: 'Faites défiler', ar: 'تصفح ببطء' },
  },
  marquee: {
    text: {
      en: 'Specialty Coffee • Ceramic • Matcha • Hojicha • More than coffee •',
      fr: 'Café de Spécialité • Céramique • Matcha • Hojicha • Plus que du café •',
      ar: 'قهوة مختصة • فخار يدوي • ماتشا • هوجيتشا • أكثر من مجرد قهوة •',
    },
  },
  manifesto: {
    label: { en: 'The Atelier', fr: 'L’Atelier', ar: 'المرسم' },
    statement: {
      en: 'A café is so much more than coffee and matcha.',
      fr: 'Un café est bien plus que du café et du matcha.',
      ar: 'المقهى أعمق بكثير من مجرد قهوة وماتشا.',
    },
    ribbonPhrase: {
      en: 'TERRACOTTA • HAND-THROWN CLAY • SUNLIGHT • LEAF SHADOWS • SLOW POUR • ',
      fr: 'TERRE CUITE • ARGILE TOURNÉE • SOLEIL • OMBRES DE FEUILLES • SERVICE LENT • ',
      ar: 'طين محروق • فخار يدوي • ضوء الشمس • ظلال الأوراق • صبّ على مهل • ',
    },
    closing: {
      en: 'We notice when you’re gone.',
      fr: 'On remarque votre absence.',
      ar: 'نفتقد حضوركم حين تغيبون.',
    },
    archCaptions: [
      { en: 'Hand-thrown stoneware in arched plaster', fr: 'Grès tourné dans les niches en plâtre', ar: 'أكواب فخارية داخل الأقواس الجصية' },
      { en: 'Afternoon chess & lingering tables', fr: 'Parties d’échecs et tables animées', ar: 'شطرنج العصر وأحاديث دافئة' },
      { en: 'Sunlight through the neon window', fr: 'Soleil d’Alger à travers la vitrine', ar: 'شمس الصباح على واجهة قهوة' },
    ],
  },
  theLine: {
    label: { en: 'The Line', fr: 'La Ligne', ar: 'حبل النكهات' },
    heading: { en: 'Hung to dry in the sun.', fr: 'Suspendus dans la lumière.', ar: 'معلّقة في ضوء الشمس.' },
    hint: { en: 'Scroll, drag & tap a kraft card to pull it forward', fr: 'Faites glisser et cliquez sur une carte pour la découvrir', ar: 'اسحب الحبل وانقر على أي بطاقة لتكبيرها' },
    backBtn: { en: 'Back to the line', fr: 'Retour à la ligne', ar: 'العودة إلى الحبل' },
    kraftTagLabel: { en: 'House Pour', fr: 'Recette Maison', ar: 'تحضير الدار' },
  },
  menu: {
    fullMenuTitle: { en: 'Full House Menu', fr: 'La Carte Complète', ar: 'القائمة الكاملة' },
    photoHint: { en: 'Has poster on The Line', fr: 'Affiche sur La Ligne', ar: 'معروضة على الحبل' },
  },
  scenePicker: {
    label: { en: 'Pick Your Scene', fr: 'Choisissez Votre Scène', ar: 'اختر مشهدك' },
    headingWords: { en: 'PICK YOUR SCENE.', fr: 'CHOISISSEZ VOTRE SCÈNE.', ar: 'اختر مشهدك الآن.' },
    surpriseBtn: { en: 'Surprise me', fr: 'Surprenez-moi', ar: 'فاجئني' },
    tableForYou: { en: 'Table for: you', fr: 'Table pour : vous', ar: 'طاولة: لك وحدك' },
    anotherSceneBtn: { en: 'Another scene', fr: 'Autre scène', ar: 'مشهد آخر' },
    seeOnLineBtn: { en: 'See it on the line', fr: 'Voir sur la ligne', ar: 'شاهده على الحبل' },
    shareBtn: { en: 'Share', fr: 'Partager', ar: 'مشاركة' },
    copiedNotice: { en: 'Slip copied', fr: 'Ticket copié', ar: 'تم نسخ الوصفة' },
    tapHint: { en: 'Hover or tap a moment', fr: 'Touchez ou survolez un instant', ar: 'المس أي مشهد لاختيار مشروبك' },
  },
  sunClock: {
    label: { en: 'Sun Dial', fr: 'Cadran Solaire', ar: 'ساعة الشمس' },
    localTime: { en: 'Your local hour', fr: 'Votre heure locale', ar: 'توقيتك المحلي' },
    morning: {
      greeting: { en: 'Good morning, first cup?', fr: 'Bonjour, votre première tasse ?', ar: 'صباح الخير، هل حان وقت أول فنجان؟' },
      note: { en: 'Long, soft morning shadows from the left. Bright washes and warm croissants.', fr: 'Ombres longues et douces depuis la gauche. Jus clairs et croissants tièdes.', ar: 'ظلال صباحية طويلة وناعمة من اليسار، مع القهوة الأولى والكرواسان الدافئ.' },
    },
    noon: {
      greeting: { en: 'High sun, slow pull.', fr: 'Soleil haut, extraction lente.', ar: 'شمس الظهيرة، واستخلاص هادئ.' },
      note: { en: 'Short, crisp overhead shadows. Iced tonics and citrus matcha.', fr: 'Ombres courtes et nettes au zénith. Tonics glacés et matcha aux agrumes.', ar: 'ظلال قصيرة وحادة في منتصف النهار، تناسبها المشروبات المنعشة.' },
    },
    golden: {
      greeting: { en: 'Golden hour, matcha time.', fr: 'L’heure dorée, instant matcha.', ar: 'الساعة الذهبية، وقت الماتشا.' },
      note: { en: 'Long warm rays sweeping from the right across the terracotta suede.', fr: 'Rayons longs et chauds venus de la droite sur le daim terre cuite.', ar: 'أشعة ذهبية دافئة تمتد من اليمين عبر الجدار الطيني.' },
    },
    evening: {
      greeting: { en: 'Evening, something warm.', fr: 'En soirée, quelque chose de doux.', ar: 'مساءً، شيء دافئ يليق بالهدوء.' },
      note: { en: 'Low-caffeine roasted hojicha, Valrhona chocolate, and quiet table light.', fr: 'Hojicha torréfié, chocolat Valrhona et lumière tamisée.', ar: 'هوجيتشا محمص هادئ وشوكولاتة فالرونا الدافئة.' },
    },
  },
  firstPour: {
    label: { en: 'The First Pour', fr: 'La Première Extraction', ar: 'السكب الأول' },
    headline: { en: 'Poured into something made by hand.', fr: 'Versé dans ce qui est façonné à la main.', ar: 'تُسكب في ما صُنع باليد.' },
    leftHotspot: { en: 'Hand-glazed clay', fr: 'Argile émaillée main', ar: 'طين مطلي يدوياً' },
    rightHotspot: { en: 'Stamped with our logo', fr: 'Estampillée de notre sceau', ar: 'مختوم بشعارنا' },
    tapHint: { en: 'Tap the glowing pins on the cups', fr: 'Touchez les points jaunes sur les tasses', ar: 'انقر على النقاط المضيئة فوق الأكواب' },
  },
  blend: {
    label: { en: 'House Roast', fr: 'Torréfaction Maison', ar: 'التحميص الخاص' },
    turnSunHint: { en: 'Turn the sun', fr: 'Tournez le soleil', ar: 'أدِر الشمس' },
    peelCornerLabel: { en: 'Peel sticker', fr: 'Décoller l’étiquette', ar: 'انزع الملصق' },
    stickBackBtn: { en: 'Stick it back', fr: 'Recoller l’étiquette', ar: 'أعد لصق البطاقة' },
    showDetailsBtn: { en: 'Show details', fr: 'Afficher les détails', ar: 'عرض التفاصيل' },
    hideDetailsBtn: { en: 'Hide details', fr: 'Masquer les détails', ar: 'إخفاء التفاصيل' },
    specHeader: { en: 'BATCH SPEC SHEET', fr: 'FICHE DE TORRÉFACTION', ar: 'بطاقة مواصفات الدفعة' },
    roastedFor: { en: 'Roasted for Qahwa.', fr: 'Torréfié pour Qahwa.', ar: 'محمّصة لـ قهوة.' },
    wheelAriaLabel: {
      en: 'Flavor Sun dial. Use left or right arrow keys or drag to turn.',
      fr: 'Roue solaire des saveurs. Glissez ou utilisez les flèches gauche et droite.',
      ar: 'قرص شمس النكهات. اسحب أو استخدم الأسهم للتدوير.',
    },
  },
  ceramics: {
    label: { en: 'The Ceramic Wall', fr: 'Le Mur de Céramique', ar: 'جدار الفخار' },
    heading: { en: 'Crafted by hand, fired slow.', fr: 'Façonnés à la main, cuits lentement.', ar: 'صُنعت باليد، وشُويت على مهل.' },
    stamp: { en: 'Handmade. Take it home.', fr: 'Fait main. Emportez-le.', ar: 'صنع يدوي. اقتنِ قطعتك.' },
    close: { en: 'Close', fr: 'Fermer', ar: 'إغلاق' },
    prev: { en: 'Previous', fr: 'Précédent', ar: 'السابق' },
    next: { en: 'Next', fr: 'Suivant', ar: 'التالي' },
  },
  balance: {
    label: { en: 'Stone Stack', fr: 'L’Équilibre', ar: 'توازن الأحجار' },
    headingPre: { en: 'Find your ', fr: 'Trouvez votre ', ar: 'اعثر على ' },
    headingStamp: { en: 'BALANCE.', fr: 'ÉQUILIBRE.', ar: 'توازنك.' },
    instructions: {
      en: 'Stack with care, like our bags. Place all three stones and hold still for 3 seconds.',
      fr: 'Empilez avec soin, comme nos sachets. Maintenez les trois pierres immobiles 3 secondes.',
      ar: 'رتّب الأحجار بعناية مثل أكياس قهوتنا، وثبّتها بسكون لثلاث ثوانٍ.',
    },
    holdLabel: { en: 'Hold steady', fr: 'Maintenez', ar: 'حافظ على الثبات' },
    firingLabel: { en: 'Firing in the kiln…', fr: 'Cuisson au four…', ar: 'لحظة الشواء في الفرن…' },
    attemptsLabel: { en: 'Attempts', fr: 'Essais', ar: 'المحاولات' },
    timeLabel: { en: 'Time', fr: 'Temps', ar: 'الوقت' },
    bestLabel: { en: 'Your best', fr: 'Votre record', ar: 'أفضل توقيت' },
    resetBtn: { en: 'Reset stones', fr: 'Replacer', ar: 'إعادة ضبط' },
    wonHeadline: { en: 'You found your balance.', fr: 'Vous avez trouvé votre équilibre.', ar: 'لقد وجدت توازنك.' },
    certHeader: { en: 'QAHWA • CERTIFICATE OF BALANCE', fr: 'QAHWA • CERTIFICAT D’ÉQUILIBRE', ar: 'قهوة • شهادة توازن' },
    namePlaceholder: { en: 'Your name (optional)', fr: 'Votre prénom (optionnel)', ar: 'اسمك (اختياري)' },
    ranks: {
      master: { en: 'Master of Balance', fr: 'Maître de l’Équilibre', ar: 'سيّد التوازن' },
      potter: { en: 'Potter', fr: 'Potier', ar: 'صانع الفخار' },
      apprentice: { en: 'Apprentice', fr: 'Apprenti', ar: 'المتدرّب' },
    },
    quote: {
      en: 'Some things are worth taking slowly.',
      fr: 'Certaines choses méritent d’être vécues lentement.',
      ar: 'بعض الأشياء تستحق أن تُؤخذ على مهل.',
    },
    dateLabel: { en: 'Date', fr: 'Date', ar: 'التاريخ' },
    downloadBtn: { en: 'Download your certificate', fr: 'Télécharger le certificat', ar: 'تحميل الشهادة' },
    shareBtn: { en: 'Share', fr: 'Partager', ar: 'مشاركة' },
    copiedNotice: { en: 'Link copied', fr: 'Lien copié', ar: 'تم نسخ الرابط' },
    playAgainBtn: { en: 'Play again', fr: 'Rejouer', ar: 'العب مجدداً' },
  },
  polaroids: {
    label: { en: 'Community', fr: 'Communauté', ar: 'أصدقاء قهوة' },
    heading: { en: 'What people wear at Qahwa.', fr: 'Ce que l’on porte chez Qahwa.', ar: 'ما يرتديه زوّار قهوة.' },
    hint: { en: 'Toss, drag & bring memories to the front', fr: 'Déplacez les polaroïds librement', ar: 'اسحب الصور لتتصفح اللحظات' },
  },
  tableTalk: {
    label: { en: 'Guest Wall', fr: 'Le Mur des Hôtes', ar: 'جدار الضيوف' },
    headline: { en: 'TABLE TALK.', fr: 'ÉCHOS DE TABLE.', ar: 'حديث الطاولات.' },
    reviewsCountLabel: { en: '830 reviews on Google', fr: '830 avis sur Google', ar: '٨٣٠ تقييماً على جوجل' },
    mostMentioned: { en: 'Most mentioned on Google', fr: 'Les plus cités sur Google', ar: 'الأكثر ذكراً على جوجل' },
    googleReviewTag: { en: 'Google review', fr: 'Avis Google', ar: 'تقييم جوجل' },
    readFullLink: {
      en: 'Read the full review on Google',
      fr: 'Lire l’avis complet sur Google',
      ar: 'اقرأ التقييم كاملاً على جوجل',
    },
    translateBtn: { en: 'Translate', fr: 'Traduire', ar: 'ترجمة' },
    hideTranslationBtn: { en: 'Hide translation', fr: 'Masquer la traduction', ar: 'إخفاء الترجمة' },
    translationLabel: { en: 'Translation', fr: 'Traduction', ar: 'الترجمة' },
    guestPhotoCredit: { en: 'Guest photo on Google', fr: 'Photo d’un visiteur sur Google', ar: 'صورة زائر على جوجل' },
    beenHereCta: {
      en: 'Been to Qahwa? Tell us.',
      fr: 'Déjà passé chez Qahwa ? Racontez-nous.',
      ar: 'هل زرت قهوة من قبل؟ شاركنا رأيك.',
    },
    dragHint: { en: 'Drag or tap a note', fr: 'Déplacez ou ouvrez un mot', ar: 'اسحب أي بطاقة أو افتحها' },
  },
  ritual: {
    label: { en: 'Daily Reel', fr: 'Le Rituel', ar: 'الطقس اليومي' },
    bigTitle: { en: 'THE RITUAL', fr: 'LE RITUEL', ar: 'الطقوس' },
    captions: {
      one: { en: 'Pour.', fr: 'Verser.', ar: 'صبّ.' },
      two: { en: 'Press.', fr: 'Presser.', ar: 'اعصر.' },
      three: { en: 'Sip.', fr: 'Savourer.', ar: 'ارتشف.' },
    },
    watchMore: { en: 'Watch more on Instagram @qahwathecoffee', fr: 'Voir plus sur Instagram @qahwathecoffee', ar: 'شاهد المزيد على إنستغرام @qahwathecoffee' },
  },
  visit: {
    label: { en: 'The Window', fr: 'La Vitrine', ar: 'النافذة' },
    heading: { en: 'Sit awhile in Hydra.', fr: 'Installez-vous à Hydra.', ar: 'اجلس معنا في حيدرة.' },
    tagOpen: { en: 'Come in, we’re open', fr: 'Entrez, nous sommes ouverts', ar: 'تفضّل، المقهى مفتوح' },
    tagBreak: { en: 'Back at 14:30', fr: 'De retour à 14:30', ar: 'نعود عند ١٤:٣٠' },
    tagClosed: { en: 'See you tomorrow', fr: 'À demain', ar: 'نلتقي غداً' },
    openNow: { en: 'Open now', fr: 'Ouvert maintenant', ar: 'مفتوح الآن' },
    closesAt: { en: 'closes at', fr: 'ferme à', ar: 'يغلق عند' },
    middayBreak: { en: 'Friday midday pause', fr: 'Pause du vendredi', ar: 'استراحة الجمعة' },
    opensAt: { en: 'opens at', fr: 'ouvre à', ar: 'يفتح عند' },
    closedNow: { en: 'Closed', fr: 'Fermé', ar: 'مغلق الآن' },
    hoursTitle: { en: 'Opening Hours (Algiers GMT+1)', fr: 'Horaires d’ouverture (Alger GMT+1)', ar: 'أوقات العمل (توقيت الجزائر)' },
    dailyHours: { en: 'Sat – Thu · 08:00 – 21:00', fr: 'Sam – Jeu · 08:00 – 21:00', ar: 'السبت – الخميس · ٠٨:٠٠ – ٢١:٠٠' },
    fridayHours: { en: 'Friday · 09:00 – 12:30 & 14:30 – 21:00', fr: 'Vendredi · 09:00 – 12:30 & 14:30 – 21:00', ar: 'الجمعة · ٠٩:٠٠ – ١٢:٣٠ و ١٤:٣٠ – ٢١:٠٠' },
    plusCodeLabel: { en: 'Plus Code', fr: 'Code Plus', ar: 'الرمز المكاني' },
    chips: {
      delivery: { en: 'Delivery', fr: 'Livraison', ar: 'توصيل' },
      driveThrough: { en: 'Drive-through', fr: 'Service au volant', ar: 'خدمة السيارات' },
      typicalSpend: {
        en: 'Typically 1,000–2,000 DZD per person (estimate on Google)',
        fr: 'En général 1 000–2 000 DZD par personne (estimation Google)',
        ar: 'عادةً ١٬٠٠٠–٢٬٠٠٠ دج للشخص (تقدير جوجل)',
      },
    },
    howToFindUs: { en: 'How to find us', fr: 'Comment nous trouver', ar: 'كيف تصل إلينا' },
    tapToExplore: { en: 'Tap to explore map', fr: 'Toucher pour explorer', ar: 'انقر لاستكشاف الخريطة' },
    directionsBtn: { en: 'Get directions', fr: 'Itinéraire', ar: 'احصل على الاتجاهات' },
    mapsBtn: { en: 'Open in Google Maps', fr: 'Ouvrir dans Google Maps', ar: 'افتح في خرائط جوجل' },
    copyAddressBtn: { en: 'Copy address', fr: 'Copier l’adresse', ar: 'نسخ العنوان' },
    copiedAddress: { en: 'Address copied', fr: 'Adresse copiée', ar: 'تم نسخ العنوان' },
    igBtn: { en: 'Instagram', fr: 'Instagram', ar: 'إنستغرام' },
    waBtn: { en: 'WhatsApp', fr: 'WhatsApp', ar: 'واتساب' },
    waPending: {
      en: 'WhatsApp (coming soon)',
      fr: 'WhatsApp (bientôt)',
      ar: 'واتساب (قريباً)',
    },
  },
  footer: {
    madeWithCare: { en: 'Made with care in Algiers', fr: 'Façonné avec soin à Alger', ar: 'صُنع بعناية في الجزائر' },
    rights: { en: 'Specialty Coffee, Matcha & Ceramics', fr: 'Café de Spécialité, Matcha & Céramique', ar: 'قهوة مختصة، ماتشا وفخار يدوي' },
  },
  delights: {
    awayTitle: {
      en: 'We notice you’re gone ☕',
      fr: 'On remarque votre absence ☕',
      ar: 'نفتقد وجودك ☕',
    },
  },
};
