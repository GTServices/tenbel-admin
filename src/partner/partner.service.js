// import axios2 from "axios";
import axios from "../common/axios";

const modulePath = 'partner';

const all = async (params) => {
    try {
        let query = {
            page: params.page ? params.page : 1,
            perPage: params.rows,
            id_filter: params.filters.id.value,
            sort: params.sortField,
            sort_type: params.sortOrder === 1 ? "desc" : "asc",
        };


        const queryString = "?" + new URLSearchParams(query).toString();

        const response = await axios.get(`/admin/${modulePath}${queryString}`);
        return response.data;
    } catch (e) {
        return false;
    }
};

const store = async (formData) => {
    try {
        await axios.post(`/admin/${modulePath}`, formData)
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const update = async (formData, id) => {
    try {
        const response = await axios.post(`/admin/${modulePath}/${id}`, formData)
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const get = async (id) => {
    try {
        const response = await axios.get(`/admin/${modulePath}/${id}`)
        return response.data;
    } catch (e) {
        return false;
    }
};

const deleteItem = async (id) => {
    try {
        await axios.delete(`/admin/${modulePath}/${id}`);
        return true;
    } catch (e) {
        return false;
    }
}

const partnerService = {
    all,
    get,
    store,
    update,
    delete: deleteItem,
};

export default partnerService;
