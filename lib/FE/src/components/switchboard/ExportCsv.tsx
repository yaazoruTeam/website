import { Button } from "@mui/material";
import React from "react";

type ExportCSVProps = {
  data: Record<string, any>[];

  // TODO #2:
  // If the data coming from the server has a different structure,
  // update this type accordingly to match the real DB fields.
  filename?: string;
};

const ExportCSV: React.FC<ExportCSVProps> = ({
  data,
  filename = "export.csv",
}) => {
  const handleDownload = () => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((field) => `"${(row as any)[field]}"`).join(",")
      ),
    ];

    // TODO #3:
    // If you prefer downloading the CSV file directly from the server instead of generating it on the client side,
    // you can call an API endpoint that returns the file (e.g., with axios or fetch),
    // and either open the file using window.open or trigger a blob download.

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <Button onClick={handleDownload}>הורדת קובץ</Button>;
};

export default ExportCSV;