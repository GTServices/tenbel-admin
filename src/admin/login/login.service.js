import axios from "axios";
import {baseURL as API_URL} from "../../common/axios";


const loginService = (username, password) => {
  return axios
    .post(API_URL + "/admin/login", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

export default loginService;
