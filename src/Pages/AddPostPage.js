import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import AddPost from '../Components/AddPost/AddPost'
import PageTransition from '../Components/PageTransition/PageTransition'


function AddPostPage() {
  return (
    <div>
      <PageTransition>
      <Navbar/>
      <AddPost/>
      </PageTransition>
    </div>
  )
}

export default AddPostPage
