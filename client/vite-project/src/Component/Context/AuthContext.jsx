import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // User persistent check
  // const checkUserLoggedIn = async () => {
  //   try {
  //     const res = await fetch(`http://localhost:8000/api/me`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });

  //     const result = await res.json();
  //     if (!result.error) {
  //       setUser(result);
  //       navigate("/dashboard", { replace: true });
  //     } else {
  //       navigate("/", { replace: true });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      const res = await fetch(`http://localhost:8000/api/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!result.error) {
        setUser(result);
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  };




  // user login
  const loginUser = async (userData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData }),
      });

      const result = await res.json();
      if (!result.error) {
        localStorage.setItem("token", result.token);
        setUser(result.userSend);
        toast.success("Login successful!");

        setTimeout(() => {
          toast.dismiss(); // Dismiss the toast after 3 seconds
          navigate("/dashboard", { replace: true });
        }, 1000); // Adjust the duration as needed
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // user register
  const registerUser = async (userData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData }),
      });

      const result = await res.json();
      if (!result.error) {
        toast.success("Registration successful!");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // add contacts
  const addContacts = async (contactData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...contactData }),
      });

      const result = await res.json();
      if (!result.error) {
        // toast.success("Contact Added successfully!");
        console.log(result);
      } else {
        if (
          result.error === '"phone" must be greater than or equal to 1000000000'
        ) {
          toast.error("Please enter a 10-digit phone number.");
        } else {
          toast.error(result.error);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // get all contacts
  const allContacts = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/mycontacts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();
      if (!result.error) {
        return result.contacts;
      } else {
        toast.error(result.error);
        return []; // Return an empty array if there's an error
      }
    } catch (err) {
      console.error(err);
      return []; // Return an empty array in case of an error
    }
  };

  // Delete Contact
  const deleteContacts = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();
      if (!result.error) {
        toast.success("Contact deleted successfully");
      } else {
        toast.error("Error deleting contact:", result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Contact
  const updateContact = async (id, data) => {
    try {
      const res = await fetch(`http://localhost:8000/api/contact/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.error) {
        toast.success("Contact updated successfully");
        // fetchAllContacts(); // Fetch updated contacts list
      } else {
        toast.error("Error updating contact:", result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        registerUser,
        addContacts,
        allContacts,
        deleteContacts,
        updateContact,
        user,
        setUser,
      }}
    >
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
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
