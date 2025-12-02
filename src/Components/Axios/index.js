import axios from "axios";
import { getLocalItem, setLocalItem } from "../Functions";

class ApiService {
  setData(data) {
    if (data) Object.keys(data).map((key) => setLocalItem(key, data[key]));
  }

  async query(method, route, body, headers = {}) {
    const defaultHeaders = {
      id: getLocalItem("establishmentId"),
      "x-access-token": getLocalItem("accessToken"),
      authorization: `Bearer ${getLocalItem("token")}`,
    };

    try {
      const url = `${process.env.REACT_APP_BACK_TONSUS}${route}`;
      const response = await axios({
        method,
        url: url,
        headers: { ...defaultHeaders, ...headers },
        ...(body ? { data: body } : {}),
      });

      return response.data;
    } catch (error) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        const lastPath = getLocalItem("lastRoute");
        localStorage.clear();
        setLocalItem("lastRoute", lastPath);
        window.location.href = "/login";
      }

      throw error;
    }
  }
}

const apiService = new ApiService();

export default apiService;
