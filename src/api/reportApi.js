import axios from "axios";
// import * as XLSX from "xlsx";

const LOCAL_API = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// ✅ Always get latest token for Authorization header
const getAuthHeaders = () => {
  //const token = getCookie("accessToken");
  return {
    "Content-Type": "application/json",
  };
};

export const ReportExcelPdf = {
  async generateExcel(startDate, endDate) {
    try {
      // Build URL dynamically — add pagination only if provided
      let url = `${LOCAL_API}/report/generateExcelReport`;

      //   if (page !== undefined && pageSize !== undefined) {
      //     url += `?page=${page}&pagesize=${pageSize}`;
      //   }
      const response = await axios.post(
        url,
        {
          startDate,
          endDate,
        },
        { responseType: "blob" }
        // { headers: getAuthHeaders() }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      console.log("excel link___", link);
      link.href = urlBlob;
      link.setAttribute("download", "Timesheet Report.xlsx");
      document.body.appendChild(link);
      //   const html = XLSX.utils.sheet_to_html(sheet);
      link.click();
      link.remove();
      //  return {
      //     html,
      //     blob: response.data,
      //     fileName: "timesheet.xlsx",
      // };
    } catch (error) {
      console.error(
        "Error fetching Applications:",
        error.response?.data || error.message
      );
      //   throw error;
    }
  },
  async generatePDF(startDate, endDate) {
    try {
      let url = `${LOCAL_API}/report/generatePDFReport`;

      const response = await axios.post(
        url,
        { startDate, endDate },
        { responseType: "blob" } // ✅ IMPORTANT for PDF
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", "Timesheet Report.pdf");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(
        "Error downloading PDF:",
        error.response?.data || error.message
      );
    }
  },

  async generateExcelTask(startDate, endDate) {
    try {
      // Build URL dynamically — add pagination only if provided
      let url = `${LOCAL_API}/report/generateExcelReportTask`;

      //   if (page !== undefined && pageSize !== undefined) {
      //     url += `?page=${page}&pagesize=${pageSize}`;
      //   }
      const response = await axios.post(
        url,
        {
          startDate,
          endDate,
        },
        { responseType: "blob" }
        // { headers: getAuthHeaders() }
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      console.log("excel link___", link);
      link.href = urlBlob;
      link.setAttribute("download", "Task Report.xlsx");
      document.body.appendChild(link);
      //   const html = XLSX.utils.sheet_to_html(sheet);
      link.click();
      link.remove();
      //  return {
      //     html,
      //     blob: response.data,
      //     fileName: "timesheet.xlsx",
      // };
    } catch (error) {
      console.error(
        "Error fetching Applications:",
        error.response?.data || error.message
      );
      //   throw error;
    }
  },

  async generatePDFTask(startDate, endDate) {
    try {
      let url = `${LOCAL_API}/report/generatePDFReportTask`;

      const response = await axios.post(
        url,
        { startDate, endDate },
        { responseType: "blob" } // ✅ IMPORTANT for PDF
      );

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", "Task Report.pdf");

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(
        "Error downloading PDF:",
        error.response?.data || error.message
      );
    }
  },

  //   async generateExcel(startDate, endDate) {
  //     const url = `${LOCAL_API}/report/generatePDFreport`;
  //     const response = await axios.post(
  //       url,
  //       { startDate, endDate },
  //       { responseType: "blob" }
  //     );

  //     // Convert blob -> arrayBuffer -> read workbook
  //     const arrayBuffer = await response.data.arrayBuffer();
  //     const workbook = XLSX.read(arrayBuffer, { type: "array" });

  //     // Convert first sheet to HTML
  //     const sheet = workbook.Sheets[workbook.SheetNames[0]];
  //     const html = XLSX.utils.sheet_to_html(sheet);

  //     // Return both html string and original blob (caller decides to download)
  //     return {
  //       html,
  //       blob: response.data,
  //       fileName: "timesheet.xlsx",
  //     };
  //   },

  //   async create(data) {
  //     try {
  //       const response = await axios.post(
  //         `${LOCAL_API}/application/create`,
  //         data,
  //         { headers: getAuthHeaders() }
  //       );
  //       return response.data;
  //     } catch (error) {
  //       console.error(
  //         "Error creating Application:",
  //         error.response?.data || error.message
  //       );
  //       throw error;
  //     }
  //   },

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

  //   async getReports() {
  //     try {
  //       const response = await fetch(`${LOCAL_API}/report/view`);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       return response.json();
  //     } catch (error) {
  //       console.error(
  //         "Error fetching Reports:",
  //         error.response?.data || error.message
  //       );
  //       throw error;
  //     }
  //   },

  //   async postReports(data) {
  //     try {
  //       const response = await axios.post(`${LOCAL_API}/report/create`, data, {
  //         headers: getAuthHeaders(),
  //       });
  //       return response.data;
  //     } catch (error) {
  //       console.error(
  //         "Error fetching Reports:",
  //         error.response?.data || error.message
  //       );
  //       throw error;
  //     }
  //   },
};
