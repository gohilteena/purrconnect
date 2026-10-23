import api from "./api.js";

export const getCats = async (params = {}) => {
  const response = await api.get("/cats", {
    params,
  });

  return response.data;
};

export const getCatById = async (id) => {
  const response = await api.get(`/cats/${id}`);

  return response.data;
};

export const getFeaturedCats = async () => {
  const response = await api.get("/cats", {
    params: {
      featured: true,
      status: "available",
      limit: 6,
    },
  });

  return response.data;
};

export const createCat = async (catData) => {
  const response = await api.post("/cats", catData);
  return response.data;
};

export const updateCat = async (id, catData) => {
  const response = await api.put(`/cats/${id}`, catData);
  return response.data;
};

export const deleteCat = async (id) => {
  const response = await api.delete(`/cats/${id}`);
  return response.data;
};
