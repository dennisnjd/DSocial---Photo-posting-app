import * as React from "react";
import {createBrowserRouter } from "react-router-dom"; 
import HomePage from "./Pages/HomePage";
import SIgnupPage from "./Pages/SIgnupPage";
import LoginPage from "./Pages/LoginPage";
import AddPostPage from "./Pages/AddPostPage";
import ProfilePage from "./Pages/ProfilePage";
import EditProfilePage from "./Pages/EditProfilePage"

const router = createBrowserRouter([
    { 
      path: "/",
      element: <LoginPage/> ,
    },
    {
      path: "/signup",
      element: <SIgnupPage/>,
    },
    {
      path: "/home",
      element: <HomePage/>
    },
    {
      path: "/post",
      element: <AddPostPage/>
    },
    {
      path:"/profile/:param",
      element: <ProfilePage/>
    },
    {
      path:"/editprofile",
      element: <EditProfilePage/>
    }
  ]
  );

  export default router;   