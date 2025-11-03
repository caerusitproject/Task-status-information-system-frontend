// src/pages/Report.jsx

import React, { useState, useEffect } from "react";
import { theme } from "../../theme/theme";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import bankPdf from "../../assets/bank.pdf";

const Report = () => {
  const [employee, setEmployee] = useState("");
  const [period, setPeriod] = useState("");
  const [month, setMonth] = useState("");
  const [showFormatDialog, setShowFormatDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [generatedReports, setGeneratedReports] = useState([]); // Store reports
  const [previewUrl, setPreviewUrl] = useState(null); // For inline preview
    const [canCreate, setCanCreate] = useState(true);

  // Dummy data
  const employees = [
    { value: "emp1", label: "John Doe" },
    { value: "emp2", label: "Jane Smith" },
    { value: "emp3", label: "Mike Johnson" },
  ];

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Auto-select current month on load
  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1;
    const formatted = currentMonth.toString().padStart(2, "0");
    setMonth(formatted);
  }, []);

  useEffect(() => {
  setCanCreate(true); // show button whenever employee, period, or month changes
}, [employee, period, month]);


  const handleCreate = () => {
  if (period && month) {
    setShowFormatDialog(true);
    setCanCreate(false); // hide button immediately after clicking
  }
};

 const handleFormatSelect = async (format) => {
  setSelectedFormat(format);
  setShowFormatDialog(false);

  try {
    let url, fileName, blob;

    if (format === "pdf") {
      fileName = `report_${employee || "all"}_${period.toLowerCase()}_${month}.pdf`;
      url = bankPdf; // imported URL
      const response = await fetch(bankPdf);
      blob = await response.blob();
    } else {
      // Excel dummy
      const dummyContent = `Dummy EXCEL Report\nEmployee: ${employee || "All"}\nPeriod: ${period}\nMonth: ${months.find((m) => m.value === month)?.label || month}`;
      blob = new Blob([dummyContent], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      url = URL.createObjectURL(blob);
      fileName = `report_${employee || "all"}_${period.toLowerCase()}_${month}.xlsx`;
    }

    const newReport = { id: Date.now(), name: fileName, url, format, blob };
    setGeneratedReports((prev) => [...prev, newReport]);
    setPreviewUrl(url); // show in iframe
  } catch (err) {
    console.error("Report generation failed:", err);
    alert("Failed to load report. Check console.");
  }
};


  
  const handleDownload = (report) => {
    const a = document.createElement("a");
    a.href = report.url;
    a.download = report.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleView = (report) => {
    setPreviewUrl(report.url);
  };

  return (
    <div>
      <h1
        style={{
          fontSize: window.innerWidth < 640 ? "24px" : "32px",
          fontWeight: 700,
          color: theme.colors.text.primary,
          margin: 0,
        }}
      >
        Generate Report
      </h1>

      <div style={{ padding: theme.spacing.md }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: theme.spacing.md,
            marginBottom: theme.spacing.lg,
          }}
        >
          <Input
            label="Select Employee"
            type="select"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            options={[{ value: "", label: "Select Employee" }, ...employees]}
          />

          <Input
            label="Weekly/Monthly"
            type="select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: "", label: "Select" },
              { value: "Weekly", label: "Weekly" },
              { value: "Monthly", label: "Monthly" },
            ]}
            required
          />

          <Input
            label="Select Month"
            type="select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            options={months}
            required
          />
        </div>

       {period && month && canCreate && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: theme.spacing.md,
            }}
          >
            <Button type="primary" onClick={handleCreate}>
              Create Report
            </Button>
          </div>
        )}

        {/* Generated Reports List */}
        {generatedReports.length > 0 && (
          <div style={{ marginTop: theme.spacing.xl }}>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: theme.spacing.md,
              }}
            >
              Generated Reports
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.sm,
              }}
            >
              {generatedReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => handleView(report)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.white,
                    border: `1px solid ${theme.colors.border || "#e0e0e0"}`,
                    borderRadius: theme.borderRadius.small,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow:
                      previewUrl === report.url ? "0 0 0 2px #3d34e6" : "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f8f9ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = theme.colors.white)
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: theme.colors.primary }}
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                      <path d="M14 2v6h6" />
                    </svg>
                    <span style={{ fontWeight: 500 }}>{report.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: theme.spacing.sm }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(report);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                      title="View"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(report);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                      title="Download"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inline Preview */}
        {previewUrl && (
          <div style={{ marginTop: theme.spacing.xl }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.sm,
              }}
            >
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>Preview</h3>
              <button
                onClick={() => setPreviewUrl(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: theme.colors.text.secondary,
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                border: `1px solid ${theme.colors.border || "#e0e0e0"}`,
                borderRadius: theme.borderRadius.small,
                overflow: "hidden",
                backgroundColor: "#fafafa",
                height: "600px",
              }}
            >
              <iframe
                src={previewUrl}
                title="Report Preview"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Format Dialog */}
      {showFormatDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.white,
              borderRadius: theme.borderRadius.medium,
              padding: theme.spacing.xl,
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                margin: `0 0 ${theme.spacing.md}px`,
                fontSize: "1.25rem",
              }}
            >
              Select Report Format
            </h3>
            <div
              style={{
                display: "flex",
                gap: theme.spacing.md,
                justifyContent: "center",
                marginTop: theme.spacing.lg,
              }}
            >
              <Button
                type="primary"
                onClick={() => handleFormatSelect("pdf")}
                style={{ minWidth: "120px" }}
              >
                PDF
              </Button>
              <Button
                type="primary"
                onClick={() => handleFormatSelect("excel")}
                style={{ minWidth: "120px" }}
              >
                Excel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
