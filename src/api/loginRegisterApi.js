import axios from "axios";

const LOCAL_API = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// ✅ Always get latest token for Authorization header
const getAuthHeaders = () => {
  //const token = getCookie("accessToken");
  return {
    "Content-Type": "application/json",
  };
};

export const LoginRegisterApi = {
  async loginUser({ emailId, password }) {
    try {
      // Build URL dynamically — add pagination only if provided
      let url = `${LOCAL_API}/users/login-user`;

      const response = await axios.post(
        url,
        { emailId, password },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching Applications:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Login failed");
    }
  },

  async registerUser(data) {
    try {
      const response = await axios.post(
        `${LOCAL_API}/users/register-user`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error creating User:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Registration failed");
    }
  },

  async logoutUser(email) {
    try {
      const response = await axios.post(
        `${LOCAL_API}/users/logout-user`,
        { emailId: email },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error logging out User:",
        error.response?.data || error.message
      );
      // Handle logout error if necessary
    }
  },

  //   async edit(id, data) {
  //     try {
  //       const response = await axios.put(
  //         `${LOCAL_API}/application/edit/${id}`,
  //         data,
  //         { headers: getAuthHeaders() }
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error(
  //         "Error editing Application:",
  //         error.response?.data || error.message
  //       );
  //       throw error;
  //     }
  //   },
};
