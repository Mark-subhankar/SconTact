import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faFloppyDisk,
  faDownload,
  faRotateRight,
  faCopy,
  faClone
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "./Context/AuthContext";
import Spinner from "./Sppiner"; // Corrected typo
import "react-toastify/dist/ReactToastify.css";
import Form from "react-bootstrap/Form";
import * as XLSX from "xlsx"; // Import XLSX library for Excel manipulation
import "./Style/NavStyle.css";

function AllContacts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({});
  const [formData, setFormData] = useState({});
  const [originalContacts, setOriginalContacts] = useState([]);
  const { user, allContacts, deleteContacts, updateContact } =
    useContext(AuthContext);
  const [copiedMessage, setCopiedMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
    fetchAllContacts();
  }, [user, navigate]);

  useEffect(() => {
    // Check for upcoming birthdays when contacts change
    checkUpcomingBirthdays();
  }, [contacts]);

  const fetchAllContacts = async () => {
    setLoading(true);
    try {
      const result = await allContacts();
      if (!result.error) {
        setContacts(result);
        setOriginalContacts(result); // Save the original list of contacts
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setLoading(true);
      try {
        await deleteContacts(id);
        setShowModal(false);
        fetchAllContacts();
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const deleteAllContacts = async () => {
    if (window.confirm("Are you sure you want to delete all contacts?")) {
      setLoading(true);
      try {
        await fetch(`http://localhost:8000/api/deleteAll`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLoading(false);
        fetchAllContacts(); // Refresh the contacts list
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateContact(modalData._id, formData);
      setLoading(false);
      setShowModal(false);
      fetchAllContacts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    // If the field is the date of birth, format the date string
    let value = e.target.value;
    if (e.target.name === "dob") {
      // Format the date string to match the input type 'date'
      value = new Date(value).toISOString().split("T")[0];
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Inside handleEditClick function
  const handleEditClick = (contact) => {
    // Format the date string if necessary
    const formattedDob = contact.dob
      ? new Date(contact.dob).toISOString().split("T")[0]
      : "";

    setModalData(contact);
    setShowModal(true);
    setFormData({
      name: contact.name,
      dob: formattedDob, // Set the formatted date
      address: contact.address,
      email: contact.email,
      phone: contact.phone,
    });
  };

  const downloadContacts = () => {
    // Extract only the required columns from contacts
    const dataToDownload = contacts.map((contact) => {
      return {
        Name: contact.name,
        dob: contact.dob,
        Address: contact.address,
        Email: contact.email,
        Phone: contact.phone,
      };
    });

    // Prepare the Excel file
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "contacts";
    const ws = XLSX.utils.json_to_sheet(dataToDownload);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });

    // Trigger the download
    const href = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + fileExtension;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const newSearchUser = originalContacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    console.log(newSearchUser);
    setContacts(newSearchUser);
  };

  const resetSearch = () => {
    setSearchInput(""); // Clear the search input
    setContacts(originalContacts); // Reset contacts to the original list
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage({ ...copiedMessage, [key]: "Text Copied" });
    setTimeout(() => {
      setCopiedMessage({ ...copiedMessage, [key]: "" });
    }, 2000);
  };

  const checkUpcomingBirthdays = () => {
    // Get today's date
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Check each contact's birthday
    contacts.forEach((contact) => {
      const dob = new Date(contact.dob);
      const dobMonth = dob.getMonth() + 1;
      const dobDay = dob.getDate();

      if (todayMonth === dobMonth && todayDay === dobDay) {
        // Birthday notification logic goes here
        sendNotification(`Today is ${contact.name}'s birthday! 🎂🎁`);
      }
    });
  };

  const sendNotification = (message) => {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
    } else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      const options = {
        body: "Let's celebrate this special day together!",
        icon: "path/to/celebration-icon.png", // Path to your celebration icon
      };
      new Notification(message, options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const options = {
            body: "Let's celebrate this special day together!",
          };
          new Notification(message, options);
        }
      });
    }
  };

  return (
    <>
      <h3
        style={{ fontFamily: "Kaisei Tokumin" }}
        className="text-center mt-4 mb-4"
      >
        Your Contacts
      </h3>
      {contacts.length > 0 && (
        <>
          <form className="d-flex" onSubmit={handleSearchSubmit}>
            <input
              style={{ margin: "0px 10px" }}
              type="text"
              name="searchInput"
              id="searchInput"
              className="form-control"
              placeholder="Search Contact"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              style={{ color: "white" }}
              id="Btn"
              type="submit"
              className="btn btn-secondary"
            >
              Search
            </button>
            <button
              id="Btn"
              style={{ margin: "0px 10px" }}
              type="button"
              className="btn btn-secondary"
              onClick={resetSearch}
            >
              Reset
            </button>
          </form>
          <div
            className="deleteDownloadSearch"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "20px 10px",
            }}
          >
            <div>
              <h6
                style={{ textAlign: "left", cursor: "pointer" }}
                onClick={deleteAllContacts}
              >
                Delete All <FontAwesomeIcon icon={faTrash} />
              </h6>
            </div>
            <div style={{ flexGrow: 1 }}></div>
            <div>
              <h6
                style={{ textAlign: "right", cursor: "pointer" }}
                onClick={downloadContacts}
              >
                Download <FontAwesomeIcon icon={faDownload} />
              </h6>
            </div>
          </div>
        </>
      )}
      {loading ? (
        <Spinner splash="Loading Contacts..." />
      ) : (
        <>
          {contacts.length === 0 ? (
            <div className="text-center">
              <p>No contacts available.</p>
              <button
                id="Btn"
                className="btn btn-primary"
                onClick={fetchAllContacts}
              >
                Reload <FontAwesomeIcon icon={faRotateRight} />
              </button>
            </div>
          ) : (
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, index) => {
                  // Format the date string if necessary
                  const formattedDob = contact.dob
                    ? new Date(contact.dob).toISOString().split("T")[0]
                    : "";

                  return (
                    <tr
                      key={contact._id}
                      onClick={() => handleEditClick(contact)}
                    >
                      <td>{index + 1}</td>
                      <td>{contact.name}</td>
                      <td>{formattedDob}</td>
                      <td>{contact.address}</td>
                      <td>{contact.email}</td>
                      <td>{contact.phone}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit & Delete Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 mt-0" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <div className="input-group">
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
                <span className="input-group-text">
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopy(formData.name, "name")}
                    icon={copiedMessage["name"] ? faClone : faCopy}
                  />
                </span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3 mt-0" controlId="formBasicEmail">
              <Form.Label>Date Of Birth</Form.Label>
              <div className="input-group">
                <Form.Control
                  name="dob"
                  type="date"
                  placeholder="Enter Date of Birth"
                  value={formData.dob || ""}
                  onChange={handleChange}
                />
                <span className="input-group-text">
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopy(formData.dob, "dob")}
                    icon={copiedMessage["dob"] ? faClone : faCopy}
                  />
                </span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
              <Form.Label>Address</Form.Label>
              <div className="input-group">
                <Form.Control
                  name="address"
                  type="text"
                  placeholder="Enter Address"
                  value={formData.address || ""}
                  onChange={handleChange}
                />
                <span className="input-group-text">
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopy(formData.address, "address")}
                    icon={copiedMessage["address"] ? faClone : faCopy}
                  />
                </span>
              </div>
            </Form.Group>
            <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <div className="input-group">
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
                <span className="input-group-text">
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopy(formData.email, "email")}
                    icon={copiedMessage["email"] ? faClone : faCopy}
                  />
                </span>
              </div>
            </Form.Group>
            <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
              <Form.Label>Phone No</Form.Label>
              <div className="input-group">
                <Form.Control
                  name="phone"
                  type="phone"
                  placeholder="Enter phone no"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
                <span className="input-group-text">
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopy(formData.phone, "phone")}
                    icon={copiedMessage["phone"] ? faClone : faCopy}
                  />
                </span>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Button
                variant="primary"
                id="Btn"
                onClick={() => deleteContact(modalData._id)}
              >
                Delete <FontAwesomeIcon icon={faTrash} />
              </Button>
              <Button variant="primary" id="Btn" onClick={handleSave}>
                Save change <FontAwesomeIcon icon={faFloppyDisk} />
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AllContacts;
