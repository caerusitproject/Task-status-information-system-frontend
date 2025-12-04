import axios from "axios";

const LOCAL_API = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// ✅ Always get latest token for Authorization header
const getAuthHeaders = () => {
  //const token = getCookie("accessToken");
  return {
    "Content-Type": "application/json",
  };
};

export const ClientApi = {
  async view(page, pageSize) {
    try {
      // Build URL dynamically — add pagination only if provided
      let url = `${LOCAL_API}/client/view`;

      if (page !== undefined && pageSize !== undefined) {
        url += `?page=${page}&pagesize=${pageSize}`;
      }

      const response = await axios.get(url, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching Clients:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await axios.post(`${LOCAL_API}/client/create`, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error creating Cleints:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async edit(id, data) {
    try {
      const response = await axios.put(`${LOCAL_API}/client/edit/${id}`, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error editing Clients:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
