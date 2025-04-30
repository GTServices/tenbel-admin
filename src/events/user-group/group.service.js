import axios from "../../common/axios";

const getGroups = async () => {
    try {
        const response = await axios.get("/admin/user-groups")
        return response.data;
    } catch (e) {
        return false;
    }
};

const getGroupsByUser = async (userId) => {
    try {
        const response = await axios.get(`/admin/user-groups?user_id_filter=${userId}`)
        return response.data;
    } catch (e) {
        return false;
    }
};

const getGroup = async (id) => {
    try {
        const response = await axios.get("/admin/user-groups/" + id);
        ;
        return response.data;
    } catch (e) {
        return false;
    }
};

const updateGroup = async (data, id) => {
    try {
        await axios.post("/admin/user-groups/" + id, data);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const storeGroup = async (data) => {
    try {
        await axios.post("/admin/user-groups", data);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const deleteGroup = async (id) => {
    try {
        await axios.delete("/admin/user-groups/" + id);
        return true;
    } catch (e) {
        return false;
    }
};

const groupService = {
    getGroups,
    getGroupsByUser,
    getGroup,
    updateGroup,
    storeGroup,
    deleteGroup,
};

export default groupService;
