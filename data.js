export const DEBUG = import.meta.env.DEV;

export const VIDEO_URL =
  "https://res.cloudinary.com/dbygakqm/video/upload/v1790595941/YouCut_20260928_124204770.mp4";

export const CONTENT = {
  home: {
    eyebrow: "AURELIA NIGERIA / 2026",
    title: "The road, reimagined.",
    description: "Precision-crafted performance for the people who choose their own horizon — from Lagos to Abuja.",
    primary: "Explore models",
    secondary: "Book a private drive",
    price: "From ₦185m",
    availability: "Lagos / Abuja",
    metrics: [["Veloce GT", "536 hp"], ["0—60 mph", "3.2 sec"], ["Range", "412 mi"]],
  },
  models: {
    eyebrow: "THE AURELIA LINE / NIGERIA",
    title: "Choose your drive.",
    description: "Three expressions of performance, configured for Nigerian roads and the way you move.",
    primary: "View available models",
    secondary: "Compare trims",
    price: "₦185m—₦260m",
    availability: "In stock / Pre-order",
    metrics: [["Veloce GT", "Grand touring"], ["Touring S", "Long range"], ["Urban E", "All electric"]],
  },
  experience: {
    eyebrow: "THE AURELIA DIFFERENCE",
    title: "Designed to be felt.",
    description: "From the first turn to the final detail, every decision is made around the drive and your destination.",
    primary: "Discover the craft",
    secondary: "Arrange a test drive",
    price: "Personal specification",
    availability: "Ikoyi / Wuse",
    metrics: [["Adaptive air", "Suspension"], ["Carbon shell", "Architecture"], ["Silent cabin", "Acoustics"]],
  },
  reviews: {
    eyebrow: "NIGERIAN AUTO ENTHUSIASTS",
    title: "The drive speaks for itself.",
    description: "Explore first impressions from our early-access community across Lagos and Abuja.",
    primary: "Read next review",
    secondary: "Book a private drive",
    price: "Community notes",
    availability: "Lagos / Abuja",
    metrics: [["Community", "Early access"], ["Reviews", "03 voices"], ["Drive", "By invitation"]],
  },
  contact: {
    eyebrow: "YOUR NEXT MOVE",
    title: "Meet us on the road.",
    description: "Start a conversation with an Aurelia specialist and arrange a private consultation in Nigeria.",
    primary: "Request a consultation",
    secondary: "Find a showroom",
    price: "Concierge service",
    availability: "Lagos / Abuja / PH",
    metrics: [["Lagos", "Victoria Island"], ["Abuja", "Wuse II"], ["Port Harcourt", "GRA"]],
  },
};

export const MODELS = [
  { name: "Veloce GT", type: "Performance coupe", price: "₦185m", detail: "536 hp · AWD" },
  { name: "Touring S", type: "Executive grand tourer", price: "₦220m", detail: "412 mi · AWD" },
  { name: "Urban E", type: "All-electric SUV", price: "₦260m", detail: "7 seats · 480 hp" },
];

export const NIGERIA_UPDATES = [
  "Private drives now available in Ikoyi",
  "New Urban E allocation arriving in Abuja",
  "Concierge delivery across Lagos and the FCT",
];

export const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "models", label: "Models" },
  { key: "experience", label: "Experience" },
  { key: "reviews", label: "Reviews" },
  { key: "contact", label: "Contact" },
];

export const TESTIMONIALS = [
  {
    quote: "The Veloce feels composed through Lagos traffic, but the moment the road opens up, it becomes something else entirely.",
    name: "Tobi A.", city: "Lagos", role: "Early-access driver",
  },
  {
    quote: "It has the presence of a luxury car without asking you to compromise on how it drives. The cabin is exceptionally calm.",
    name: "Amaka E.", city: "Abuja", role: "Aurelia community member",
  },
  {
    quote: "The details are what stayed with me — the response, the finish, and the confidence when the road gets unpredictable.",
    name: "Femi O.", city: "Port Harcourt", role: "Automotive enthusiast",
  },
];
