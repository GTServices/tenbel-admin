import axios from "../../common/axios";

const getRoles = async (params = null) => {
    try {
        let queryString = "";
        if (params) {
            const query = {
                page: params.page ? params.page : 1,
                perPage: params.rows,
                id_filter: params.filters.id.value,
                name_filter: params.filters.name.value,
                sort: params.sortField,
                sort_type: params.sortOrder === 1 ? "desc" : "asc",
            };

            queryString = "?" + new URLSearchParams(query).toString();
        }

        const response = await axios.get("/admin/role" + queryString);
        return response.data
    } catch (e) {
        return false;
    }
};

const getRole = (id) => {
    return axios.get("/admin/role/" + id);
};

const getPermissions = () => {
    return axios.get("/admin/permissions");
};

const updateRole = async (data, id) => {
    try {
        await axios.post("/admin/role/" + id, data);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const storeRole = async (data) => {
    try {
        await axios.post("/admin/role", data);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const deleteRole = async (id) => {
    try {
        await axios.delete("/admin/role/" + id)
        return true;
    } catch (e) {
        return false;
    }
};

const roleService = {
    getRoles,
    getRole,
    getPermissions,
    updateRole,
    storeRole,
    deleteRole,
};

export default roleService;
