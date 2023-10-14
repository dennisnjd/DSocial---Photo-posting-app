import React, { useState, useEffect } from 'react'
import "./Navbar.css"

import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebase/config'


import { listenToAuthChanges, userSignOut } from '../../firebase/AuthDetails';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { CSSTransition } from 'react-transition-group';





function Navbar() {

    const [search, setSearch] = useState('')
    const [results, setResults] = useState<{ id: string; fName: string; lName: string; email: string; param: string; dpURL:string; }[]>([]);
    const [showResults, setShowResults] = useState(false) //show the search results div

    const [authUser, setAuthUser] = useState<User | null>(null);
    useEffect(() => {
        // const user = auth.currentUser;

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
        setShowResults(true)


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
                        param: result.firstName+result.id,
                        dpURL: result.dpURL,
                    }));

                    // Set the mapped results in the state
                    setResults(mappedResults);
                })
                .catch((error) => {
                    console.error('Error searching users:', error);
                });

        } else {
            console.log("no result for search");
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
                                    <Link className="nav-link active" aria-current="page" to="/home">Home</Link>

                                </li>
                                <li className="nav-item">
                                    {authUser ? (
                                        <Link to={`/profile/${authUser.displayName + authUser.uid}`} className="nav-link">
                                            {authUser.displayName}
                                        </Link>
                                    ) : (
                                        <p>Profile</p>
                                    )}
                                </li>
                                <li className="nav-item" onClick={handleSignOut} style={{cursor:"pointer"}}>
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

            <CSSTransition
                in={showResults}
                timeout={700} // Adjust the duration as needed
                classNames="fade" // CSS class names for the animation
                unmountOnExit
            >
                <>
                    {showResults && (

                        <div className="row">
                            <div className="col-md-9 d-none d-sm-block"></div>

                            <div className="showResults col-md-3 mt-1 col-xs-12">
                                {results && results.length > 0 ? (
                                    <>
                                        {results.map((obj) => (
                                            <div
                                                className="cardn row col-md-12"
                                                key={obj.id} // You should include a key prop for each mapped element
                                            >
                                                <div className="row d-flex align-items-center col-10" >
                                                    <img
                                                        src={obj.dpURL ? obj.dpURL : "https://i.pinimg.com/736x/04/59/df/0459df7b4b1a4a42c676584e5e865748.jpg"}
                                                        className="img-responsive"
                                                        width={0}
                                                        height={20}
                                                        alt="..."
                                                    />
                                                    <p
                                                        className='col-7'
                                                        style={{
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        {obj.fName + ' ' + obj.lName}
                                                    </p>
                                                </div>
                                                <div className="col-2 d-flex justify-content-end align-items-center">
                                                   <Link to={`/profile/${obj.param}`} style={{textDecoration:"none"}}> <h6>Profile</h6> </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className='cardn  col-md-12 pt-4'>
                                        <h6 >No Users found...!</h6>
                                    </div>
                                )}
                                <i className="closeIcon fa-regular fa-circle-xmark fa-shake fa-xl mt-4" onClick={() => setShowResults(false)}></i>

                            </div>
                        </div>




                    )

                    }
                </>
            </CSSTransition>

        </div >
    )
}

export default Navbar
