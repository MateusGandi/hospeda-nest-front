import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  styled,
  Typography,
} from "@mui/material";

const CustomField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    border: "none",
    color: "#fff !important",
    "& fieldset": { border: "none" },
    "&:hover fieldset": { border: "none" },
    "&.Mui-focused fieldset": { border: "none" },
  },
  "& .MuiInputLabel-root": {
    color: "#fff",
    left: "-10px",
    transform: "translate(14px, -23px) scale(1)",
  },
  "& .MuiInputLabel-shrink": {
    color: "#fff",
    transform: "translate(14px, -23px) scale(1)",
  },
  "& .MuiInputBase-input": {
    color: "#fff",
    height: "15px",
    "&::placeholder": {
      opacity: 1,
      color: "rgba(255,255,255,0.7)",
    },
  },
});

const EditableTable = ({ columns, rows, onChange }) => {
  const handleCellChange = (rowIndex, field, value) => {
    try {
      const updatedRows = [...rows];
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        [field]: value,
      };
      onChange(updatedRows);
    } catch (err) {
      console.error("Erro ao alterar célula:", err);
    }
  };

  return (
    <TableContainer
      elevation={0}
      sx={{
        overflow: "hidden",
        border: "1px solid #606060",
        borderRadius: "10px",
        overflowX: { xs: "scroll", md: "hidden" },
      }}
    >
      <Table
        sx={{
          borderCollapse: "separate",
          borderSpacing: 0,
          tableLayout: "fixed",
          width: "100%",
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell
                key={col.field}
                sx={{
                  width: col.width || "auto",
                  maxWidth: col.width || "auto",
                  borderRight:
                    index !== columns.length - 1 ? "1px solid #505050" : "none",
                  borderBottom: "1px solid #606060",
                  backgroundColor: "#424242",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "10px 16px",
                  fontSize: "15px",
                }}
              >
                {col.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{
                  textAlign: "center",
                  color: "#aaa",
                  padding: "16px",
                }}
              >
                <Typography variant="body1">
                  Nenhuma linha disponível
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIndex) => {
              const isLastRow = rowIndex === rows.length - 1;
              return (
                <TableRow key={row.id || rowIndex}>
                  {columns.map((col, colIndex) => {
                    const value = row[col.field];
                    let cellContent = null;

                    try {
                      if (col.renderCell) {
                        cellContent = (
                          <Typography sx={{ p: "6px 16px" }}>
                            {col.renderCell(row, rowIndex)}
                          </Typography>
                        );
                      } else if (
                        col.editable &&
                        (col.type === "text" || col.type === "number")
                      ) {
                        cellContent = (
                          <CustomField
                            fullWidth
                            type={col.type}
                            value={
                              col.format && typeof value === "string"
                                ? col.format(rowIndex, col.field, value, value)
                                : value || ""
                            }
                            placeholder={col.placeholder || ""}
                            onChange={(e) =>
                              handleCellChange(
                                rowIndex,
                                col.field,
                                e.target.value,
                                value
                              )
                            }
                          />
                        );
                      } else {
                        const displayValue = col.format
                          ? col.format(value, row)
                          : value || col.placeholder || "";

                        cellContent = (
                          <Typography sx={{ p: "6px 16px" }}>
                            {displayValue}
                          </Typography>
                        );
                      }
                    } catch (err) {
                      console.error(
                        `Erro ao renderizar célula [${col.field}]:`,
                        err
                      );
                      cellContent = "Erro";
                    }

                    return (
                      <TableCell
                        key={col.field}
                        sx={{
                          width: col.width || "auto",
                          maxWidth: col.width || "auto",
                          borderRight:
                            colIndex !== columns.length - 1
                              ? "1px solid #404040"
                              : "none",
                          borderBottom: isLastRow
                            ? "none"
                            : "1px solid #505050",
                          padding: 0,
                          color: "#fff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EditableTable;
