import React, { useState } from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Suggestions from '../Components/Suggestions/Suggestions'
import Posts from '../Components/Posts/Posts'
import "./HomePage.css"

function HomePage() {


  const [postData, setPostData] = useState([]);

  // Function to update postData
  const updatePosts = (newData) => {
    setPostData(newData); // Update the state in the parent component
  }

  return (
    <>
      <Navbar />

      <div className="container-fluid">

        <div className="row">
          <div className="left-column col-md-9 col-xs-12">
            <Posts postData={postData} />
          </div>
          <div className="right-column col-md-3 col-xs-12">
            <Suggestions updatePosts={updatePosts} />
          </div>
        </div>
      </div >
    </>
  );
}

export default HomePage;
