import * as React from "react";
import {createBrowserRouter } from "react-router-dom"; 
import HomePage from "./Pages/HomePage";
import SIgnupPage from "./Pages/SIgnupPage";
import LoginPage from "./Pages/LoginPage";
import AddPostPage from "./Pages/AddPostPage";


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
    }
  ]
  );

  export default router;   