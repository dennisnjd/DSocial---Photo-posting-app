import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Suggestions from '../Components/Suggestions/Suggestions'
import Posts from '../Components/Posts/Posts'
import "./HomePage.css"

function HomePage() {
  return (
    <>
      <Navbar />

      <div className="container-fluid">

        <div className="row">
        <div className="left-column col-md-9 col-xs-12">
          <Posts />
        </div>
        <div className="right-column col-md-3 col-xs-12">
          <Suggestions />
        </div>
      </div>
    </div >
    </>
    );
}

export default HomePage
