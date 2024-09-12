import React, { useContext, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "./Context/AuthContext";
import "./Style/NavStyle.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook} from '@fortawesome/free-solid-svg-icons';


function NavbarItem() {
  // State to control the visibility of the Offcanvas menu
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const { user, setUser } = useContext(AuthContext);

  return (
    <>
      {[false, "sm", "md", "lg", "xl", "xxl"].map((expand, index) =>
        index === 1 ? (
          <Navbar
            key={expand}
            expand={expand}
            className="NavBar"
          >
            <Navbar.Brand className="Title" id="titleB-Contact" as={Link} style={{fontFamily: "Ribeye Marrow"}} to="/">
              {/* <img src={title} alt="" /> */}
             <FontAwesomeIcon icon={faAddressBook} /> B-Contact
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand-${expand}`}
              onClick={() => setShowOffcanvas(!showOffcanvas)} // Toggle the Offcanvas menu on toggle button click
            />
            <Navbar.Offcanvas
              show={showOffcanvas} // Set the visibility based on the state
              onHide={() => setShowOffcanvas(false)} // Close the Offcanvas menu when onHide is triggered
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title style={{fontFamily: "Ribeye Marrow"}} className="Title" id={`offcanvasNavbarLabel-expand-${expand}`}>
                 <FontAwesomeIcon icon={faAddressBook} /> B-Contact
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  {user ? (
                    <>
                       <Nav.Link
                        as={Link}
                        to="/dashboard"
                        onClick={() => setShowOffcanvas(false)}
                        className="NavbarItem-link"
                      >
                        DashBoard
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/create-contact"
                        onClick={() => setShowOffcanvas(false)}
                        className="NavbarItem-link"
                      >
                        Create
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/allcontacts"
                        onClick={() => setShowOffcanvas(false)}
                        className="NavbarItem-link"
                      >
                        AllContacts
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="#"
                        onClick={() => {
                          setUser(null);
                          localStorage.clear();
                          setShowOffcanvas(false);
                        }}
                        className="NavbarItem-link"
                      >
                        LogOut
                      </Nav.Link>
                    </>
                  ) : (
                    <>
                      <Nav.Link
                        as={Link}
                        to="/"
                        onClick={() => setShowOffcanvas(false)}
                        className="NavbarItem-link"
                      >
                        Home
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/about"
                        onClick={() => setShowOffcanvas(false)}
                        className="NavbarItem-link"
                      >
                        About
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/login"
                        onClick={() => setShowOffcanvas(false)}
                        className="NavbarItem-link"
                      >
                        Login
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/signup"
                        onClick={() => setShowOffcanvas(false)}
                        className="NavbarItem-link"

                      >
                        SignUp
                      </Nav.Link>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Navbar>
        ) : null
      )}
    </>
  );
}

export default NavbarItem;




