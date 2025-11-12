// src/mock/mockApi.js
export const getWeekTasks = () => ({
  week: [

    {
      date: "2025-11-12",
      tasks: [
        // {
        //   id: 7,
        //   taskId: "CR-907",
        //   hours: 2,
        //   minutes: 15,
        //   ticketId: "TCK-1007",
        //   colorCode: "#ffb3b3",
        //   taskType: "Change request",
        //   status: "Completed",
        //   updatedDate: "2025-11-09T09:45:00Z",
        //   dailyAccomplishments: "Enhanced error logging and monitoring dashboard."
        // },
        {
          id: 8,
          taskId: "IS-908",
          hours: 8,
          minutes: 20,
          ticketId: "TCK-1008",
          colorCode: "#e8cffdff",
          taskType: "Issue",
          status: "Completed",
          updatedDate: "2025-11-09T16:20:00Z",
          investigationRCA: "Email notifications failing intermittently. SMTP misconfiguration.",
          resolutions: "Corrected SMTP settings and tested email workflow. Monitoring ongoing."
        }
      ]
    },
    {
      date: "2025-11-09",
      tasks: [
        {
          id: 7,
          taskId: "CR-907",
          hours: 2,
          minutes: 15,
          ticketId: "TCK-1007",
          colorCode: "#ffb3b3",
          taskType: "Change request",
          status: "Completed",
          updatedDate: "2025-11-09T09:45:00Z",
          dailyAccomplishments: "Enhanced error logging and monitoring dashboard."
        },
        {
          id: 8,
          taskId: "IS-901",
          hours: 3,
          minutes: 0,
          ticketId: "TCK-1008",
          colorCode: "#d7aefc",
          taskType: "Issue",
          status: "Resolved",
          updatedDate: "2025-11-09T16:20:00Z",
          investigationRCA: "Email notifications failing intermittently. SMTP misconfiguration.",
          resolutions: "Corrected SMTP settings and tested email workflow. Monitoring ongoing."
        }
      ]
    },
    {
      date: "2025-11-08",
      tasks: [
        {
          id: 5,
          taskId: "TL-905",
          hours: 2,
          minutes: 0,
          ticketId: null,
          colorCode: "#ffffff56",
          taskType: "Ticketless",
          status: "Completed",
          updatedDate: "2025-11-08T12:30:00Z",
          dailyAccomplishments: "Optimized dashboard load time by reducing API calls."
        },
        {
          id: 6,
          taskId: "NA-906",
          hours: 1,
          minutes: 30,
          ticketId: "TCK-1006",
          colorCode: "#fcd05b",
          taskType: "New assignment",
          status: "In Progress",
          updatedDate: "2025-11-08T15:00:00Z",
          dailyAccomplishments: "Started implementation of task filtering feature."
        }
      ]
    },
    {
      date: "2025-11-07",
      tasks: [
        {
          id: 4,
          taskId: "IS-904",
          hours: 3,
          minutes: 15,
          ticketId: "TCK-1004",
          colorCode: "#ccfff7",
          taskType: "Issue",
          status: "Completed",
          updatedDate: "2025-11-07T14:45:00Z",
          investigationRCA: "Incorrect calculation in timesheet module. Logic missed edge cases.",
          resolutions: "Updated calculation logic and added unit tests. Validated results across multiple scenarios."
        }
      ]
    },
    {
      date: "2025-11-06",
      tasks: [
        {
          id: 3,
          taskId: "CR-903",
          hours: 1,
          minutes: 45,
          ticketId: "TCK-1003",
          colorCode: "#b3d6ff",
          taskType: "Change request",
          status: "Completed",
          updatedDate: "2025-11-06T10:15:00Z",
          dailyAccomplishments: "Updated UI theme colors and typography."
        }
      ]
    },
    {
      date: "2025-11-05",
      tasks: [
        {
          id: 1,
          taskId: "NA-901",
          hours: 3,
          minutes: 0,
          ticketId: "TCK-1001",
          colorCode: "#fcde72",
          taskType: "New assignment",
          status: "Completed",
          updatedDate: "2025-11-05T11:00:00Z",
          dailyAccomplishments: "Created initial backend API endpoints"
        },
        {
          id: 2,
          taskId: "IS-902",
          hours: 2,
          minutes: 30,
          ticketId: "TCK-1002",
          sr_no: "V-12",
          colorCode: "#ff9c68",
          taskType: "Issue",
          status: "In Progress",
          updatedDate: "2025-11-05T15:30:00Z",
          investigationRCA: "Database queries causing timeout. Index missing on user table.",
          resolutions: "Added proper index to database. Monitored queries for stability."
        }
      ]
    }
  ]
});
