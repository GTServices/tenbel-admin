import axios from "../common/axios";

const modulePath = "forms";
const all = async (params) => {
    try {
        let queryString = "";
        if (params) {
            const query = {
                page: params?.page ? params?.page : 1 ?? "",
                perPage: params?.rows ?? "",
                name_filter: params?.filters?.name?.value ?? "",
                sort: params?.sortField ?? "",
                sort_type: params?.sortOrder === 1 ? "desc" : "asc",
            };

            queryString = "?" + new URLSearchParams(query).toString();
        }
        const response = await axios.get(`/admin/${modulePath}` + queryString)
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
};

export default {
    all,
    delete: deleteItem,
}
