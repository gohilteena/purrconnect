import Cat from "../models/Cat.js";
import Enquiry from "../models/Enquiry.js";
import Testimonial from "../models/Testimonial.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalCats,
    availableCats,
    reservedCats,
    soldCats,
    totalEnquiries,
    newEnquiries,
    totalTestimonials,
    recentEnquiries,
    recentCats,
  ] = await Promise.all([
    Cat.countDocuments(),
    Cat.countDocuments({ status: "available" }),
    Cat.countDocuments({ status: "reserved" }),
    Cat.countDocuments({ status: "sold" }),
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: "new" }),
    Testimonial.countDocuments(),
    Enquiry.find().sort({ createdAt: -1 }).limit(5).populate("cat", "name slug breed status images"),
    Cat.find().sort({ createdAt: -1 }).limit(5).select("name slug breed status price images createdAt"),
  ]);

  sendSuccess(
    res,
    {
      totalCats,
      availableCats,
      reservedCats,
      soldCats,
      totalEnquiries,
      newEnquiries,
      totalTestimonials,
      recentEnquiries,
      recentCats,
    },
    "Dashboard statistics fetched successfully"
  );
});
