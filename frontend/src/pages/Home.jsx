import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShieldCheck, Search, Users } from "lucide-react";
import FeaturedCats from "../components/home/FeaturedCats.jsx";
import Testimonials from "../components/home/Testimonials.jsx";
import { FALLBACK_CAT_IMAGE, handleImageError } from "../utils/imageUtils.js";

const breeds = [
  "Persian",
  "British Shorthair",
  "Ragdoll",
  "Maine Coon",
  "Siamese",
  "Bengal",
];

function Hero() {
  return (
    <section className="overflow-hidden bg-brand-50">
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
            Find your perfect feline companion
          </span>

          <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-gray-900 sm:text-6xl">
            Find Your{" "}
            <span className="text-brand-600">Purrfect</span>{" "}
            Companion
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            PurrConnect helps you discover cats, explore their
            personalities, and connect with the companion that feels
            right for you.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/cats"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700"
            >
              Explore Cats
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-800 hover:border-brand-300"
            >
              How It Works
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&auto=format&fit=crop&q=80"
              alt="PurrConnect adorable featured companion cat"
              className="h-full w-full object-cover"
              onError={(e) => handleImageError(e, FALLBACK_CAT_IMAGE)}
            />
          </div>

          <div className="absolute -bottom-5 -left-4 rounded-2xl bg-white p-4 shadow-xl sm:-left-8">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <Heart className="h-5 w-5 text-green-600" />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">
                  Made for cat lovers
                </p>
                <p className="text-xs text-gray-500">
                  Discover. Connect. Belong.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PopularBreeds() {
  return (
    <section id="breeds" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-brand-600">
            Explore possibilities
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Popular Breeds
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {breeds.map((breed) => (
            <Link
              key={breed}
              to={`/cats?breed=${encodeURIComponent(breed)}`}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center font-semibold text-gray-800 transition hover:-translate-y-1 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              {breed}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const items = [
    {
      icon: ShieldCheck,
      title: "Health Information",
      text: "View health and vaccination information before making a decision.",
    },
    {
      icon: Search,
      title: "Easy Discovery",
      text: "Search and filter cats based on breed, location, gender and more.",
    },
    {
      icon: Users,
      title: "Meaningful Connections",
      text: "Connect with the right cat through a simple enquiry process.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-brand-600">
            Why PurrConnect
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            A better way to find your companion
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl bg-white p-7 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
                <Icon className="h-6 w-6 text-brand-600" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ["01", "Explore", "Browse cats and discover their personalities."],
    ["02", "Connect", "Choose a cat and send an enquiry."],
    ["03", "Meet", "Continue the conversation and plan the next step."],
  ];

  return (
    <section id="how-it-works" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-brand-600">Simple process</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map(([number, title, text]) => (
            <div key={number} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                {number}
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                {title}
              </h3>

              <p className="mt-3 text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      question: "How do I find a cat?",
      answer:
        "Visit the Cats page and use search and filters to discover cats that match your preferences.",
    },
    {
      question: "Can I enquire about a specific cat?",
      answer:
        "Yes. Open a cat's profile and use the enquiry option to send your details and message.",
    },
    {
      question: "Can I make a general enquiry?",
      answer:
        "Yes. You can contact PurrConnect directly without selecting a specific cat.",
    },
    {
      question: "Are all cats available?",
      answer:
        "Cat profiles show their current status, such as available, reserved or sold.",
    },
  ];

  return (
    <section id="faq" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-brand-600">Questions?</p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-semibold text-gray-900">
                {faq.question}
              </summary>

              <p className="mt-3 leading-7 text-gray-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-brand-600 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to meet your purrfect companion?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-brand-50">
          Start exploring cats and find a companion who could become
          part of your story.
        </p>

        <Link
          to="/cats"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-700 hover:bg-brand-50"
        >
          Explore Cats
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <PopularBreeds />
      <FeaturedCats />
      <TrustSection />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}