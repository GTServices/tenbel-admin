import axios from "../../common/axios";

const modulePath = "package";
const all = async () => {
    try {
        const response = await axios.get(`/admin/${modulePath}`)
        return response.data;
    } catch (e) {
        return false;
    }
};


const periodTypes = async () => {
    try {
        const response = await axios.get(`/admin/${modulePath}/period-types`)
        return response.data;
    } catch (e) {
        return false;
    }
};

const get = async (id) => {
    try {
        const response = await axios.get(`/admin/${modulePath}/${id}`);
        ;
        return response.data;
    } catch (e) {
        return false;
    }
};

const update = async (data, id) => {
    try {
        await axios.post(`/admin/${modulePath}/${id}`, {
            ...data,
            _method:"PUT"
        });
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const store = async (data) => {
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
};

const deleteItem = async (id) => {
    try {
        await axios.delete(`/admin/${modulePath}/${id}`);
        return true;
    } catch (e) {
        return false;
    }
};

export default {
    all,
    get,
    update,
    store,
    delete: deleteItem,
    periodTypes
}
