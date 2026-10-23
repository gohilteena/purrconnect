import api from "./api.js";

export const getTestimonials = async (params = 6) => {
  // Support both passing a number (limit) and an options object ({ approved: "all", limit: 50 })
  const queryParams = typeof params === "number" ? { limit: params } : params;
  const { data } = await api.get("/testimonials", {
    params: queryParams,
  });

  return data;
};

export const createTestimonial = async (payload) => {
  const { data } = await api.post("/testimonials", payload);
  return data;
};

export const updateTestimonial = async (id, payload) => {
  const { data } = await api.put(`/testimonials/${id}`, payload);
  return data;
};

export const deleteTestimonial = async (id) => {
  const { data } = await api.delete(`/testimonials/${id}`);
  return data;
};
