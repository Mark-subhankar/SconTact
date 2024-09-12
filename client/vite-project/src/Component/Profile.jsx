import React, { useState } from "react";
import "./Style/ProfileStyle.css";

function Profile() {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-image">
        <div className="image-wrapper">
          {image ? (
            <img src={image} alt="Profile" />
          ) : (
            <div className="no-image">No Image Selected</div>
          )}
        </div>
      </div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
    </div>
  );
}

export default Profile;
