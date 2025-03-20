import axios from "axios";

class ApiService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL: "https://srv744360.hstgr.cloud/tonsus/api", //process.env.REACT_APP_BACK_TONSUS,
    });
  }

  setKey(data) {
    if (data)
      Object.keys(data).map((key) => localStorage.setItem(key, data[key]));
  }

  async getAccess() {
    const typeUserId = localStorage.getItem("typeUserId");
    const { data } = await this.query("GET", `/user/routes/${typeUserId}`);
    return data.pathsAllowed;
  }

  async query(method, route, body, headers = {}) {
    const defaultHeaders = {
      id: localStorage.getItem("establishmentId"),
      "x-access-token": localStorage.getItem("accessToken"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const response = await this.api({
      method,
      url: route,
      headers: { ...defaultHeaders, ...headers },
      ...(body ? { data: body } : {}),
    });
    return response.data;
  }
}

const apiService = new ApiService();

export default apiService;
