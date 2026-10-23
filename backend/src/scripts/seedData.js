// Demo data only. Names and contact details are fictional.
// Real cat photos are loaded from CATAAS for demo purposes.

const catImage = (seed) =>
  `https://cataas.com/cat?width=800&height=600&seed=${encodeURIComponent(seed)}`;

const images = (label) => [
  catImage(`${label}-1`),
  catImage(`${label}-2`),
  catImage(`${label}-3`),
];

export const cats = [
  { name: "Luna", breed: "Persian", gender: "female", age: 4, ageUnit: "months", color: "White", location: "Ahmedabad", price: 25000, status: "available", featured: true, healthStatus: "healthy", vaccinationStatus: "fully_vaccinated", personality: ["Gentle", "Calm", "Affectionate"], description: "Luna is a fluffy white Persian kitten who loves slow mornings and soft blankets. She is litter trained and gets along well with children." },
  { name: "Oliver", breed: "British Shorthair", gender: "male", age: 3, ageUnit: "months", color: "Blue-grey", location: "Mumbai", price: 32000, status: "available", featured: true, healthStatus: "healthy", vaccinationStatus: "partially_vaccinated", personality: ["Playful", "Curious", "Easygoing"], description: "Oliver has the round face and plush coat British Shorthairs are known for. He enjoys feather toys and will happily nap on your lap afterwards." },
  { name: "Bella", breed: "Ragdoll", gender: "female", age: 5, ageUnit: "months", color: "Seal bicolor", location: "Pune", price: 45000, status: "available", featured: true, healthStatus: "healthy", vaccinationStatus: "fully_vaccinated", personality: ["Docile", "Cuddly", "Quiet"], description: "Bella is a relaxed Ragdoll who goes limp in your arms when picked up. She follows her people from room to room and loves gentle brushing." },
  { name: "Simba", breed: "Maine Coon", gender: "male", age: 6, ageUnit: "months", color: "Brown tabby", location: "Bengaluru", price: 55000, status: "reserved", featured: false, healthStatus: "healthy", vaccinationStatus: "fully_vaccinated", personality: ["Friendly", "Bold", "Chatty"], description: "Simba is a large-boned Maine Coon with tufted ears and a bushy tail. Sociable with other pets, he is already reserved for a family." },
  { name: "Cleo", breed: "Siamese", gender: "female", age: 2, ageUnit: "years", color: "Seal point", location: "Delhi", price: 18000, status: "available", featured: false, healthStatus: "healthy", vaccinationStatus: "fully_vaccinated", personality: ["Vocal", "Intelligent", "Loyal"], description: "Cleo is an elegant adult Siamese with bright blue eyes. She loves conversation and puzzle feeders, and suits a home where someone is around often." },
  { name: "Milo", breed: "Bengal", gender: "male", age: 4, ageUnit: "months", color: "Brown rosetted", location: "Mumbai", price: 60000, status: "available", featured: true, healthStatus: "healthy", vaccinationStatus: "partially_vaccinated", personality: ["Energetic", "Adventurous", "Athletic"], description: "Milo is a spotted Bengal kitten with endless energy. He needs climbing space and daily play, and would thrive with an active family." },
  { name: "Shadow", breed: "Russian Blue", gender: "male", age: 1, ageUnit: "years", color: "Silver-blue", location: "Ahmedabad", price: 30000, status: "sold", featured: false, healthStatus: "healthy", vaccinationStatus: "fully_vaccinated", personality: ["Shy", "Gentle", "Loyal"], description: "Shadow is a reserved Russian Blue who warms up quickly once he trusts you. He has found his forever home." },
  { name: "Coco", breed: "Scottish Fold", gender: "female", age: 3, ageUnit: "months", color: "Cream", location: "Surat", price: 40000, status: "available", featured: false, healthStatus: "healthy", vaccinationStatus: "partially_vaccinated", personality: ["Sweet", "Playful", "Social"], description: "Coco is a cream Scottish Fold kitten with folded ears and a sweet, curious nature. She enjoys company and settles in quickly." },
  { name: "Pepper", breed: "Persian", gender: "male", age: 2, ageUnit: "years", color: "Charcoal", location: "Pune", price: 15000, status: "available", featured: false, healthStatus: "healthy", vaccinationStatus: "fully_vaccinated", personality: ["Calm", "Independent", "Quiet"], description: "Pepper is a mellow adult Persian who prefers a quiet routine. A good match for a calm household or first-time cat owners." },
  { name: "Nala", breed: "Maine Coon", gender: "female", age: 10, ageUnit: "weeks", color: "Silver tabby", location: "Delhi", price: 50000, status: "available", featured: false, healthStatus: "healthy", vaccinationStatus: "not_vaccinated", personality: ["Curious", "Sweet", "Active"], description: "Nala is a young silver tabby Maine Coon who will be ready for her first vaccinations soon. She is already confident and very curious." },
  { name: "Ginger", breed: "Indian Domestic", gender: "male", age: 5, ageUnit: "months", color: "Orange tabby", location: "Ahmedabad", price: 3000, status: "available", featured: true, healthStatus: "healthy", vaccinationStatus: "fully_vaccinated", personality: ["Cheerful", "Affectionate", "Hardy"], description: "Ginger is a cheerful orange tabby with a big heart. A healthy, low-maintenance companion looking for a loving home." },
  { name: "Zara", breed: "Siamese", gender: "female", age: 6, ageUnit: "months", color: "Lilac point", location: "Bengaluru", price: 22000, status: "sold", featured: false, healthStatus: "healthy", vaccinationStatus: "fully_vaccinated", personality: ["Talkative", "Smart", "Playful"], description: "Zara is a lilac point Siamese who loves to chat. She has already gone home with her new family." },
  { name: "Smokey", breed: "British Shorthair", gender: "female", age: 1, ageUnit: "years", color: "Grey", location: "Mumbai", price: 28000, status: "reserved", featured: false, healthStatus: "healthy", vaccinationStatus: "fully_vaccinated", personality: ["Relaxed", "Loving", "Steady"], description: "Smokey is a calm grey British Shorthair who enjoys quiet company and the occasional play session. Currently reserved." },
].map((cat) => ({ ...cat, images: images(cat.name) }));

export const testimonials = [
  { name: "Priya S.", location: "Ahmedabad", catName: "Luna", rating: 5, approved: true, message: "The whole process was clear and friendly. Luna settled into our home within a day and has become part of the family." },
  { name: "Rahul M.", location: "Mumbai", catName: "Oliver", rating: 5, approved: true, message: "We had plenty of questions and every one was answered honestly. Oliver arrived healthy and curious. Highly recommended." },
  { name: "Ananya K.", location: "Pune", catName: "Bella", rating: 4, approved: true, message: "Great communication from the first enquiry to bringing Bella home. The health details were shared upfront, which gave us confidence." },
  { name: "Karan D.", location: "Delhi", catName: "Cleo", rating: 5, approved: true, message: "Cleo is exactly the chatty companion we hoped for. Thank you for matching us so well." },
  { name: "Meera P.", location: "Bengaluru", catName: "Zara", rating: 5, approved: true, message: "Simple, transparent and caring. We felt supported even after Zara came home." },
  { name: "Demo Visitor", location: "Surat", catName: "Coco", rating: 4, approved: false, message: "This testimonial is waiting for admin approval and should NOT appear on the public API." },
];

// "catName" is resolved to a real Cat _id by the seed script
export const enquiries = [
  { name: "Aarav Demo", email: "aarav.demo@example.com", phone: "9000000001", catName: "Luna", status: "new", message: "Hello, is Luna still available? I would like to know about visiting hours." },
  { name: "Diya Demo", email: "diya.demo@example.com", phone: "9000000002", catName: "Milo", status: "contacted", message: "We have a large apartment. Is Milo suitable for a family with a dog?" },
  { name: "Ishaan Demo", email: "ishaan.demo@example.com", phone: "9000000003", catName: "Oliver", status: "closed", message: "Can you share vaccination details for Oliver, please?" },
  { name: "Sana Demo", email: "sana.demo@example.com", phone: "9000000004", catName: null, status: "new", message: "General question: do you help with transport to another city?" },
];
