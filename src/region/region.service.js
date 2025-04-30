import axios from "../common/axios";

const getRegions = async (params = null) => {
  try {
    let queryString = "";
    if (params) {
      const query = {
        page: (params.page ? params.page : 1) ?? "",
        perPage: params.rows ?? "",
        title_filter: params?.filters?.title?.value ?? "",
        id_filter: params?.filters?.id?.value ?? "",
        sort: params.sortField ?? "",
        sort_type: params.sortOrder === 1 ? "desc" : "asc",
      };

      queryString = "?" + new URLSearchParams(query).toString();
    }
    const response = await axios.get("/admin/regions" + queryString);
    return response.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const enumRegionTypes = {
  country: 1,
  city: 2,
};
const getCountries = async () => {
  const query = {
    perPage: 500,
    type_filter: enumRegionTypes.country,
  };

  const queryString = "?" + new URLSearchParams(query).toString();

  const response = await axios.get("/admin/regions" + queryString);
  return response.data;
};

const storeRegion = async (formData) => {
  try {
    await axios.post("/admin/regions", formData);
    return {
      success: true,
    };
  } catch (e) {
    return {
      errors: e.response.data.errors,
    };
  }
};

const getRegion = async (id) => {
  try {
    const response = await axios.get("/admin/regions/" + id);
    return response.data;
  } catch (e) {
    return false;
  }
};

const updateRegion = async (formData, id) => {
  try {
    await axios.post("/admin/regions/" + id, formData);
    return {
      success: true,
    };
  } catch (e) {
    return {
      errors: e.response.data.errors,
    };
  }
};

const deleteRegion = async (id) => {
  try {
    await axios.delete("/admin/regions/" + id);
  } catch (e) {
    console.log(e.response.data.message);
    return false;
  }
};

const getTypes = async () => {
  try {
    const response = await axios.get("/admin/region-types");
    return response.data;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const regionService = {
  getRegions,
  storeRegion,
  getRegion,
  updateRegion,
  deleteRegion,
  getTypes,
  getCountries,
};

export default regionService;
