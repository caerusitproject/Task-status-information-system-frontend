import axios from "axios";

const LOCAL_API = "http://localhost:3000/api";

// ✅ Always get latest token for Authorization header
const getAuthHeaders = () => {
  //const token = getCookie("accessToken");
  return {
    "Content-Type": "application/json",
  };
};

export const QueryApi = {
  async suggestionView(query) {
    try {
      // Build URL dynamically — add pagination only if provided
      let url = `${LOCAL_API}/timeSheet/getquery-suggestions?query=${query}`;

      //   if (page !== undefined && pageSize !== undefined) {
      //     url += `?page=${page}&pagesize=${pageSize}`;
      //   }

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
};
