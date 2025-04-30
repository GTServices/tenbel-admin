import axios from "../../common/axios";

const modulePath = "user-events";

const getUserEvents = async (id) => {
    try {
        const response = await axios.get(`/admin/${modulePath}?relation_id_filter=${id}&sort_type=asc&sort=id`);
        return response.data;
    } catch (e) {
        return false;
    }
}

const storeUserEvent = async (data) => {
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

const updateUserEvent = async (data, id) => {
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

const deleteUserEvent = async (id) => {
    try {
        await axios.delete(`/admin/${modulePath}/${id}`);
        return true;
    } catch (e) {
        return false;
    }
}


export default {
    getUserEvents,
    storeUserEvent,
    updateUserEvent,
    deleteUserEvent
}