import axios from "../../common/axios";

const getGroupEvents = async (id) => {
    try {
        const response = await axios.get(`/admin/group-events?group_id_filter=${id}&sort_type=asc&sort=id`);
        return response.data;
    } catch (e) {
        return false;
    }
}

const storeGroupEvent = async (data) => {
    try {
        await axios.post("/admin/group-events", data);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
}

const updateGroupEvent = async (data, id) => {
    try {
        await axios.post(`/admin/group-events/${id}`, data);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
}

const deleteGroupEvent = async (id) => {
    try {
        await axios.delete(`/admin/group-events/${id}`);
        return true;
    } catch (e) {
        return false;
    }
}


export default {
    getGroupEvents,
    storeGroupEvent,
    updateGroupEvent,
    deleteGroupEvent
}