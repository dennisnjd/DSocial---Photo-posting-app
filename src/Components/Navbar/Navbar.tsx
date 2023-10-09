import React, { useState, useEffect } from 'react'
import "./Navbar.css"

import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase/config'


import { listenToAuthChanges, userSignOut } from '../../firebase/AuthDetails';
import { User } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';



function Navbar() {

    const [search, setSearch] = useState('')
    const [results, setResults] = useState<{ id: string; fName: string; lName: string; email: string; }[]>([]);

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

    async function searchUsers(search: string) {
        const usersCollection = collection(db, 'users');
        let q = query(usersCollection);

        // Check if 'search' is not empty
        if (search) {
            // Split the search string into words
            console.log("Search word is : ", search);

            const searchWords = search.split(' ').map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1);

            })

            // Use a loop to add 'where' conditions for each search word
            searchWords.forEach((word) => {
                // Add 'where' conditions for 'firstName' and 'lastName'
                q = query(q, where('firstName', '==', word));
            });
        }

        const querySnapshot = await getDocs(q);

        const searchResults = querySnapshot.docs.map((doc) => doc.data());

        return searchResults;
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if 'search' is not empty
        if (search) {
            searchUsers(search)
                .then((searchResults) => {
                    // Map the search results to the desired type
                    const mappedResults = searchResults.map((result) => ({
                        id: result.id,
                        fName: result.firstName,
                        lName: result.lastName,
                        email: result.email,
                    }));

                    // Set the mapped results in the state
                    setResults(mappedResults);
                })
                .catch((error) => {
                    console.error('Error searching users:', error);
                });
        } else {
            setResults([])
        }
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
                            <form className="d-flex" role="search" onSubmit={(e) => handleSearch(e)}>
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form>

                        </div>
                    </div>
                </nav>
            </nav>

            <div className="row">
            <div className="showResults col-md-4 ml-auto">
  {results ? (
    <>
      {/* <p>{results}</p> */}
      {results.map((obj) => (
        <div
          className="cardn row col-md-12 col-xs-12"
          style={{ width: '100%' }}
          key={obj.id} // You should include a key prop for each mapped element
        >
          <div className="d-flex align-items-center col-md-8 col-xs-8">
            <img
              src="https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png"
              className="card-img-top"
              alt="..."
            />
            <p
              style={{
                fontWeight: '600',
                fontSize: '14px',
                marginLeft: '15px',
              }}
            >
              {obj.fName + ' ' + obj.lName}
                </p>
          </div>
          <div className="col-md-4 col-xs-4 d-flex justify-content-end align-items-center">
            
            <h6>Show Profile</h6>
          </div>
        </div>
      ))}
    </>
  ) : (
    <></>
  )}
</div>

            </div>

        </div>
    )
}

export default Navbar
