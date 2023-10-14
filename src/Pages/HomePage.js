import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Suggestions from '../Components/Suggestions/Suggestions'
import Posts from '../Components/Posts/Posts'
import PageTransition from '../Components/PageTransition/PageTransition'
import "./HomePage.css"





function HomePage() {



  const [postData, setPostData] = useState([]);
  const [doorOpen, setDoorOpen] = useState(true);
  useEffect(() => {
    // Delay the animation to occur after the component has mounted
    const timeoutId = setTimeout(() => {
      setDoorOpen(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  // Function to update postData
  const updatePosts = (newData) => {
    setPostData(newData); // Update the state in the parent component
  }

  return (
    <div>
      <PageTransition>
        <Navbar />

        <div className={`door ${doorOpen ? 'door-opened' : 'door-animation'}`}>

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
        </div>
</PageTransition>
    </div>
  );
}

export default HomePage;
