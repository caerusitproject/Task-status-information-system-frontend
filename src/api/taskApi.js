import axios from "axios";

const LOCAL_API = "http://localhost:3000/api";

const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

export const TaskApi = {
  // ✅ CREATE TASK
  // TaskType = "assignment" || "issue" || "change_request"
  async create(taskType, data) {
    try {
      const response = await axios.post(
        `${LOCAL_API}/timeSheet/create/${taskType}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error creating task:",
        error.response?.data?.message || error.response?.data
      );
      throw error;
    }
  },

  // ✅ EDIT TASK
  // taskId = Task unique ID
  async edit(taskId, data) {
    try {
      const response = await axios.put(
        `${LOCAL_API}/timeSheet/editTaskId/${taskId}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error editing task:",
        error.response?.data?.message || error.response?.data
      );
      throw error;
    }
  },

  // ✅ GET TASK BY ID
  async viewById(taskId) {
    try {
      const response = await axios.get(
        `${LOCAL_API}/timeSheet/viewbyId/${taskId}`,
         { headers: getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching task details:",
        error.response?.data?.message || error.response?.data
      );
      throw error;
    }
  },

  async legends() {
    try {
      const response = await axios.get(
        `${LOCAL_API}/timeSheet/legends-colors`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching legends details:",
        error.response?.data?.message || error.response?.data
      );
      throw error;
    }
  },
  //color-pallette

  async colorPallette() {
    try {
      const response = await axios.get(
        `${LOCAL_API}/timeSheet/color-pallette`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching legends details:",
        error.response?.data?.message || error.response?.data
      );
      throw error;
    }
  },
};
