import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  TextareaAutosize,
} from "@mui/material";
import {db} from '../../firebase';
import { makeStyles } from "@mui/styles";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";



const useStyles = makeStyles({
  tableContainer: {
    marginBottom: "1rem",
  },
  searchInput: {
    marginBottom: "1rem",
  },
  cell: {
    padding: "12px",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "6px",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.1)",
    "&:focus": {
      backgroundColor: "#fff",
      boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
    },
  },
  textarea: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "6px",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.1)",
    resize: "vertical",
    "&:focus": {
      backgroundColor: "#fff",
      boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
    },
  },
  select: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "6px",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.1)",
    "&:focus": {
      backgroundColor: "#fff",
      boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
    },
  },
});
const MyTable = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
  const fetchData = async () => {
      try {
      const citiesCol = collection(db, "countries");
      const citySnapshot = await getDocs(citiesCol);
      const fetchedData = citySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(fetchedData);
      setFilteredData(fetchedData);
      } catch (error) {
      console.error("Error fetching data:", error);
      }
  };

  fetchData();
  }, []);

 const handleUpdate = async (id, field, value) => {
   try {
     await updateDoc(doc(db, "countries",id), {
      [field]:value
     });

   } catch (error) {
     console.error("Error updating data:", error);
   }
 };
  
  const handleInputChange = (event, id, key) => {
    const updatedData = data.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [key]: event.target.value,
        };
      }
      return item;
    });
    setData(updatedData);
    setFilteredData(updatedData);

  };

  const handleBlur = (event,id, key) => {
    handleUpdate(id, key, event.target.value);
  };

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchText(searchText);
    const filteredData = data.filter((item) => {
      return (
        item.id.toString().includes(searchText) ||
        item.name.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText));
    });
    setFilteredData(filteredData);
  };

  return (
    <div>
      <TextField
        className={classes.searchInput}
        label="Search"
        value={searchText}
        onChange={handleSearch}
        fullWidth
        style={{ marginBottom: "1rem" }}
      />
      <TableContainer className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cell}>ID</TableCell>
              <TableCell className={classes.cell}>Name</TableCell>
              <TableCell className={classes.cell}>Description</TableCell>
              <TableCell className={classes.cell}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <span>{item.id}</span>
                </TableCell>
                <TableCell>
                  <TextField
                    className={classes.input}
                    value={item.name}
                    onChange={(e) => handleInputChange(e, item.id, "name")}
                    onBlur={(e) => handleBlur(e, item.id, "name")}
                  />
                </TableCell>
                <TableCell>
                  <TextareaAutosize
                    className={classes.textarea}
                    value={item.description}
                    onChange={(e) =>
                      handleInputChange(e, item.id, "description")
                    }
                    onBlur={(e) => handleBlur(e, item.id, "description")}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    className={classes.select}
                    value={item.status}
                    onChange={(e) => handleInputChange(e, item.id, "status")}
                    onBlur={(e) => handleBlur(e, item.id, "status")}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="canceled">Canceled</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyTable;
