/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'jp' | 'ph';

export interface Translation {
  homeTitle: string;
  homeSubtitle: string;
  searchPlaceholder: string;
  nearMe: string;
  savedLocations: string;
  noSavedLocations: string;
  resultsNearYou: string;
  backHome: string;
  openNow: string;
  directions: string;
  call: string;
  back: string;
  login: string;
  signup: string;
  forgotPassword: string;
  welcomeBack: string;
  createAccount: string;
  resetPassword: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  fullNamePlaceholder: string;
  noResults: string;
  filterBy: string;
  categories: string;
  maxDistance: string;
  minRating: string;
  all: string;
  hospitals: string;
  pharmacies: string;
  clinics: string;
  labs: string;
  veterinary: string;
  quickAccess: string;
  closed: string;
  listView: string;
  mapView: string;
  allServices: string;
  km: string;
  emergency: string;
  dental: string;
}

export const translations: Record<LanguageCode, Translation> = {
  en: {
    homeTitle: "Healthcare track,",
    homeSubtitle: "right where you are.",
    searchPlaceholder: "Search for clinics, pharmacies...",
    nearMe: "Near Me",
    savedLocations: "Saved Locations",
    noSavedLocations: "No saved locations yet",
    resultsNearYou: "Results Near You",
    backHome: "Back Home",
    openNow: "Open Now",
    directions: "Directions",
    call: "Call",
    back: "Back",
    login: "Login",
    signup: "Sign Up",
    forgotPassword: "Forgot Password?",
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    resetPassword: "Reset Password",
    emailPlaceholder: "Email Address",
    passwordPlaceholder: "Password",
    fullNamePlaceholder: "Full Name",
    noResults: "No locations found in this area.",
    filterBy: "Filter By",
    categories: "Categories",
    maxDistance: "Max Distance",
    minRating: "Min Rating",
    all: "All",
    hospitals: "Hospitals",
    pharmacies: "Pharmacies",
    clinics: "Clinics",
    labs: "Laboratories",
    veterinary: "Veterinary",
    quickAccess: "Quick Access Categories",
    closed: "Closed",
    listView: "List View",
    mapView: "Map View",
    allServices: "All Services",
    km: "km",
    emergency: "Emergency",
    dental: "Dental",
  },
  es: {
    homeTitle: "Seguimiento de salud,",
    homeSubtitle: "justo donde estás.",
    searchPlaceholder: "Buscar clínicas, farmacias...",
    nearMe: "Cerca de mí",
    savedLocations: "Ubicaciones guardadas",
    noSavedLocations: "Aún no hay ubicaciones guardadas",
    resultsNearYou: "Resultados cerca de ti",
    backHome: "Volver al inicio",
    openNow: "Abierto ahora",
    directions: "Direcciones",
    call: "Llamar",
    back: "Volver",
    login: "Iniciar sesión",
    signup: "Registrarse",
    forgotPassword: "¿Olvidaste tu contraseña?",
    welcomeBack: "Bienvenido de nuevo",
    createAccount: "Crear cuenta",
    resetPassword: "Restablecer contraseña",
    emailPlaceholder: "Correo electrónico",
    passwordPlaceholder: "Contraseña",
    fullNamePlaceholder: "Nombre completo",
    noResults: "No se encontraron ubicaciones.",
    filterBy: "Filtrar por",
    categories: "Categorías",
    maxDistance: "Distancia máxima",
    minRating: "Calificación mínima",
    all: "Todos",
    hospitals: "Hospitales",
    pharmacies: "Farmacias",
    clinics: "Clínicas",
    labs: "Laboratorios",
    veterinary: "Veterinaria",
    quickAccess: "Categorías de acceso rápido",
    closed: "Cerrado",
    listView: "Vista de lista",
    mapView: "Vista de mapa",
    allServices: "Todos los servicios",
    km: "km",
    emergency: "Emergencia",
    dental: "Dental",
  },
  fr: {
    homeTitle: "Suivi de santé,",
    homeSubtitle: "juste là où vous êtes.",
    searchPlaceholder: "Chercher cliniques, pharmacies...",
    nearMe: "Près de moi",
    savedLocations: "Lieux enregistrés",
    noSavedLocations: "Pas encore de lieux enregistrés",
    resultsNearYou: "Résultats à proximité",
    backHome: "Retour accueil",
    openNow: "Ouvert maintenant",
    directions: "Itinéraire",
    call: "Appeler",
    back: "Retour",
    login: "Connexion",
    signup: "S'inscrire",
    forgotPassword: "Mot de passe oublié ?",
    welcomeBack: "Bon retour",
    createAccount: "Créer un compte",
    resetPassword: "Réinitialiser",
    emailPlaceholder: "Adresse e-mail",
    passwordPlaceholder: "Mot de passe",
    fullNamePlaceholder: "Nom complet",
    noResults: "Aucun lieu trouvé.",
    filterBy: "Filtrer par",
    categories: "Catégories",
    maxDistance: "Distance max",
    minRating: "Note min",
    all: "Tous",
    hospitals: "Hôpitaux",
    pharmacies: "Pharmacies",
    clinics: "Cliniques",
    labs: "Laboratoires",
    veterinary: "Vétérinaire",
    quickAccess: "Catégories d'accès rapide",
    closed: "Fermé",
    listView: "Vue liste",
    mapView: "Vue carte",
    allServices: "Tous les services",
    km: "km",
    emergency: "Urgence",
    dental: "Dentaire",
  },
  de: {
    homeTitle: "Gesundheits-Tracker,",
    homeSubtitle: "genau dort, wo Sie sind.",
    searchPlaceholder: "Kliniken, Apotheken suchen...",
    nearMe: "In der Nähe",
    savedLocations: "Gespeicherte Orte",
    noSavedLocations: "Noch keine gespeicherten Orte",
    resultsNearYou: "Ergebnisse in Ihrer Nähe",
    backHome: "Zurück Home",
    openNow: "Jetzt offen",
    directions: "Route",
    call: "Anrufen",
    back: "Zurück",
    login: "Anmelden",
    signup: "Registrieren",
    forgotPassword: "Passwort vergessen?",
    welcomeBack: "Willkommen zurück",
    createAccount: "Konto erstellen",
    resetPassword: "Passwort zurücksetzen",
    emailPlaceholder: "E-Mail-Adresse",
    passwordPlaceholder: "Passwort",
    fullNamePlaceholder: "Vollständiger Name",
    noResults: "Keine Orte gefunden.",
    filterBy: "Filtern nach",
    categories: "Kategorien",
    maxDistance: "Max. Entfernung",
    minRating: "Min. Bewertung",
    all: "Alle",
    hospitals: "Krankenhäuser",
    pharmacies: "Apotheken",
    clinics: "Kliniken",
    labs: "Labore",
    veterinary: "Tierarzt",
    quickAccess: "Schnellzugriffskategorien",
    closed: "Geschlossen",
    listView: "Listenansicht",
    mapView: "Kartenansicht",
    allServices: "Alle Dienste",
    km: "km",
    emergency: "Notfall",
    dental: "Zahnmedizin",
  },
  jp: {
    homeTitle: "ヘルスケア追跡、",
    homeSubtitle: "あなたのいるその場所に。",
    searchPlaceholder: "クリニック、薬局を検索...",
    nearMe: "周辺検索",
    savedLocations: "保存済み",
    noSavedLocations: "保存された場所はありません",
    resultsNearYou: "周辺の結果",
    backHome: "ホームへ戻る",
    openNow: "営業中",
    directions: "ルート案内",
    call: "電話",
    back: "戻る",
    login: "ログイン",
    signup: "新規登録",
    forgotPassword: "パスワードを忘れた場合",
    welcomeBack: "おかえりなさい",
    createAccount: "アカウント作成",
    resetPassword: "パスワード再設定",
    emailPlaceholder: "メールアドレス",
    passwordPlaceholder: "パスワード",
    fullNamePlaceholder: "氏名",
    noResults: "場所が見つかりませんでした。",
    filterBy: "フィルター",
    categories: "カテゴリー",
    maxDistance: "最大距離",
    minRating: "最小評価",
    all: "すべて",
    hospitals: "病院",
    pharmacies: "薬局",
    clinics: "クリニック",
    labs: "検査機関",
    veterinary: "動物病院",
    quickAccess: "クイックアクセス",
    closed: "閉鎖中",
    listView: "リスト表示",
    mapView: "地図表示",
    allServices: "すべてのサービス",
    km: "km",
    emergency: "緊急",
    dental: "歯科",
  },
  ph: {
    homeTitle: "Subaybay sa Kalusugan,",
    homeSubtitle: "kung nasaan ka man.",
    searchPlaceholder: "Maghanap ng mga klinika, botika...",
    nearMe: "Malapit sa Akin",
    savedLocations: "Naka-save na Lokasyon",
    noSavedLocations: "Wala pang naka-save na lokasyon",
    resultsNearYou: "Mga Resulta Malapit sa Iyo",
    backHome: "Balik Home",
    openNow: "Bukás Ngayon",
    directions: "Direksyon",
    call: "Tumawag",
    back: "Bumalik",
    login: "Mag-login",
    signup: "Mag-sign Up",
    forgotPassword: "Nakalimutan ang Password?",
    welcomeBack: "Tuloy Po Kayo",
    createAccount: "Gumawa ng Account",
    resetPassword: "I-reset ang Password",
    emailPlaceholder: "Email Address",
    passwordPlaceholder: "Password",
    fullNamePlaceholder: "Buong Pangalan",
    noResults: "Walang nakitang lokasyon sa lugar na ito.",
    filterBy: "I-filter Ayon Sa",
    categories: "Mga Kategorya",
    maxDistance: "Pinakamalayong Distansya",
    minRating: "Pinakamababang Rating",
    all: "Lahat",
    hospitals: "Mga Ospital",
    pharmacies: "Mga Botika",
    clinics: "Mga Klinika",
    labs: "Mga Laboratoryo",
    veterinary: "Beterinaryo",
    quickAccess: "I-access Agad Ang Mga Kategorya",
    closed: "Sarado",
    listView: "Listahan",
    mapView: "Mapa",
    allServices: "Lahat ng Serbisyo",
    km: "km",
    emergency: "Emerhensiya",
    dental: "Dental",
  }
};

export const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'jp', name: '日本語', flag: '🇯🇵' },
  { code: 'ph', name: 'Filipino', flag: '🇵🇭' },
] as const;
