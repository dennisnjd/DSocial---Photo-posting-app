import * as React from "react";
import {createBrowserRouter } from "react-router-dom"; 
import HomePage from "./Pages/HomePage";
import SIgnupPage from "./Pages/SIgnupPage";
import LoginPage from "./Pages/LoginPage";
import AddPostPage from "./Pages/AddPostPage";
import ProfilePage from "./Pages/ProfilePage";


const router = createBrowserRouter([
    { 
      path: "/",
      element: <HomePage/> ,
    },
    {
      path: "/signup",
      element: <SIgnupPage/>,
    },
    {
      path: "/login",
      element: <LoginPage/>
    },
    {
      path: "/post",
      element: <AddPostPage/>
    },
    {
      path:"/profile/:param",
      element: <ProfilePage/>
    }
  ]
  );

  export default router;   