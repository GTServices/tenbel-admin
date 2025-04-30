import axios from "../common/axios";

const getLanguages = () => {
  return axios.get("/langs");
};

const commonService = {
  getLanguages,
};

export default commonService;
