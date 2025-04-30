// import axios2 from "axios";
import axios from "../../common/axios";

const getAllMerchants = async (params) => {
    try {
        const query = {
            page: params.page ? params.page : 1,
            perPage: params.rows,
            name_filter: params?.filters?.name?.value ?? "",
            phone_filter: params?.filters?.phone?.value ?? "",
            surname_filter: params?.filters?.surname?.value ?? "",
            is_active_filter: params?.filters?.is_active?.value ?? "",
            email_filter: params?.filters?.email?.value ?? "",
            id_filter: params?.filters?.id?.value ?? "",
            website_filter: params?.filters?.website?.value ?? "",
            sort: params.sortField,
            sort_type: params.sortOrder === 1 ? "desc" : "asc",
        };

        const queryString = "?" + new URLSearchParams(query).toString();

        const response = await axios.get("/admin/merchant" + queryString);
        return response.data;
    } catch (e) {
        console.log(e);
        return {};
    }
};

const storeMerchant = async (formData) => {
    try {
        await axios.post("/admin/merchant", formData)
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const updateMerchant = async (formData, id) => {
    try {
        const response = await axios.post("/admin/merchant/" + id, formData)
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const getMerchant = async (id) => {
    try {
        const response = await axios.get("/admin/merchant/" + id)
        return response.data;
    } catch (e) {
        return false;
    }
};

const deleteMerchant = async (id) => {
    try {
        await axios.delete("/admin/merchant/" + id);
        return true;
    } catch (e) {
        return false;
    }
};

const getCategories = () => {
    return axios.get("/admin/category");
};

const merchantService = {
    getAllMerchants,
    getMerchant,
    storeMerchant,
    updateMerchant,
    deleteMerchant,
    getCategories
};

export default merchantService;
