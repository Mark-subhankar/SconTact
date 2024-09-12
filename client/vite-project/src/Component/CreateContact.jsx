import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import AuthContext from "./Context/AuthContext";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Sppiner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons";
import "./Style/NavStyle.css";

function CreateContact() {
  const navigate = useNavigate();
  const { user, addContacts } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    dob:""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Ensure that only numbers are entered and limit the length to 10 characters for the phone field
    if (name === "phone" && !/^\d{0,10}$/.test(value)) {
      return; // Prevent further execution
    }

    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Form data submitted (addContact):", userDetails);

    // Fill Empty condition justification
    if (!userDetails.name || !userDetails.phone) {
      toast.error("Name & Phone fields must be required!");
      return;
    }

    // Validate phone number length
    if (userDetails.phone.length !== 10) {
      toast.error("Phone number must be 10 digits!");
      return;
    }

    setLoading(true);
    try {
      await addContacts(userDetails);

      // Clear fields after successfully adding contact
      setUserDetails({
        name: "",
        address: "",
        email: "",
        phone: "",
        dob:""
      });
      toast.success("Contact added successfully!");
    } catch (error) {
      toast.error("Error adding contact. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Form onSubmit={handleSubmit} className="me-5 ms-5">
        <h1
          style={{ fontFamily: "Kaisei Tokumin" }}
          className="text-center mt-5"
        >
          Add Contacts
        </h1>

        <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
          <Form.Label>
            Name{" "}
            <FontAwesomeIcon
              style={{ color: "red", fontSize: "8px" }}
              icon={faStarOfLife}
            />
          </Form.Label>
          <Form.Control
            onChange={handleInputChange}
            value={userDetails.name}
            name="name"
            type="text"
            placeholder="Enter Name"
          />
        </Form.Group>



        <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            onChange={handleInputChange}
            value={userDetails.dob}
            name="dob"
            type="date"
            placeholder="Enter Date of Birth"
          />
        </Form.Group>




        <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
          <Form.Label>Address</Form.Label>
          <Form.Control
            onChange={handleInputChange}
            value={userDetails.address}
            name="address"
            type="text"
            placeholder="Enter Address"
          />
        </Form.Group>
        <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={handleInputChange}
            value={userDetails.email}
            name="email"
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>
        <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
          <Form.Label>
            Phone No{" "}
            <FontAwesomeIcon
              style={{ color: "red", fontSize: "8px" }}
              icon={faStarOfLife}
            />
          </Form.Label>
          <Form.Control
            onChange={handleInputChange}
            value={userDetails.phone}
            name="phone"
            type="phone"
            placeholder="Enter phone no"
          />
        </Form.Group>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <Button
            style={{margin:'40px 0px'}}
              id="Btn"
              className="d-grid gap-2 col-6 mx-auto mt-4"
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </>
        )}
      </Form>
    </>
  );
}

export default CreateContact;






