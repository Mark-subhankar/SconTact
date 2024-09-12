// import React, { useContext, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AuthContext from "./Context/AuthContext";
// import "./Style/NavStyle.css";

// function Dashboard() {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     if (!user) {
//       navigate("/", { replace: true });
//     }
//   }, [user, navigate]);
//   return (
//     <>
//       <div className="jumbotron">
//         <h1
//           style={{ fontFamily: "Protest Riot" }}
//           className="display-4 text-center mt-5 "
//         >
//           Welcome {user ? user.name : null}
//         </h1>
//         <p
//           style={{ fontFamily: "Kaisei Tokumin", fontSize: "20px" }}
//           className="text-center mt-3"
//         >
//           Welcome to Cloud Backup! 🌥️ We're thrilled to have you join our secure
//           and reliable platform.
//         </p>
//         <p className="lead">
//           <Link
//             id="Btn"
//             className="btn btn-primary btn-lg d-grid gap-2 col-6 mx-auto mt-4"
//             to="/create-contact"
//             role="button"
//           >
//             Add Contact
//           </Link>
//         </p>
//       </div>
//     </>
//   );
// }

// export default Dashboard;







import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "./Context/AuthContext";
import Profile from "./Profile"; // Import the Profile component
import "./Style/NavStyle.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <div className="jumbotron">
        <h1
          style={{ fontFamily: "Protest Riot" }}
          className="display-4 text-center mt-5 "
        >
          Welcome {user ? user.name : null} to B-Contact
        </h1>
        {/* <Profile />  */}
        <p
          style={{ fontFamily: "Kaisei Tokumin", fontSize: "20px" }}
          className="text-center mt-3"
        >
          Welcome to Cloud Backup! 🌥️ We're thrilled to have you join our secure
          and reliable platform.
        </p>
        <p className="lead">
          <Link
            id="Btn"
            className="btn btn-primary btn-lg d-grid gap-2 col-6 mx-auto mt-4"
            to="/create-contact"
            role="button"
          >
            Add Contact
          </Link>
        </p>
      </div>
    </>
  );
}

export default Dashboard;
