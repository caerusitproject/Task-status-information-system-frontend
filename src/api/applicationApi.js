import axios from "axios";

const LOCAL_API = "http://localhost:3000/api";

// ✅ Always get latest token for Authorization header
const getAuthHeaders = () => {
  //const token = getCookie("accessToken");
  return {
    "Content-Type": "application/json",
  };
};

export const ApplicationApi = {
  async view(page, pageSize) {
    try {
      // Build URL dynamically — add pagination only if provided
      let url = `${LOCAL_API}/application/view`;

      if (page !== undefined && pageSize !== undefined) {
        url += `?page=${page}&pagesize=${pageSize}`;
      }

      const response = await axios.get(url, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching Applications:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await axios.post(
        `${LOCAL_API}/application/create`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error creating Application:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async edit(id, data) {
    try {
      const response = await axios.put(
        `${LOCAL_API}/application/edit/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error editing Application:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
