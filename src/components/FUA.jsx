import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Label } from "./ui/label";
import { Loader } from "lucide-react";

// A simple CSV parser that assumes comma-separated values with a header row.
function parseCSV(csvText) {
  const lines = csvText.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) return { columns: [], data: [] };

  const header = lines[0].split(",");
  // Create TanStack Table-compatible columns
  const columns = header.map((col) => ({
    accessorKey: col.trim(),
    header: col.trim(),
  }));

  // Parse the data rows into objects based on the header columns
  const data = lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj = {};
    header.forEach((col, index) => {
      obj[col.trim()] = values[index]?.trim();
    });
    return obj;
  });

  return { columns, data };
}

const FileUploadAndAnalyze = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [isLoading , setIsLoading] = useState(false); 
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);

  // Upload files to /upload
  const handleUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    setMessage("Uploading files...");

    if (!file1 || !file2) {
      setMessage("Please select both files.");
      return;
    }

    // Create new File objects with the desired names
    const renamedFile1 = new File([file1], "X.csv", { type: file1.type });
    const renamedFile2 = new File([file2], "edge_index.csv", { type: file2.type });

    const formData = new FormData();
    formData.append("file1", renamedFile1);
    formData.append("file2", renamedFile2);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      setMessage("Files uploaded successfully!");
      setUploadSuccess(true); // Enable "Run Model" button
    } catch (error) {
      console.error(error);
      setMessage("Error uploading files.");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger run.py by calling /analyze, which returns output.csv
  const handleRunModel = async () => {
    setMessage("Running the model...");

    try {
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Model run failed");
      }
      // Instead of downloading the CSV, extract its text for parsing.
      const csvText = await response.text();
      const { columns, data } = parseCSV(csvText);
      setTableColumns(columns);
      setTableData(data);
      setMessage("Model run complete. Data loaded!");
    } catch (error) {
      console.error(error);
      setMessage("Error running the model.");
    }
  };

  // Set up TanStack Table using the data and columns from CSV
  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 text-white bg-neutral-800">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Files & Run Model</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg p-5">
            <Label className="h-44 w-full bg-neutral-700 flex justify-center rounded-lg cursor-pointer items-center border border-dashed " htmlFor="file1">
              {
                file1 ? file1.name : (
                  <div className="underline underline-offset-1 font-light" >Upload X CSV file</div>   
                )
              }
            </Label>
            <input
              id="file1"
              className="hidden"
              type="file"
              required
              onChange={(e) => setFile1(e.target.files[0])}
            />
          </div>
          <div className="rounded-lg p-5">
            <Label className="h-44 w-full bg-neutral-700 flex justify-center rounded-lg cursor-pointer items-center border border-dashed " htmlFor="file2">
              {
                file2 ? file2.name : (
                  <div className="underline underline-offset-1 font-light" >Upload your edgeIndex CSV file</div>   
                )
              }
            </Label>
            <input
              id="file2"
              type="file"
              onChange={(e) => setFile2(e.target.files[0])}
              className="hidden"
              required
            />
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-b flex justify-center items-center from-blue-600 to-blue-700/80 w-full cursor-pointer max-w-sm text-white px-4 py-2 rounded-md hover:opacity-95 duration-200 transition-all"
          >
            {
              isLoading ? <Loader className="animate-spin w-4 h-4"/> : "Upload Files"
            }
          </button>
        </div>
      </form>

      {uploadSuccess && (
        <div className="mt-4">
          <button
            onClick={handleRunModel}
            className="bg-green-600 flex justify-center text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Run Model
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-neutral-100">{message}</p>}

      {tableData.length > 0 && tableColumns.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Model Output</h3>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-200 px-4 py-2 bg-gray-100"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border border-gray-200 px-4 py-2"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUploadAndAnalyze;
