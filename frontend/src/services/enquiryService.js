import api from "./api.js";

export const createEnquiry = async (payload) => {
  const { data } = await api.post("/enquiries", payload);
  return data;
};

export const getEnquiries = async (params = {}) => {
  const { data } = await api.get("/enquiries", { params });
  return data;
};

export const updateEnquiryStatus = async (id, status) => {
  const { data } = await api.put(`/enquiries/${id}`, { status });
  return data;
};
