import React, { useState } from "react";
import PublicHeader from "../components/Public/PublicHeader";
import PublicFooter from "../components/Public/PublicFooter";
import ScrollButton from "../components/Public/ScrollButton";
import { useAuth } from "../context/AuthContext";
import NotificationButton from "../components/Public/NotificationButton";

const PublicLayout = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { token } = useAuth();

  const handleSearch = async (searchTerm) => {
    if (searchTerm !== "") {
      try {
        const response = await fetch(
          `http://localhost:5000/products/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ search: searchTerm }),
          }
        );
        const data = await response.json();
        console.log(data);
        setSearchResults(data);
        setSearchTerm(searchTerm);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    } else {
      setSearchResults([]);
      setSearchTerm(null);
    }
  };

  return (
    <>
      <PublicHeader onSearch={handleSearch} />

      <div style={{ 
        backgroundImage: "url('/images/PublicFound.jpg')", 
        backgroundRepeat: "no-repeat", 
        backgroundSize: "cover", 
        backgroundPosition: "center center", 
      }}>
        {React.Children.map(
          children,
          (child) =>
            React.cloneElement(child, {
              searchResults: searchResults,
              searchTerm: searchTerm || null,
            }) // Pasar searchTerm
        )}
      </div>
      
      <ScrollButton />
      {token && <NotificationButton />}
      <PublicFooter />
    </>
  );
};

export default PublicLayout;
