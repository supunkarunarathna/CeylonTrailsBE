/**
 * Populates the database with sample content: destinations, tours, hotels,
 * testimonials, blog posts, an admin user, and the itinerary template
 * catalog used by the "Create Your Own Itinerary" matching engine.
 *
 * Run with: npm run db:seed  (after npm run db:init)
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const {
  User,
  Destination,
  Tour,
  Hotel,
  Testimonial,
  BlogPost,
  ItineraryTemplate,
} = require('../models');

const destinations = [
  {
    name: 'Galle',
    slug: 'galle',
    region: 'coastal',
    description: 'A UNESCO World Heritage fort city on the southern coast, famed for its Dutch colonial ramparts, boutique cafes and sunset ocean views. Cobbled streets wind past centuries-old churches, mosques and merchant houses that have been lovingly restored into galleries, guesthouses and cafes.',
    image: 'https://picsum.photos/seed/ceylon-trails-galle-1/1200/800',
    images: [
      'https://picsum.photos/seed/ceylon-trails-galle-1/1200/800',
      'https://picsum.photos/seed/ceylon-trails-galle-2/1200/800',
      'https://picsum.photos/seed/ceylon-trails-galle-3/1200/800',
      'https://picsum.photos/seed/ceylon-trails-galle-4/1200/800',
    ],
    famousFor: ['UNESCO World Heritage fort walls', 'Dutch colonial architecture', 'The Galle Lighthouse', 'Boutique shopping and cafes'],
    activities: ['Walk the fort ramparts at sunset', 'Browse boutique and antique shops', 'Visit the Maritime Archaeology Museum', 'Enjoy rooftop dining with ocean views', 'Day trips to nearby turtle hatcheries'],
    emergencyContacts: {
      hospital: { name: 'Galle National Hospital (Karapitiya)', note: 'Main government teaching hospital serving the Galle area' },
      policeStation: { name: 'Galle Police Station', note: 'Main police station for the Galle Fort and city area' },
    },
  },
  {
    name: 'Mirissa',
    slug: 'mirissa',
    region: 'coastal',
    description: 'A laid-back beach town known for whale watching, palm-fringed sands and a relaxed surf scene. By day the harbour buzzes with fishing boats and whale-watching cruises; by night, beachfront shacks light up with lanterns and seafood barbecues.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200',
      'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1200',
    ],
    famousFor: ['Blue whale and dolphin watching', 'Coconut Tree Hill viewpoint', 'Golden sandy beaches', 'Laid-back surf culture'],
    activities: ['Morning whale and dolphin watching cruise', 'Surf lessons for beginners', 'Sunset at Coconut Tree Hill', 'Beach hopping to Weligama', 'Fresh seafood dinners on the sand'],
    emergencyContacts: {
      hospital: { name: 'Matara District General Hospital', note: 'Nearest major hospital, roughly 20-25 minutes from Mirissa' },
      policeStation: { name: 'Mirissa Police Station', note: 'Local police station serving the Mirissa beach area' },
    },
  },
  {
    name: 'Ella',
    slug: 'ella',
    region: 'hill_country',
    description: "A misty mountain village surrounded by tea plantations, waterfalls and the iconic Nine Arches Bridge. Cooler air, panoramic ridge walks and a laid-back cafe scene make it a favourite stop for travellers making their way through the hill country.",
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1200',
      'https://images.unsplash.com/photo-1571847390590-8f8ee1e7d5f5?q=80&w=1200',
      'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1200',
    ],
    famousFor: ['The Nine Arches Bridge', "Little Adam's Peak", 'Rolling tea plantations', 'Ravana Falls'],
    activities: ["Sunrise hike up Little Adam's Peak", 'Photograph a train crossing Nine Arches Bridge', 'Walk through working tea estates', 'Swim at Ravana Falls', 'Zipline over the valley'],
    emergencyContacts: {
      hospital: { name: 'Bandarawela District General Hospital', note: 'Nearest major hospital, roughly 30 minutes from Ella' },
      policeStation: { name: 'Ella Police Station', note: 'Local police station serving the Ella village area' },
    },
  },
  {
    name: 'Nuwara Eliya',
    slug: 'nuwara-eliya',
    region: 'hill_country',
    description: "Known as 'Little England', a cool-climate hill town of manicured tea gardens and colonial-era architecture. Tudor-style cottages, a golf course and rose gardens sit at almost 2,000 metres, giving it a climate unlike anywhere else on the island.",
    image: 'https://picsum.photos/seed/ceylon-trails-nuwara-eliya-1/1200/800',
    images: [
      'https://picsum.photos/seed/ceylon-trails-nuwara-eliya-1/1200/800',
      'https://picsum.photos/seed/ceylon-trails-nuwara-eliya-2/1200/800',
      'https://picsum.photos/seed/ceylon-trails-nuwara-eliya-3/1200/800',
    ],
    famousFor: ['Ceylon tea estates and factories', 'Cool colonial-era climate', 'Gregory Lake', 'Horton Plains National Park'],
    activities: ['Tour a working tea factory and tasting room', 'Boat ride on Gregory Lake', 'Sunrise trek to World\'s End in Horton Plains', 'Stroll the Victoria Park rose gardens', 'Visit a strawberry farm'],
    emergencyContacts: {
      hospital: { name: 'Nuwara Eliya District General Hospital', note: 'Main government hospital in Nuwara Eliya town' },
      policeStation: { name: 'Nuwara Eliya Police Station', note: 'Main police station for the town centre' },
    },
  },
  {
    name: 'Sigiriya',
    slug: 'sigiriya',
    region: 'cultural_triangle',
    description: "Home to the ancient rock fortress rising 200 metres above the jungle, one of Sri Lanka's most iconic sites. Built atop a granite monolith in the 5th century, the site combines dramatic engineering with lush water gardens at its base.",
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1200',
      'https://images.unsplash.com/photo-1625124326157-ef5b8bfa8b3f?q=80&w=1200',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200',
    ],
    famousFor: ['The Sigiriya Rock Fortress', 'Ancient frescoes of the "Sigiriya Damsels"', 'Symmetrical water gardens', 'Pidurangala Rock viewpoint'],
    activities: ['Climb the rock fortress to the summit palace ruins', 'View the ancient fresco gallery', 'Sunrise hike up Pidurangala Rock for the classic view of Sigiriya', 'Explore the water and boulder gardens', 'Village tour by bullock cart'],
    emergencyContacts: {
      hospital: { name: 'Dambulla Base Hospital', note: 'Nearest major hospital, roughly 20 minutes from Sigiriya' },
      policeStation: { name: 'Sigiriya Police Station', note: 'Local police station serving the Sigiriya area' },
    },
  },
  {
    name: 'Kandy',
    slug: 'kandy',
    region: 'cultural_triangle',
    description: 'The cultural capital of Sri Lanka, home to the Temple of the Sacred Tooth Relic and a scenic lake. As the last capital of the ancient Sinhalese kings, Kandy remains the spiritual heart of the island and a UNESCO World Heritage city.',
    image: 'https://picsum.photos/seed/ceylon-trails-kandy-1/1200/800',
    images: [
      'https://picsum.photos/seed/ceylon-trails-kandy-1/1200/800',
      'https://picsum.photos/seed/ceylon-trails-kandy-2/1200/800',
      'https://picsum.photos/seed/ceylon-trails-kandy-3/1200/800',
    ],
    famousFor: ['Temple of the Sacred Tooth Relic', 'Kandy Lake', 'Royal Botanical Gardens, Peradeniya', 'Traditional Kandyan dance'],
    activities: ['Visit the Temple of the Tooth', 'Walk around Kandy Lake at sunset', 'Explore the Royal Botanical Gardens', 'Watch a traditional cultural dance show', 'Browse the local gem and spice markets'],
    emergencyContacts: {
      hospital: { name: 'National Hospital (Teaching), Kandy', note: 'Main government teaching hospital in Kandy' },
      policeStation: { name: 'Kandy Police Station', note: 'Main police station for the Kandy city area' },
    },
  },
  {
    name: 'Yala National Park',
    slug: 'yala',
    region: 'wildlife',
    description: "Sri Lanka's most visited national park, with one of the highest leopard densities in the world. Beyond leopards, the park's mix of scrub jungle, lagoons and coastline supports elephants, sloth bears, crocodiles and prolific birdlife.",
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200',
    ],
    famousFor: ['One of the highest leopard densities on Earth', 'Wild elephant herds', 'Coastal jungle and lagoons', 'Prolific birdlife'],
    activities: ['Full-day or half-day jeep safari', 'Leopard and elephant tracking with a park ranger', 'Birdwatching around the lagoons', 'Sunrise game drive', 'Stargazing from an eco-camp'],
    emergencyContacts: {
      hospital: { name: 'Tissamaharama Base Hospital', note: 'Nearest hospital to the Yala park entrance area' },
      policeStation: { name: 'Tissamaharama Police Station', note: 'Nearest police station to the Yala park entrance area' },
    },
  },
  {
    name: 'Colombo',
    slug: 'colombo',
    region: 'city',
    description: 'The vibrant commercial capital, blending colonial architecture, rooftop bars and buzzing street food markets. A melting pot of Sri Lankan, colonial and contemporary influences, Colombo is usually the first and last stop on any island itinerary.',
    image: 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?q=80&w=1200',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200',
    ],
    famousFor: ['Galle Face Green oceanfront promenade', 'Pettah street markets', 'Colonial-era architecture', 'A buzzing rooftop dining scene'],
    activities: ['Sunset stroll along Galle Face Green', 'Explore the markets and temples of Pettah', 'Visit the Gangaramaya Temple', 'Rooftop bar hopping', 'Street food tour of Sri Lankan short eats'],
    emergencyContacts: {
      hospital: { name: 'National Hospital of Sri Lanka', note: "The country's largest government hospital, in central Colombo" },
      policeStation: { name: 'Colombo Fort Police Station', note: 'Main police station for the Colombo Fort / city centre area' },
    },
  },
];

const tours = [
  {
    title: 'Southern Coast Boutique Escape',
    slug: 'southern-coast-boutique-escape',
    summary: 'Beach hopping between Galle, Mirissa and Tangalle with boutique villa stays.',
    description: 'Unwind along the golden southern coastline, staying in handpicked boutique villas, exploring the Galle Fort, whale watching in Mirissa, and enjoying quiet coves in Tangalle.',
    category: 'coastal',
    durationDays: 5,
    price: 650,
    images: ['https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200'],
    highlights: ['Galle Fort walking tour', 'Whale watching cruise', 'Private beach dinners', 'Boutique villa stays'],
    dayPlan: [
      { day: 1, title: 'Arrival & Galle Fort', description: 'Transfer to Galle, evening walking tour of the fort ramparts.' },
      { day: 2, title: 'Galle to Mirissa', description: 'Coastal drive, afternoon at leisure on Mirissa beach.' },
      { day: 3, title: 'Whale Watching', description: 'Early morning whale watching cruise, relax by the beach.' },
      { day: 4, title: 'Mirissa to Tangalle', description: 'Visit hidden coves and a turtle hatchery en route.' },
      { day: 5, title: 'Departure', description: 'Free morning, transfer to airport.' },
    ],
    featured: true,
    rating: 4.8,
  },
  {
    title: 'Hill Country Tea Trails',
    slug: 'hill-country-tea-trails',
    summary: 'Scenic train rides, tea estates and misty mountains from Kandy to Ella.',
    description: 'A journey through the emerald hills of Sri Lanka\'s tea country, riding the famous Kandy-Ella train, walking through tea estates and hiking to panoramic viewpoints.',
    category: 'hill_country',
    durationDays: 4,
    price: 520,
    images: ['https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1200'],
    highlights: ['Kandy to Ella scenic train', 'Tea factory visit', "Little Adam's Peak hike", 'Nine Arches Bridge'],
    dayPlan: [
      { day: 1, title: 'Kandy exploration', description: 'Temple of the Tooth, Kandy Lake, cultural dance show.' },
      { day: 2, title: 'Scenic train to Ella', description: 'One of the world\'s most scenic train journeys through tea country.' },
      { day: 3, title: 'Ella hikes', description: "Little Adam's Peak sunrise hike, Nine Arches Bridge, Ravana Falls." },
      { day: 4, title: 'Tea estate & departure', description: 'Tea factory tour and tasting before onward transfer.' },
    ],
    featured: true,
    rating: 4.9,
  },
  {
    title: 'Ancient Kingdoms Cultural Triangle',
    slug: 'ancient-kingdoms-cultural-triangle',
    summary: 'Sigiriya Rock Fortress, ancient temples and ruins of the cultural triangle.',
    description: 'Explore over 2,000 years of history across Sigiriya, Dambulla, Polonnaruwa and Anuradhapura, Sri Lanka\'s ancient royal capitals.',
    category: 'cultural',
    durationDays: 4,
    price: 580,
    images: ['https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1200'],
    highlights: ['Sigiriya Rock climb', 'Dambulla Cave Temple', 'Polonnaruwa ruins', 'Village bullock cart ride'],
    dayPlan: [
      { day: 1, title: 'Sigiriya Rock Fortress', description: 'Climb the ancient rock fortress and explore the water gardens.' },
      { day: 2, title: 'Dambulla & village tour', description: 'Cave temple visit and a traditional village experience.' },
      { day: 3, title: 'Polonnaruwa ruins', description: 'Cycle through the ancient city of Polonnaruwa.' },
      { day: 4, title: 'Anuradhapura & departure', description: 'Sacred city visit before departure transfer.' },
    ],
    featured: true,
    rating: 4.7,
  },
  {
    title: 'Yala Wilderness Safari',
    slug: 'yala-wilderness-safari',
    summary: 'Leopard tracking and wildlife safaris in Yala National Park.',
    description: 'A wildlife-focused escape with guided jeep safaris in search of leopards, elephants and prolific birdlife, staying at eco-luxury tented camps.',
    category: 'wildlife',
    durationDays: 3,
    price: 480,
    images: ['https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200'],
    highlights: ['Full-day jeep safari', 'Leopard tracking', 'Eco-camp stay', 'Birdwatching'],
    dayPlan: [
      { day: 1, title: 'Arrival & evening safari', description: 'Check-in and an introductory evening game drive.' },
      { day: 2, title: 'Full day safari', description: 'Full-day jeep safari across Yala\'s five blocks.' },
      { day: 3, title: 'Morning safari & departure', description: 'Sunrise safari before transfer onward.' },
    ],
    featured: false,
    rating: 4.6,
  },
  {
    title: 'Family Discovery Circuit',
    slug: 'family-discovery-circuit',
    summary: 'A relaxed, family-friendly loop covering culture, wildlife and beaches.',
    description: 'Designed for families travelling with children, this circuit balances history, wildlife and beach downtime with comfortable pacing and kid-friendly activities.',
    category: 'family',
    durationDays: 7,
    price: 890,
    images: ['https://images.unsplash.com/photo-1571847390590-8f8ee1e7d5f5?q=80&w=1200'],
    highlights: ['Elephant orphanage visit', 'Sigiriya', 'Beach resort stay', 'Turtle hatchery'],
    dayPlan: [
      { day: 1, title: 'Arrival & Pinnawala', description: 'Visit the elephant orphanage on the way inland.' },
      { day: 2, title: 'Sigiriya', description: 'Family-paced climb of the rock fortress.' },
      { day: 3, title: 'Kandy', description: 'Temple of the Tooth and lake-side stroll.' },
      { day: 4, title: 'Nuwara Eliya', description: 'Tea gardens and Gregory Lake boating.' },
      { day: 5, title: 'Transfer to the coast', description: 'Scenic drive down to the southern beaches.' },
      { day: 6, title: 'Beach day', description: 'Turtle hatchery visit and relaxed beach time.' },
      { day: 7, title: 'Departure', description: 'Free morning before airport transfer.' },
    ],
    featured: false,
    rating: 4.8,
  },
  {
    title: 'Adventure Trail: Rivers & Ridgelines',
    slug: 'adventure-trail-rivers-ridgelines',
    summary: 'White-water rafting, ridge hikes and canyoning across the highlands.',
    description: 'An active itinerary for thrill seekers: white-water rafting in Kitulgala, ridge hikes in Ella and canyoning in the central highlands.',
    category: 'adventure',
    durationDays: 5,
    price: 610,
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200'],
    highlights: ['White-water rafting', 'Canyoning', 'Ridge hiking', 'Waterfall abseiling'],
    dayPlan: [
      { day: 1, title: 'Kitulgala rafting', description: 'White-water rafting session on the Kelani River.' },
      { day: 2, title: 'Transfer to the highlands', description: 'Scenic drive with stops at viewpoints.' },
      { day: 3, title: 'Canyoning', description: 'Guided canyoning and waterfall abseiling.' },
      { day: 4, title: 'Ella ridge hike', description: "Ella Rock and Little Adam's Peak." },
      { day: 5, title: 'Departure', description: 'Transfer onward.' },
    ],
    featured: false,
    rating: 4.5,
  },
];

const hotels = [
  {
    name: 'Ramparts Boutique Villa',
    slug: 'ramparts-boutique-villa',
    location: 'Galle Fort',
    region: 'coastal',
    description: 'A restored 17th-century Dutch villa within the fort walls, featuring an infinity pool overlooking the ocean.',
    pricePerNight: 180,
    rating: 4.9,
    amenities: ['Infinity pool', 'Free WiFi', 'Breakfast included', 'Air conditioning', 'Airport transfer'],
    images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200'],
  },
  {
    name: 'Palm Cove Beach House',
    slug: 'palm-cove-beach-house',
    location: 'Mirissa',
    region: 'coastal',
    description: 'A beachfront retreat with private cabanas, steps away from Mirissa\'s golden sands.',
    pricePerNight: 140,
    rating: 4.7,
    amenities: ['Beachfront', 'Free WiFi', 'Bicycle rental', 'Restaurant'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200'],
  },
  {
    name: 'Misty Ridge Tea Bungalow',
    slug: 'misty-ridge-tea-bungalow',
    location: 'Ella',
    region: 'hill_country',
    description: 'A cosy colonial-era bungalow set among tea gardens with panoramic valley views.',
    pricePerNight: 120,
    rating: 4.8,
    amenities: ['Mountain views', 'Fireplace', 'Free WiFi', 'Breakfast included'],
    images: ['https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1200'],
  },
  {
    name: 'Grand Colonial Nuwara Eliya',
    slug: 'grand-colonial-nuwara-eliya',
    location: 'Nuwara Eliya',
    region: 'hill_country',
    description: 'A heritage manor hotel evoking old English charm amid manicured gardens.',
    pricePerNight: 160,
    rating: 4.6,
    amenities: ['Garden views', 'Fireplace lounge', 'Free WiFi', 'Spa'],
    images: ['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200'],
  },
  {
    name: 'Rock View Heritage Hotel',
    slug: 'rock-view-heritage-hotel',
    location: 'Sigiriya',
    region: 'cultural_triangle',
    description: 'A heritage property with uninterrupted views of the Sigiriya rock fortress.',
    pricePerNight: 150,
    rating: 4.7,
    amenities: ['Rock fortress views', 'Swimming pool', 'Free WiFi', 'Restaurant'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200'],
  },
  {
    name: 'Lakeside Kandy Residence',
    slug: 'lakeside-kandy-residence',
    location: 'Kandy',
    region: 'cultural_triangle',
    description: 'A boutique guesthouse overlooking Kandy Lake, minutes from the Temple of the Tooth.',
    pricePerNight: 110,
    rating: 4.5,
    amenities: ['Lake views', 'Free WiFi', 'Breakfast included', 'Airport transfer'],
    images: ['https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=1200'],
  },
  {
    name: 'Yala Wild Eco Camp',
    slug: 'yala-wild-eco-camp',
    location: 'Yala',
    region: 'wildlife',
    description: 'Luxury tented camp on the edge of Yala National Park, blending comfort with wilderness.',
    pricePerNight: 220,
    rating: 4.9,
    amenities: ['Guided safaris', 'En-suite tents', 'Full board', 'Campfire dinners'],
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200'],
  },
  {
    name: 'Urban Loft Colombo',
    slug: 'urban-loft-colombo',
    location: 'Colombo',
    region: 'city',
    description: 'A design-forward boutique hotel in the heart of Colombo\'s commercial district.',
    pricePerNight: 130,
    rating: 4.4,
    amenities: ['Rooftop bar', 'Free WiFi', 'Gym', 'Business centre'],
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200'],
  },
];

const testimonials = [
  { name: 'Emma Clarke', country: 'United Kingdom', rating: 5, message: 'Our custom itinerary matched exactly what we wanted — hill country hikes and quiet beaches. Every detail was handled beautifully.', tourCode: 'CT-DEMO-1001' },
  { name: 'Lukas Weber', country: 'Germany', rating: 5, message: 'The tuk-tuk itinerary through the cultural triangle was unforgettable. Authentic, flexible, and great value.', tourCode: 'CT-DEMO-1002' },
  { name: 'Priya Nair', country: 'India', rating: 4, message: 'Loved the boutique villa stays on the southern coast. The whale watching add-on was a highlight for our kids.', tourCode: 'CT-DEMO-1003' },
  { name: 'Sophie Martin', country: 'France', rating: 5, message: "The 'Create Your Own Itinerary' tool saved us so much planning time — it suggested a perfect van tour for our group of 6.", tourCode: 'CT-DEMO-1004' },
];

const blogPosts = [
  {
    title: 'A First-Timer\'s Guide to the Kandy–Ella Train',
    slug: 'first-timers-guide-kandy-ella-train',
    excerpt: 'Everything you need to know about booking, timing and seating for Sri Lanka\'s most scenic rail journey.',
    content: 'The Kandy to Ella train winds through emerald tea estates, misty mountains and small hillside villages. Book observation-car seats in advance during peak season, travel mid-week to avoid crowds, and sit on the right-hand side for the best valley views...',
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1200',
    author: 'Ceylon Trails Team',
  },
  {
    title: 'Choosing Between a Tuk-Tuk, Van or Private Car',
    slug: 'choosing-tuk-tuk-van-private-car',
    excerpt: 'A practical comparison of Sri Lanka\'s most popular travel modes to help you plan your itinerary.',
    content: 'Tuk-tuks offer an authentic, flexible way to explore towns and short coastal stretches; vans suit families and groups covering longer distances in comfort; a private chauffeur-driven car balances flexibility with speed. Self-driving is possible with a valid international driving permit...',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
    author: 'Ceylon Trails Team',
  },
  {
    title: 'Best Time to Visit Sri Lanka\'s Coast vs Hill Country',
    slug: 'best-time-coast-vs-hill-country',
    excerpt: 'Sri Lanka has two monsoon seasons, meaning there is almost always a dry region to visit.',
    content: 'The southwest coast and hill country are driest from December to March, while the east coast and cultural triangle are best from May to September. Planning a mixed itinerary lets you chase the sun year-round...',
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1200',
    author: 'Ceylon Trails Team',
  },
];

// Itinerary templates for the "Create Your Own Itinerary" matching engine.
// Coverage spans all location types x travel modes x a range of budgets,
// group sizes and durations so the matcher can always surface 5 sensible
// options regardless of what a visitor selects.
const itineraryTemplates = [
  {
    title: 'Budget Backpacker Coastal Hop',
    description: 'Public buses and trains linking Galle, Mirissa and Tangalle for independent travellers.',
    locationTypes: ['coastal'],
    travelMode: 'public_transport',
    requiresLicense: false,
    minHeadcount: 1,
    maxHeadcount: 2,
    durationDays: 5,
    pricePerPerson: 280,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Colombo to Galle', description: 'Public train to Galle, evening at the fort.' },
      { day: 2, title: 'Galle to Mirissa', description: 'Local bus along the coast.' },
      { day: 3, title: 'Mirissa', description: 'Whale watching and beach time.' },
      { day: 4, title: 'Mirissa to Tangalle', description: 'Coastal bus, quiet beach coves.' },
      { day: 5, title: 'Return', description: 'Train back to Colombo.' },
    ],
  },
  {
    title: 'Tuk-Tuk Coastal Adventure',
    description: 'Self-guided tuk-tuk hire exploring hidden beaches and fishing villages at your own pace.',
    locationTypes: ['coastal'],
    travelMode: 'tuk_tuk',
    requiresLicense: false,
    minHeadcount: 1,
    maxHeadcount: 3,
    durationDays: 6,
    pricePerPerson: 420,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Pick up tuk-tuk in Galle', description: 'Orientation drive along the fort ramparts.' },
      { day: 2, title: 'Galle to Weligama', description: 'Stop at hidden coves and surf towns.' },
      { day: 3, title: 'Weligama to Mirissa', description: 'Whale watching cruise, beach evening.' },
      { day: 4, title: 'Mirissa to Tangalle', description: 'Fishing villages and quiet lagoons.' },
      { day: 5, title: 'Tangalle exploration', description: 'Turtle hatchery and secluded beaches.' },
      { day: 6, title: 'Return leg', description: 'Scenic drive back, drop off tuk-tuk.' },
    ],
  },
  {
    title: 'Private Van Southern Coast Tour',
    description: 'Comfortable chauffeur-driven van covering the best of the southern beaches for small groups.',
    locationTypes: ['coastal'],
    travelMode: 'van',
    requiresLicense: false,
    minHeadcount: 3,
    maxHeadcount: 8,
    durationDays: 5,
    pricePerPerson: 650,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Arrival & Galle Fort', description: 'Private transfer and guided fort walk.' },
      { day: 2, title: 'Galle to Mirissa', description: 'Comfortable van transfer, whale watching briefing.' },
      { day: 3, title: 'Whale watching', description: 'Morning cruise, afternoon at leisure.' },
      { day: 4, title: 'Mirissa to Tangalle', description: 'Scenic coastal drive with photo stops.' },
      { day: 5, title: 'Departure', description: 'Private transfer to airport.' },
    ],
  },
  {
    title: 'Self-Drive Coastal Explorer',
    description: 'Rent a car and self-drive the southern coastal highway at your own pace.',
    locationTypes: ['coastal'],
    travelMode: 'car',
    requiresLicense: true,
    minHeadcount: 1,
    maxHeadcount: 4,
    durationDays: 6,
    pricePerPerson: 560,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Collect rental car', description: 'Drive from Colombo to Galle via the expressway.' },
      { day: 2, title: 'Galle exploration', description: 'Self-guided fort and museum visits.' },
      { day: 3, title: 'Galle to Mirissa', description: 'Coastal drive with stops at viewpoints.' },
      { day: 4, title: 'Mirissa to Tangalle', description: 'Explore lagoons and beaches by car.' },
      { day: 5, title: 'Tangalle exploration', description: 'Day trip to Hoo Maniya blowhole.' },
      { day: 6, title: 'Return drive', description: 'Drive back to Colombo, drop off car.' },
    ],
  },
  {
    title: 'Scenic Rail Hill Country Journey',
    description: 'Train travel through tea country from Kandy to Ella, the classic budget-friendly route.',
    locationTypes: ['hill_country'],
    travelMode: 'public_transport',
    requiresLicense: false,
    minHeadcount: 1,
    maxHeadcount: 2,
    durationDays: 4,
    pricePerPerson: 260,
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Kandy', description: 'Temple of the Tooth and lake walk.' },
      { day: 2, title: 'Train to Nuwara Eliya', description: 'Scenic rail journey and tea garden walk.' },
      { day: 3, title: 'Nuwara Eliya to Ella', description: 'Continue by train through tea plantations.' },
      { day: 4, title: 'Ella hikes & return', description: "Little Adam's Peak before heading back." },
    ],
  },
  {
    title: 'Tuk-Tuk Tea Country Trail',
    description: 'Weave through backroads and tea estates by tuk-tuk, stopping wherever the view demands.',
    locationTypes: ['hill_country'],
    travelMode: 'tuk_tuk',
    requiresLicense: false,
    minHeadcount: 1,
    maxHeadcount: 3,
    durationDays: 5,
    pricePerPerson: 400,
    image: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Kandy pick-up', description: 'Drive into the hills toward Nuwara Eliya.' },
      { day: 2, title: 'Nuwara Eliya', description: 'Tea factory visits and Gregory Lake.' },
      { day: 3, title: 'Nuwara Eliya to Ella', description: 'Backroad drive through Ella Gap.' },
      { day: 4, title: 'Ella exploration', description: 'Nine Arches Bridge and Ravana Falls.' },
      { day: 5, title: 'Return', description: 'Drive back, drop off tuk-tuk.' },
    ],
  },
  {
    title: 'Private Van Tea Trails',
    description: 'A relaxed, chauffeur-driven journey through the misty hill country for families and groups.',
    locationTypes: ['hill_country'],
    travelMode: 'van',
    requiresLicense: false,
    minHeadcount: 3,
    maxHeadcount: 8,
    durationDays: 4,
    pricePerPerson: 610,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Kandy', description: 'Temple of the Tooth, cultural dance show.' },
      { day: 2, title: 'Kandy to Nuwara Eliya', description: 'Tea estate visit en route.' },
      { day: 3, title: 'Nuwara Eliya to Ella', description: 'Panoramic viewpoint stops by van.' },
      { day: 4, title: 'Ella & departure', description: 'Nine Arches Bridge before transfer onward.' },
    ],
  },
  {
    title: 'Self-Drive Highland Circuit',
    description: 'Drive yourself through winding mountain roads connecting Kandy, Nuwara Eliya and Ella.',
    locationTypes: ['hill_country'],
    travelMode: 'car',
    requiresLicense: true,
    minHeadcount: 1,
    maxHeadcount: 4,
    durationDays: 5,
    pricePerPerson: 540,
    image: 'https://images.unsplash.com/photo-1571847390590-8f8ee1e7d5f5?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Drive to Kandy', description: 'Self-drive from Colombo, temple visit.' },
      { day: 2, title: 'Kandy to Nuwara Eliya', description: 'Mountain pass driving, tea estate stop.' },
      { day: 3, title: 'Nuwara Eliya', description: 'Horton Plains day trip.' },
      { day: 4, title: 'Nuwara Eliya to Ella', description: 'Winding descent through Ella Gap.' },
      { day: 5, title: 'Return drive', description: 'Drive back toward Colombo.' },
    ],
  },
  {
    title: 'Budget Cultural Triangle by Bus',
    description: 'Explore ancient cities using local buses, ideal for independent budget travellers.',
    locationTypes: ['traditional'],
    travelMode: 'public_transport',
    requiresLicense: false,
    minHeadcount: 1,
    maxHeadcount: 2,
    durationDays: 4,
    pricePerPerson: 240,
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Dambulla', description: 'Cave Temple visit by local bus.' },
      { day: 2, title: 'Sigiriya', description: 'Climb the rock fortress.' },
      { day: 3, title: 'Polonnaruwa', description: 'Bicycle around the ancient ruins.' },
      { day: 4, title: 'Anuradhapura & return', description: 'Sacred city visit before heading back.' },
    ],
  },
  {
    title: 'Tuk-Tuk Temples & Ruins Trail',
    description: 'Village backroads and ancient sites explored by tuk-tuk with a local driver-guide.',
    locationTypes: ['traditional'],
    travelMode: 'tuk_tuk',
    requiresLicense: false,
    minHeadcount: 1,
    maxHeadcount: 3,
    durationDays: 4,
    pricePerPerson: 380,
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Sigiriya', description: 'Rock fortress and village lake tour.' },
      { day: 2, title: 'Village experience', description: 'Bullock cart ride and traditional lunch.' },
      { day: 3, title: 'Dambulla & Polonnaruwa', description: 'Cave temple and ancient city ruins.' },
      { day: 4, title: 'Return', description: 'Drive back, drop off tuk-tuk.' },
    ],
  },
  {
    title: 'Private Van Ancient Kingdoms Tour',
    description: 'A comfortable, guided circuit of Sigiriya, Dambulla, Polonnaruwa and Kandy.',
    locationTypes: ['traditional'],
    travelMode: 'van',
    requiresLicense: false,
    minHeadcount: 3,
    maxHeadcount: 8,
    durationDays: 4,
    pricePerPerson: 580,
    image: 'https://images.unsplash.com/photo-1625124326157-ef5b8bfa8b3f?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Sigiriya', description: 'Rock fortress climb with a private guide.' },
      { day: 2, title: 'Dambulla & village tour', description: 'Cave temple and traditional village visit.' },
      { day: 3, title: 'Polonnaruwa', description: 'Guided cycling tour of the ruins.' },
      { day: 4, title: 'Kandy & departure', description: 'Temple of the Tooth before transfer.' },
    ],
  },
  {
    title: 'Self-Drive Cultural Triangle',
    description: 'Independent self-drive touring of Sri Lanka\'s ancient capitals.',
    locationTypes: ['traditional'],
    travelMode: 'car',
    requiresLicense: true,
    minHeadcount: 1,
    maxHeadcount: 4,
    durationDays: 4,
    pricePerPerson: 500,
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Drive to Sigiriya', description: 'Self-drive from Colombo, rock fortress climb.' },
      { day: 2, title: 'Dambulla', description: 'Cave temple visit, drive to Polonnaruwa.' },
      { day: 3, title: 'Polonnaruwa', description: 'Self-guided cycling around the ruins.' },
      { day: 4, title: 'Return drive', description: 'Drive back via Kandy.' },
    ],
  },
  {
    title: 'Grand Van Circuit: Coast, Hills & Heritage',
    description: 'A comprehensive van tour combining beaches, tea country and ancient cities for larger groups.',
    locationTypes: ['coastal', 'hill_country', 'traditional'],
    travelMode: 'van',
    requiresLicense: false,
    minHeadcount: 4,
    maxHeadcount: 10,
    durationDays: 9,
    pricePerPerson: 1250,
    image: 'https://images.unsplash.com/photo-1571847390590-8f8ee1e7d5f5?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Arrival & Colombo', description: 'City orientation tour.' },
      { day: 2, title: 'Sigiriya', description: 'Rock fortress and water gardens.' },
      { day: 3, title: 'Dambulla & Polonnaruwa', description: 'Cave temple and ancient ruins.' },
      { day: 4, title: 'Kandy', description: 'Temple of the Tooth and cultural show.' },
      { day: 5, title: 'Nuwara Eliya', description: 'Tea estate tour, Gregory Lake.' },
      { day: 6, title: 'Ella', description: 'Nine Arches Bridge and hikes.' },
      { day: 7, title: 'Transfer to the coast', description: 'Scenic drive to Mirissa.' },
      { day: 8, title: 'Mirissa beach day', description: 'Whale watching and relaxation.' },
      { day: 9, title: 'Galle & departure', description: 'Fort visit before airport transfer.' },
    ],
  },
  {
    title: 'Backpacker Grand Loop by Public Transport',
    description: 'The full island loop covering coast, hills and heritage using trains and local buses.',
    locationTypes: ['coastal', 'hill_country', 'traditional'],
    travelMode: 'public_transport',
    requiresLicense: false,
    minHeadcount: 1,
    maxHeadcount: 2,
    durationDays: 10,
    pricePerPerson: 520,
    image: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Colombo', description: 'City exploration and rest.' },
      { day: 2, title: 'Bus to Sigiriya', description: 'Rock fortress climb.' },
      { day: 3, title: 'Polonnaruwa day trip', description: 'Bicycle around the ruins.' },
      { day: 4, title: 'Train to Kandy', description: 'Temple of the Tooth.' },
      { day: 5, title: 'Train to Nuwara Eliya', description: 'Tea gardens and lake.' },
      { day: 6, title: 'Train to Ella', description: 'Scenic rail journey and hikes.' },
      { day: 7, title: 'Bus to the south coast', description: 'Long travel day to Mirissa.' },
      { day: 8, title: 'Mirissa', description: 'Whale watching and beach time.' },
      { day: 9, title: 'Galle', description: 'Fort exploration.' },
      { day: 10, title: 'Return to Colombo', description: 'Departure.' },
    ],
  },
  {
    title: 'Tuk-Tuk Island Sampler',
    description: 'A flexible tuk-tuk tour sampling a bit of coast, hills and cultural sites for adventurous small groups.',
    locationTypes: ['coastal', 'hill_country', 'traditional'],
    travelMode: 'tuk_tuk',
    requiresLicense: false,
    minHeadcount: 1,
    maxHeadcount: 3,
    durationDays: 8,
    pricePerPerson: 720,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Kandy pick-up', description: 'Temple visit and orientation drive.' },
      { day: 2, title: 'Sigiriya', description: 'Rock fortress and village lake tour.' },
      { day: 3, title: 'Dambulla', description: 'Cave temple visit.' },
      { day: 4, title: 'Nuwara Eliya', description: 'Tea estate exploration.' },
      { day: 5, title: 'Ella', description: 'Nine Arches Bridge and hikes.' },
      { day: 6, title: 'Transfer to the coast', description: 'Scenic drive to the south.' },
      { day: 7, title: 'Mirissa', description: 'Beach day and whale watching.' },
      { day: 8, title: 'Galle & return', description: 'Fort visit, drop off tuk-tuk.' },
    ],
  },
  {
    title: 'Luxury Self-Drive Grand Tour',
    description: 'A premium self-drive circuit for confident drivers wanting total flexibility across the island.',
    locationTypes: ['coastal', 'hill_country', 'traditional'],
    travelMode: 'car',
    requiresLicense: true,
    minHeadcount: 2,
    maxHeadcount: 4,
    durationDays: 9,
    pricePerPerson: 1450,
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Collect rental car', description: 'Drive to Sigiriya.' },
      { day: 2, title: 'Sigiriya & Dambulla', description: 'Rock fortress and cave temple.' },
      { day: 3, title: 'Polonnaruwa', description: 'Self-guided cycling tour.' },
      { day: 4, title: 'Kandy', description: 'Temple of the Tooth.' },
      { day: 5, title: 'Nuwara Eliya', description: 'Tea estates, Horton Plains.' },
      { day: 6, title: 'Ella', description: 'Hikes and waterfalls.' },
      { day: 7, title: 'Drive to the coast', description: 'Scenic descent to Mirissa.' },
      { day: 8, title: 'Mirissa & Galle', description: 'Whale watching and fort visit.' },
      { day: 9, title: 'Return drive', description: 'Drive back and drop off car.' },
    ],
  },
  {
    title: 'Family Van Adventure: Beaches & Wildlife',
    description: 'A gentle family-paced van tour combining coastal downtime with wildlife encounters.',
    locationTypes: ['coastal', 'traditional'],
    travelMode: 'van',
    requiresLicense: false,
    minHeadcount: 4,
    maxHeadcount: 8,
    durationDays: 6,
    pricePerPerson: 780,
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200',
    dayPlan: [
      { day: 1, title: 'Arrival & Pinnawala', description: 'Elephant orphanage visit.' },
      { day: 2, title: 'Sigiriya', description: 'Family-paced rock fortress visit.' },
      { day: 3, title: 'Transfer to the coast', description: 'Scenic drive south.' },
      { day: 4, title: 'Beach day', description: 'Turtle hatchery and beach time.' },
      { day: 5, title: 'Mirissa', description: 'Family-friendly boat trip.' },
      { day: 6, title: 'Galle & departure', description: 'Fort visit before transfer.' },
    ],
  },
];

async function seed() {
  await sequelize.authenticate();
  require('../models');

  // Admin user
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@ceylontrails.com').toLowerCase();
  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', 10);
    await User.create({
      name: process.env.ADMIN_NAME || 'Site Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin',
    });
    console.log(`✔ Admin user created: ${adminEmail}`);
  } else {
    console.log('• Admin user already exists, skipping.');
  }

  for (const d of destinations) {
    // upsert (not findOrCreate) so re-running the seed also fills in new
    // fields (famousFor/activities/images) on destinations that already exist.
    await Destination.upsert(d);
  }
  console.log(`✔ Seeded ${destinations.length} destinations.`);

  for (const t of tours) {
    await Tour.findOrCreate({ where: { slug: t.slug }, defaults: t });
  }
  console.log(`✔ Seeded ${tours.length} tours.`);

  for (const h of hotels) {
    await Hotel.findOrCreate({ where: { slug: h.slug }, defaults: h });
  }
  console.log(`✔ Seeded ${hotels.length} hotels.`);

  const testimonialCount = await Testimonial.count();
  if (testimonialCount === 0) {
    await Testimonial.bulkCreate(testimonials);
  }
  console.log(`✔ Seeded testimonials.`);

  for (const b of blogPosts) {
    await BlogPost.findOrCreate({ where: { slug: b.slug }, defaults: b });
  }
  console.log(`✔ Seeded ${blogPosts.length} blog posts.`);

  const templateCount = await ItineraryTemplate.count();
  if (templateCount === 0) {
    await ItineraryTemplate.bulkCreate(itineraryTemplates);
  }
  console.log(`✔ Seeded ${itineraryTemplates.length} itinerary templates.`);

  console.log('\n✔ Seeding complete.');
  await sequelize.close();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('✘ Seeding failed:', err);
    process.exit(1);
  });
