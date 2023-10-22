import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "./App.css";
import EditModal from "./components/EditModal";
import Pagination from "./components/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import { BiEdit } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
const App = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isChecked, setIsChecked] = useState(false);

  const itemPerPage = 10;
  let pages = [];

  const getData = async () => {
    const response = await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    const data = await response.json();
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  let tableIndex = data.map((item, index) => {
    let arr = [...Object.keys(item)];
    return new Set(arr);
  });

  let setToArray = new Set(...tableIndex);
  let keyArray = [...setToArray];
  keyArray.push("Action");
  keyArray = keyArray.filter((item) => item !== "isChecked" && item !== "id");

  const filterData = data.filter((item) => {
    if (search === "") {
      return item;
    } else if (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase())
    ) {
      return item;
    }
    return null;
  });

  for (let i = 1; i <= Math.ceil(filterData.length / itemPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = filterData.slice(indexOfFirstItem, indexOfLastItem);

  const handleEdit = (id) => {
    setOpen(true);
    const data = filterData.find((item) => item.id === id);
    setEditData(data);
  };
  const handleDelete = (id) => {
    const newData = filterData.filter((item) => item.id !== id);
    setData(newData);
  };
  const handleSave = (id) => {
    setData((pev) => {
      return pev.map((item) => {
        if (item.id === id) {
          return { ...item, ...editData };
        } else {
          return item;
        }
      });
    });
    setOpen(false);
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;

    if (e.target.name === "allSelect") {
      const value = data.map((item, index) => {
        if (currentItems.includes(item)) {
          return { ...item, isChecked: checked };
        } else {
          return item;
        }
      });
      setData(value);
      setIsChecked(!isChecked);
    } else {
      const newData = data.map((item, index) => {
        if (item.id === value) {
          return { ...item, isChecked: checked };
        } else {
          return item;
        }
      });
      setData(newData);
    }
  };

  const handleRowDelete = () => {
    const newData = data.filter((item) => !item.isChecked);
    setIsChecked(false);
    setData(newData);
  };

  return (
    <div className="main" onClick={() => open && setOpen(false)}>
      <div className="search-field">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Button onClick={handleRowDelete} variant="danger">
        Delete
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <InputGroup.Checkbox
                aria-label="Checkbox for following text input"
                name="allSelect"
                checked={isChecked}
                onChange={handleCheckbox}
              />
            </th>
            {keyArray.map((item, index) => {
              return <th key={index}>{item.toLocaleUpperCase()}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => {
            return (
              <tr
                key={index}
                style={{
                  backgroundColor: item.isChecked ? "rgba(0,0,0,0.2)" : null,
                }}
              >
                <td>
                  <InputGroup.Checkbox
                    aria-label="Checkbox for following text input"
                    value={item.id}
                    checked={item.isChecked || false}
                    onChange={handleCheckbox}
                  />
                </td>
                {keyArray.map((itm, ind) => {
                  return (
                    <td key={ind}>
                      {item[itm] ? (
                        item[itm]
                      ) : (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <Button size="sm" onClick={() => handleEdit(item.id)}>
                            <BiEdit size="20px" />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            <MdDeleteOutline size="20px" />
                          </Button>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pages={pages}
        currentItems={currentItems}
      />

      <EditModal
        editData={editData}
        setEditData={setEditData}
        setOpen={setOpen}
        handleSave={handleSave}
        open={open}
      />
    </div>
  );
};

export default App;
