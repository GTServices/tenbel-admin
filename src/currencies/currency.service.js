import axios from "../common/axios";

const getCurrencies = async (params = null) => {

    try {
        let queryString = "";

        if (params) {
            const query = {
                page: params.page ? params.page : 1,
                perPage: params.rows,
                title_filter: params.filters.title.value,
                code_filter: params.filters.code.value,
                symbol_filter: params.filters.symbol.value,
                id_filter: params.filters.id.value,
                sort: params.sortField,
                sort_type: params.sortOrder === 1 ? "desc" : "asc",
            };

            queryString = "?" + new URLSearchParams(query).toString();
        }

        const response = await axios.get("/admin/currency" + queryString);
        return response.data;
    } catch (e) {
        return false;
    }
};

const storeCurrency = async (formData) => {
    try {
        await axios.post("/admin/currency", formData);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const getCurrency = async (id) => {
    try {
        const response = await axios.get("/admin/currency/" + id)
        return response.data;
    } catch (e) {
        return false;
    }
};

const updateCurrency = async (formData, id) => {
    try {
        await axios.post("/admin/currency/" + id, formData);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const deleteCurrency = async (id) => {
    try {
        await axios.delete("/admin/currency/" + id)
        return true;
    } catch (e) {
        return false;
    }
};


const currencyService = {
    getCurrencies,
    storeCurrency,
    getCurrency,
    updateCurrency,
    deleteCurrency,
};

export default currencyService;
