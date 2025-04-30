import axios from "../../common/axios";

const getAllAdmins = async (params) => {
    try {
        const query = {
            page: params.page ? params.page : 1,
            perPage: params.rows,
            username_filter: params.filters.username.value,
            is_active_filter: params.filters.is_active.value,
            email_filter: params.filters.email.value,
            id_filter: params.filters.id.value,
            sort: params.sortField,
            sort_type: params.sortOrder === 1 ? "desc" : "asc",
        };

        const queryString = "?" + new URLSearchParams(query).toString();

        const response = await axios.get("/admin/admin-user" + queryString);
        return response.data;
    } catch (e) {
        return {};
    }
};

const storeAdmin = async (formData) => {
    try {
        await axios.post("/admin/admin-user", formData)
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const updateAdmin = async (formData, id) => {
    try {
        await axios.post("/admin/admin-user/" + id, formData)
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const getAdmin = async (id) => {
    try {
        const response = await axios.get("/admin/admin-user/" + id);
        return response.data;
    } catch (e) {
        return false;
    }
};

const deleteAdmin = async (id) => {
    try {
        await axios.delete("/admin/admin-user/" + id);
        return true;
    } catch (e) {
        return false;
    }
};

const adminService = {
    getAllAdmins,
    getAdmin,
    storeAdmin,
    updateAdmin,
    deleteAdmin
};

export default adminService;
