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
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    const { data } = await this.query(
      "GET",
      `/routes/${accessToken}/${userId}`
    );
    return data.pathsAllowed;
  }

  async query(method, route, body, headers = {}) {
    const defaultHeaders = {
      establishmentId: localStorage.getItem("establishmentId"),
      "x-access-token": localStorage.getItem("accessToken"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
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
      console.error(
        "Erro ao fazer requisição:",
        error.response?.data || error.message
      );
      throw {
        status: error.response?.status || 500,
        message: error.response?.data || "Erro desconhecido",
      };
    }
  }
}

const apiService = new ApiService();

export default apiService;
