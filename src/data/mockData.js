import { Droplets, Snowflake, Sparkles, Tv, Wind, Zap } from "lucide-react";

export const serviceCategories = [
  {
    id: "plumbing",
    title: "Plumbing",
    localTitle: "Water systems and repairs",
    description: "Leak fixes, piping upgrades, drainage support, and water heater checkups.",
    icon: Droplets,
    accent: "from-[#dff7f2] via-white to-[#eef8ff]",
    eta: "Avg. arrival 45 min",
    startingPrice: "from ETB 650",
  },
  {
    id: "electrical",
    title: "Electrical",
    localTitle: "Safe wiring and power work",
    description: "Install sockets, fix outages, inspect panels, and modernize old wiring.",
    icon: Zap,
    accent: "from-[#fff0d8] via-white to-[#fff8ef]",
    eta: "Emergency slots open",
    startingPrice: "from ETB 850",
  },
  {
    id: "appliance",
    title: "Appliance Care",
    localTitle: "Fridge, washer, cooker support",
    description: "Reliable diagnostics and repair visits for the appliances you use every day.",
    icon: Snowflake,
    accent: "from-[#e4efff] via-white to-[#f4f8ff]",
    eta: "Same-day options",
    startingPrice: "from ETB 900",
  },
  {
    id: "tv",
    title: "TV Repair",
    localTitle: "Display and electronics care",
    description: "Screen issues, sound faults, signal setup, and accessory troubleshooting.",
    icon: Tv,
    accent: "from-[#efe9ff] via-white to-[#f7f4ff]",
    eta: "Remote triage available",
    startingPrice: "from ETB 700",
  },
  {
    id: "cleaning",
    title: "Cleaning",
    localTitle: "Move-in and deep cleaning",
    description: "Detailed home refreshes, kitchen sanitizing, and recurring upkeep plans.",
    icon: Sparkles,
    accent: "from-[#e7fbef] via-white to-[#f4fff9]",
    eta: "Flexible weekly plans",
    startingPrice: "from ETB 500",
  },
  {
    id: "cooling",
    title: "Cooling and AC",
    localTitle: "Ventilation and air quality",
    description: "AC servicing, filter cleaning, installation, and airflow optimization.",
    icon: Wind,
    accent: "from-[#dff8ff] via-white to-[#f3fdff]",
    eta: "Commercial support too",
    startingPrice: "from ETB 1,100",
  },
];

export const technicians = [
  {
    id: "tsion-abebe",
    name: "Tsion Abebe",
    specialty: "Electrical systems specialist",
    serviceId: "electrical",
    city: "Addis Ababa",
    rating: 4.9,
    experience: 8,
    responseTime: "Responds in 12 min",
    completedJobs: 184,
    availability: "Available today",
    priceHint: "Inspection from ETB 900",
    photo:
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=900&q=80",
    skills: ["Panel upgrades", "Generator backup", "Lighting design"],
  },
  {
    id: "dawit-merga",
    name: "Dawit Merga",
    specialty: "Plumbing and leak diagnostics",
    serviceId: "plumbing",
    city: "Addis Ababa",
    rating: 5,
    experience: 11,
    responseTime: "Responds in 18 min",
    completedJobs: 246,
    availability: "On route nearby",
    priceHint: "Visit from ETB 700",
    photo:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=900&q=80",
    skills: ["Drainage", "Solar heaters", "Bathroom installs"],
  },
  {
    id: "selam-tekle",
    name: "Selam Tekle",
    specialty: "Appliance and fridge technician",
    serviceId: "appliance",
    city: "Hawassa",
    rating: 4.8,
    experience: 6,
    responseTime: "Responds in 24 min",
    completedJobs: 131,
    availability: "Tomorrow morning",
    priceHint: "Diagnosis from ETB 950",
    photo:
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=900&q=80",
    skills: ["Fridges", "Washers", "Cookers"],
  },
  {
    id: "yonas-gebre",
    name: "Yonas Gebre",
    specialty: "Cooling and AC engineer",
    serviceId: "cooling",
    city: "Adama",
    rating: 4.7,
    experience: 9,
    responseTime: "Responds in 15 min",
    completedJobs: 158,
    availability: "Available this afternoon",
    priceHint: "Service from ETB 1,200",
    photo:
      "https://images.unsplash.com/photo-1595475038784-bbe439ff41e6?auto=format&fit=crop&w=900&q=80",
    skills: ["Inverters", "Commercial AC", "Air quality"],
  },
  {
    id: "marta-kassa",
    name: "Marta Kassa",
    specialty: "Home cleaning crew lead",
    serviceId: "cleaning",
    city: "Addis Ababa",
    rating: 4.9,
    experience: 7,
    responseTime: "Responds in 10 min",
    completedJobs: 219,
    availability: "Slots open this evening",
    priceHint: "Packages from ETB 550",
    photo:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80",
    skills: ["Move-in cleaning", "Office refresh", "Weekly plans"],
  },
  {
    id: "abel-hailu",
    name: "Abel Hailu",
    specialty: "TV and electronics repair",
    serviceId: "tv",
    city: "Bahir Dar",
    rating: 4.6,
    experience: 5,
    responseTime: "Responds in 32 min",
    completedJobs: 92,
    availability: "Available tomorrow",
    priceHint: "Repair from ETB 800",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    skills: ["Display faults", "Audio repair", "Setup and tuning"],
  },
];

export const trustHighlights = [
  {
    title: "Vetted professionals",
    text: "Every technician is reviewed for skill quality, customer care, and reliability before going live.",
  },
  {
    title: "Clear pricing",
    text: "Customers see starting rates, booking windows, and payment options before confirming a visit.",
  },
  {
    title: "Fast matching",
    text: "Service requests are routed to the best nearby professional based on category and availability.",
  },
];

export const serviceCoverage = [
  {
    city: "Addis Ababa",
    zones: ["Bole", "CMC", "Sarbet", "Megenagna", "Kazanchis"],
    eta: "35-60 min",
    supportHours: "24/7 hotline",
  },
  {
    city: "Adama",
    zones: ["Piassa", "Kebele 03", "Geda"],
    eta: "45-90 min",
    supportHours: "6:00 AM - 10:00 PM",
  },
  {
    city: "Hawassa",
    zones: ["Tabor", "Piassa", "Haile Resort area"],
    eta: "45-90 min",
    supportHours: "6:00 AM - 10:00 PM",
  },
  {
    city: "Bahir Dar",
    zones: ["Kebele 14", "Abay Mado", "Poly area"],
    eta: "60-120 min",
    supportHours: "7:00 AM - 9:00 PM",
  },
];

export const paymentOptions = [
  {
    id: "telebirr",
    name: "Telebirr",
    tone: "green",
    description: "Best for instant confirmation after booking.",
  },
  {
    id: "cbebirr",
    name: "CBEBirr",
    tone: "indigo",
    description: "Use bank-linked mobile payment for scheduled visits.",
  },
  {
    id: "cash",
    name: "Cash",
    tone: "blue",
    description: "Pay on completion for standard household service calls.",
  },
];

export const supportChannels = [
  {
    title: "Phone support",
    value: "+251 900 000 000",
    detail: "For urgent plumbing, power, and lock issues.",
  },
  {
    title: "Telegram support",
    value: "@EthioTechHelp",
    detail: "Quick follow-up on bookings, pricing, and technician arrival.",
  },
  {
    title: "Email support",
    value: "support@ethiotech.et",
    detail: "Best for invoices, disputes, and account help.",
  },
];

export const supportFaqs = [
  {
    question: "How should I describe my location in Ethiopia?",
    answer:
      "Include your city, area, nearby landmark, and if possible your condominium block or house number. Landmarks help technicians find you faster.",
  },
  {
    question: "Which payments work best for bookings?",
    answer:
      "Telebirr and CBEBirr are the fastest for confirmation. Cash remains available for customers who prefer to pay after service completion.",
  },
  {
    question: "Can I request urgent service late at night?",
    answer:
      "Emergency electrical, plumbing, and lock-related requests are prioritized in Addis Ababa through the hotline and the urgent booking option.",
  },
  {
    question: "How do I know a technician is trustworthy?",
    answer:
      "Every listed technician is reviewed before activation, and each profile shows rating, work history, and supported skill areas.",
  },
];

export const bookingSupportTips = [
  "Share a nearby landmark such as a school, church, mall, or condominium gate.",
  "Choose urgent only when the issue affects safety, water, electricity, or security.",
  "Keep your phone available after booking so the technician can confirm arrival.",
];

export const userBookings = [
  {
    id: "BK-2084",
    service: "Electrical safety check",
    technician: "Tsion Abebe",
    status: "Scheduled",
    dateLabel: "Today, 4:30 PM",
    address: "Bole Atlas, Addis Ababa",
    price: "ETB 1,250",
    paymentMethod: "Telebirr",
  },
  {
    id: "BK-2038",
    service: "Kitchen drainage repair",
    technician: "Dawit Merga",
    status: "Completed",
    dateLabel: "Apr 18, 10:00 AM",
    address: "CMC Sunshine, Addis Ababa",
    price: "ETB 980",
    paymentMethod: "Cash",
  },
  {
    id: "BK-1981",
    service: "Deep cleaning package",
    technician: "Marta Kassa",
    status: "Completed",
    dateLabel: "Apr 14, 9:00 AM",
    address: "Sarbet, Addis Ababa",
    price: "ETB 1,600",
    paymentMethod: "CBEBirr",
  },
];

export const technicianPerformance = {
  name: "Tsion Abebe",
  role: "Electrical systems specialist",
  weeklyEarnings: "ETB 12,450",
  responseRate: "97%",
  completionRate: "94%",
  monthlyRating: "4.9/5",
};

export const technicianQueue = [
  {
    id: "JOB-771",
    customer: "Rahel Solomon",
    service: "Lighting rewire",
    schedule: "Today, 1:30 PM",
    location: "Kazanchis",
    status: "In progress",
    budget: "ETB 2,400",
  },
  {
    id: "JOB-775",
    customer: "Nahom Bekele",
    service: "Socket replacement",
    schedule: "Today, 5:00 PM",
    location: "Bole",
    status: "Confirmed",
    budget: "ETB 1,100",
  },
  {
    id: "JOB-782",
    customer: "Meklit Ayele",
    service: "Backup generator check",
    schedule: "Tomorrow, 9:00 AM",
    location: "Megenagna",
    status: "Pending materials",
    budget: "ETB 3,700",
  },
];

export const payoutHistory = [
  { day: "Mon", amount: "ETB 2,200" },
  { day: "Tue", amount: "ETB 1,850" },
  { day: "Wed", amount: "ETB 2,950" },
  { day: "Thu", amount: "ETB 1,700" },
  { day: "Fri", amount: "ETB 3,750" },
];
