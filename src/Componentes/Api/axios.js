import axios from "axios";
import { getLocalItem, setLocalItem } from "../Funcoes";

class ApiService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: "https://srv744360.hstgr.cloud/tonsus/api", //process.env.REACT_APP_BACK_TONSUS,
    });
  }

  setKey(data) {
    if (data) Object.keys(data).map((key) => setLocalItem(key, data[key]));
  }

  async getAccess() {
    const typeUserId = getLocalItem("typeUserId");
    const data = await this.query("GET", `/user/routes/${typeUserId}`);
    return data;
  }

  async query(method, route, body, headers = {}) {
    const defaultHeaders = {
      id: getLocalItem("establishmentId"),
      "x-access-token": getLocalItem("accessToken"),
      authorization: `Bearer ${getLocalItem("token")}`,
    };

    try {
      const response = await this.api({
        method,
        url: route,
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
