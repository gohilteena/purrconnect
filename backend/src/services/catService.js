import Cat from "../models/Cat.js";
import { slugify } from "../utils/slugify.js";
import { buildPagination } from "../utils/pagination.js";

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  name_asc: { name: 1 },
};

// Stops users from injecting regex syntax through ?search=
const escapeRegex = (s) =>
  String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildCatFilter = (q) => {
  const filter = {};

  // Search
  if (q.search) {
    const rx = new RegExp(escapeRegex(q.search), "i");

    filter.$or = [
      { name: rx },
      { breed: rx },
      { color: rx },
      { location: rx },
      { description: rx },
    ];
  }

  // Breed
  if (q.breed) {
    filter.breed = new RegExp(
      `^${escapeRegex(q.breed)}$`,
      "i"
    );
  }

  // Gender
  if (q.gender) {
    filter.gender = q.gender;
  }

  // Age unit
  // Examples:
  // ?ageUnit=weeks
  // ?ageUnit=months
  // ?ageUnit=years
  if (q.ageUnit) {
    filter.ageUnit = q.ageUnit;
  }

  // Location
  if (q.location) {
    filter.location = new RegExp(
      escapeRegex(q.location),
      "i"
    );
  }

  // Availability / status
  if (q.status) {
    filter.status = q.status;
  }

  // Featured
  if (q.featured !== undefined) {
    filter.featured = q.featured;
  }

  // Price range
  if (
    q.minPrice !== undefined ||
    q.maxPrice !== undefined
  ) {
    filter.price = {};

    if (q.minPrice !== undefined) {
      filter.price.$gte = q.minPrice;
    }

    if (q.maxPrice !== undefined) {
      filter.price.$lte = q.maxPrice;
    }
  }

  return filter;
};

export const listCats = async (q) => {
  const filter = buildCatFilter(q);

  const skip = (q.page - 1) * q.limit;

  // _id as tie-breaker keeps pagination stable
  // when many cats have the same price/date.
  const sort = {
    ...(SORT_OPTIONS[q.sort] || SORT_OPTIONS.newest),
    _id: 1,
  };

  const [cats, total] = await Promise.all([
    Cat.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(q.limit),

    Cat.countDocuments(filter),
  ]);

  return {
    cats,
    pagination: buildPagination(
      q.page,
      q.limit,
      total
    ),
  };
};

// /api/cats/:id accepts either:
// MongoDB ObjectId
// OR slug such as "luna"
export const findCatByIdOrSlug = (idOrSlug) =>
  /^[a-f\d]{24}$/i.test(idOrSlug)
    ? Cat.findById(idOrSlug)
    : Cat.findOne({
        slug: idOrSlug.toLowerCase(),
      });

// "Luna" -> "luna"
// If "luna" exists:
// "luna-2", "luna-3", etc.
export const generateUniqueSlug = async (
  name,
  excludeId = null
) => {
  const base = slugify(name) || "cat";

  let slug = base;
  let counter = 1;

  const taken = (s) =>
    Cat.exists({
      slug: s,
      ...(excludeId && {
        _id: { $ne: excludeId },
      }),
    });

  while (await taken(slug)) {
    counter += 1;
    slug = `${base}-${counter}`;
  }

  return slug;
};