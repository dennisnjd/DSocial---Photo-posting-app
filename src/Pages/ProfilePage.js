import React from 'react'
import Profile from '../Components/Profile/Profile'
import Navbar from '../Components/Navbar/Navbar'
import PageTransition from '../Components/PageTransition/PageTransition'

function ProfilePage() {
  return (
    <div>
      <PageTransition>
      <Navbar/>
      <Profile/>
      </PageTransition>
    </div>
  )
}

export default ProfilePage
