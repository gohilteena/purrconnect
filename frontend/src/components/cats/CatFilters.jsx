import { Search, RotateCcw } from "lucide-react";

export default function CatFilters({
  filters,
  onChange,
  onReset,
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          Find Your Cat
        </h2>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={filters.search}
              onChange={(event) =>
                onChange("search", event.target.value)
              }
              placeholder="Search by name or breed"
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-3 outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Breed */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Breed
          </label>

          <select
            value={filters.breed}
            onChange={(event) =>
              onChange("breed", event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-brand-500"
          >
            <option value="">All Breeds</option>
            <option value="Persian">Persian</option>
            <option value="British Shorthair">
              British Shorthair
            </option>
            <option value="Ragdoll">Ragdoll</option>
            <option value="Maine Coon">Maine Coon</option>
            <option value="Siamese">Siamese</option>
            <option value="Bengal">Bengal</option>
            <option value="Indian Domestic">
              Indian Domestic
            </option>
            <option value="Russian Blue">
              Russian Blue
            </option>
            <option value="Scottish Fold">
              Scottish Fold
            </option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Gender
          </label>

          <select
            value={filters.gender}
            onChange={(event) =>
              onChange("gender", event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-brand-500"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Age
          </label>

          <select
            value={filters.ageUnit}
            onChange={(event) =>
              onChange("ageUnit", event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-brand-500"
          >
            <option value="">All Ages</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Location
          </label>

          <input
            type="text"
            value={filters.location}
            onChange={(event) =>
              onChange("location", event.target.value)
            }
            placeholder="Ahmedabad"
            className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-brand-500"
          />
        </div>

        {/* Min Price */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Minimum Price
          </label>

          <input
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(event) =>
              onChange("minPrice", event.target.value)
            }
            placeholder="₹0"
            className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-brand-500"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Maximum Price
          </label>

          <input
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(event) =>
              onChange("maxPrice", event.target.value)
            }
            placeholder="₹100000"
            className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-brand-500"
          />
        </div>

        {/* Availability */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Availability
          </label>

          <select
            value={filters.status}
            onChange={(event) =>
              onChange("status", event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-brand-500"
          >
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Sort By
          </label>

          <select
            value={filters.sort}
            onChange={(event) =>
              onChange("sort", event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 px-3 py-3 outline-none focus:border-brand-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">
              Price: Low to High
            </option>
            <option value="price_desc">
              Price: High to Low
            </option>
            <option value="name_asc">
              Name: A to Z
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}