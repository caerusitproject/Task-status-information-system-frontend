import axios from "axios";

const LOCAL_API = "http://localhost:3000/api";

// ✅ Always get latest token for Authorization header
const getAuthHeaders = () => {
  //const token = getCookie("accessToken");
  return {
    "Content-Type": "application/json",
  };
};

export const TicketingSystemApi = {
  async view(page, pageSize) {
    try {
      // Build URL dynamically based on params
      let url = `${LOCAL_API}/ticketingSystem/view`;

      // Add pagination only if provided
      if (page !== undefined && pageSize !== undefined) {
        url += `?page=${page}&pagesize=${pageSize}`;
      }

      const response = await axios.get(url, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching Ticketing Systems:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await axios.post(
        `${LOCAL_API}/ticketingSystem/create/`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error creating Ticketing System:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async edit(id, data) {
    try {
      const response = await axios.put(
        `${LOCAL_API}/ticketingSystem/edit/${id}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error editing Ticketing System:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

