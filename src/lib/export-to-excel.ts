import * as XLSX from "xlsx";

export const exportToExcel = (
  data: any[],
  filename: string,
  columnHeaders: string[],
  columnWidths?: number[]
) => {
  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet([]);

  // Add column headers
  XLSX.utils.sheet_add_aoa(worksheet, [columnHeaders], { origin: "A1" });

  // Add the data below the headers
  XLSX.utils.sheet_add_json(worksheet, data, {
    origin: "A2", // Data starts right below headers
    skipHeader: true,
  });

  // Set column widths if provided
  if (columnWidths) {
    worksheet["!cols"] = columnWidths.map((width) => ({ width }));
  }

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to a file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
