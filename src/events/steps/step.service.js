import axios from "../../common/axios";

const getSteps = async () => {
    try {
        const response = await axios.get("/admin/step");
        return response.data;
    } catch (e) {
        return false;
    }
};

const storeStep = async (formData) => {
    try {
        await axios.post("/admin/step", formData);
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const getStep = async (id) => {
    try {
        const response = await axios.get("/admin/step/" + id);
        return response.data;
    } catch (e) {
        return false;
    }
};

const updateStep = async (formData, id) => {
    try {
        await axios.post("/admin/step/" + id, formData)
        return {
            success: true
        }
    } catch (e) {
        return {
            errors: e.response.data.errors
        }
    }
};

const deleteStep = async (id) => {
    try {
        await axios.delete("/admin/step/" + id);
        return true;
    } catch (e) {
        return false;
    }
};

const stepService = {
    getSteps,
    storeStep,
    getStep,
    updateStep,
    deleteStep
};

export default stepService;
