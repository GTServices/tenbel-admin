import axios from "../../common/axios";

const modulePath = "package-features";

const getFeatures = async (id) => {
    try {
        const response = await axios.get(`/admin/${modulePath}?package_id_filter=${id}&sort_type=asc&sort=id`);
        return response.data;
    } catch (e) {
        return false;
    }
}

const storeFeature = async (data) => {
    try {
        await axios.post(`/admin/${modulePath}`, data);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
}

const updateFeature = async (data, id) => {
    try {
        await axios.post(`/admin/${modulePath}/${id}`, data);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
}

const deleteFeature = async (id) => {
    try {
        await axios.delete(`/admin/${modulePath}/${id}`);
        return true;
    } catch (e) {
        return false;
    }
}


export default {
    getFeatures,
    storeFeature,
    updateFeature,
    deleteFeature
}