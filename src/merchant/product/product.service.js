// import axios2 from "axios";
import axios from "../../common/axios";

const modulePath = 'product';

const all = async (params) => {
    try {
        let query = {
            page: params.page ? params.page : 1,
            perPage: params.rows,
            id_filter: params.filters.id.value,
            is_active_filter: params.filters.is_active.value,
            has_delivery_filter: params.filters.has_delivery.value,
            price_filter: params.filters.price.value,
            merchant_id_filter: params.filters.merchant_id.value,
            title_filter: params.filters.title.value,
            desc_filter: params.filters.desc.value,
            product_code_filter: params.filters.product_code.value,
            sort: params.sortField,
            sort_type: params.sortOrder === 1 ? "desc" : "asc",
        };

        if (params.filters.created_at.value) {
            query = {
                ...query,
                "created_at_filter[0]": params.filters.created_at.value,
                "created_at_filter[1]": params.filters.created_at.value,
            }
        }


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

const deleteProductImage = async (id) => {
    try {
        await axios.delete(`/admin/product-image/${id}`);
        return true;
    } catch (e) {
        return false;
    }
}

const sortImages = async (images) => {
    try {
        await axios.put(`/admin/sort-product-image`, {
            images: images
        }, {
            headers: {
                "Content-type": "application/json"
            }
        });
        return true;
    } catch (e) {
        return false;
    }
}

const productService = {
    all,
    get,
    store,
    update,
    delete: deleteItem,
    sortImages: sortImages,
    deleteProductImage: deleteProductImage
};

export default productService;
