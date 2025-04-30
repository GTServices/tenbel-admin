import axios from "../../common/axios";

const getCategories = async (params = null) => {
  try {
    let queryString = "";
    if (params) {
      const query = {
        page: params.page ? params.page : 1,
        perPage: params.rows,
        title_filter: params.filters.title.value,
        id_filter: params.filters.id.value,
        sort: params?.sortField ?? "",
        sort_type: params?.sortOrder === 1 ? "desc" : "asc",
      };
      queryString = "?" + new URLSearchParams(query).toString();
    }

    const response = await axios.get("/admin/category" + queryString);
    return response.data;
  } catch (e) {
    return {};
  }
};

const storeCategory = async (formData) => {
  try {
    await axios.post("/admin/category", formData);
    return {
      success: true,
    };
  } catch (e) {
    return {
      errors: e.response.data.errors,
    };
  }
};

const getCategory = async (id) => {
  try {
    const response = await axios.get("/admin/category/" + id);
    return response.data;
  } catch (e) {
    return false;
  }
};

const updateCategory = async (formData, id) => {
  try {
    await axios.post("/admin/category/" + id, formData);
    return {
      success: true,
    };
  } catch (e) {
    return {
      errors: e.response.data.errors,
    };
  }
};

const deleteCategory = async (id) => {
  try {
    await axios.delete("/admin/category/" + id);
    return true;
  } catch (e) {
    return false;
  }
};

const categoryService = {
  getCategories,
  storeCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
