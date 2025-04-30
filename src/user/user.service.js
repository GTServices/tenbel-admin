import axios from "../common/axios";

const getAllUsers = async (params = null) => {
    try {
        let queryString = "";
        if (params) {
            const query = {
                page: params?.page ? params?.page : 1 ?? "",
                perPage: params?.rows ?? "",
                name_filter: params?.filters?.name?.value ?? "",
                phone_filter: params?.filters?.phone?.value ?? "",
                birthday_filter: params?.filters?.birthday?.value ?? "",
                surname_filter: params?.filters?.surname?.value ?? "",
                is_active_filter: params?.filters?.is_active?.value ?? "",
                gender_filter: params?.filters?.gender?.value ?? "",
                email_filter: params?.filters?.email?.value ?? "",
                id_filter: params?.filters?.id?.value ?? "",
                sort: params?.sortField ?? "",
                sort_type: params?.sortOrder === 1 ? "desc" : "asc",
            };

            queryString = "?" + new URLSearchParams(query).toString();
        }

        const response = await axios.get("/admin/user" + queryString);
        return response.data;
    } catch (e) {
        return false;
    }
}

const storeUser = async (formData) => {
    try {
        await axios.post("/admin/user", formData)
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const updateUser = async (formData, id) => {
    try {
        await axios.post("/admin/user/" + id, formData);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const getUser = async (id) => {
    try {
        const response = await axios.get("/admin/user/" + id);
        return response.data;
    } catch (e) {
        return false;
    }
};

const deleteUser = async (id) => {
    try {
        await axios.delete("/admin/user/" + id)
        return true;
    } catch (e) {
        return false;
    }
};

const userService = {
    getAllUsers,
    getUser,
    storeUser,
    updateUser,
    deleteUser,
};

export default userService;
