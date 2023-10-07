import React, { useState, useEffect } from 'react'
import "./Navbar.css"

import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase/config'
import { listenToAuthChanges, userSignOut } from '../../firebase/AuthDetails';
import { User } from 'firebase/auth';



function Navbar() {

    const [authUser, setAuthUser] = useState<User | null>(null);
    useEffect(() => {
        const user = auth.currentUser;

        listenToAuthChanges(auth, setAuthUser); // checking if user is logged in and storing name in authUser.
        console.log("From Homepage", listenToAuthChanges);

    }, []);


    //firebase function for Logout user
    const handleSignOut = () => {
        userSignOut(auth); // Call the function with the Firebase auth object
    };


    return (
        <div>


            <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className=" cls container-fluid">
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">{authUser ? (
                                        authUser.displayName
                                    ) : (
                                        <p>Profile</p>
                                    )}</a>
                                </li>
                                <li className="nav-item" onClick={handleSignOut}>
                                    <a className="nav-link" >Logout</a>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/post">Post</Link>
                                </li>

                            </ul>
                            <form className="d-flex" role="search">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </nav>
            </nav>
        </div>
    )
}

export default Navbar
