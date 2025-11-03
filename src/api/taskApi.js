import axios from "axios";

const LOCAL_API = "http://localhost:3000/api";

// ✅ Always get latest token for Authorization header
const getAuthHeaders = () => {
  //const token = getCookie("accessToken");
  return {
    "Content-Type": "application/json",
  };
};

// ✅ Employee API object
export const TaskApi = {
  async view(page = 1, pageSize = 10) {
    try {
      const response = await axios.get(
        `${LOCAL_API}/taskStatusInfo/view?page=${page}&pagesize=${pageSize}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching Task Status Info:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await axios.post(
        `${LOCAL_API}/taskStatusInfo/create/`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error creating Task Status Info:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async edit(id, data) {
    try {
      const response = await axios.put(
        `${LOCAL_API}/taskStatusInfo/edit/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error editing Task Status Info:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

