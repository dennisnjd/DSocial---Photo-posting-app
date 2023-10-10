import React, { useEffect, useState } from 'react';
import "./Posts.css"


import { collection, getDocs, getDoc, where, query } from "firebase/firestore";
import { db, auth } from '../../firebase/config';
// import { listenToAuthChanges } from '../../firebase/AuthDetails';
import {  onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { doc } from 'firebase/firestore';


function Posts({ postData }) {

    const [authUser, setAuthUser] = useState('');
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        // Ensure authUser is updated when the component mounts
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
        });

        return () => {
            unsubscribe(); // Clean up the auth state listener when the component unmounts
        };
    }, []);



    useEffect(() => {
        console.log('postData prop changed:', postData);

        if (authUser) {
            // const user = auth.currentUser;
            // const unSubscribe = onAuthStateChanged(auth, (user) => {
            // setAuthUser(user);
            const userId = authUser.displayName + authUser.uid;

            const userDocRef = doc(db, 'users', userId);
            const followingField = 'following';

            getDoc(userDocRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userData = docSnapshot.data();
                        const followingList = userData[followingField] || [];

                        // Use the following list to construct a query to fetch posts from the "posts" collection
                        const postsCollection = collection(db, 'posts');
                        const postsQuery = query(
                            postsCollection,
                            where('userId', 'in', followingList) // Filter posts by followingList
                        );

                        return getDocs(postsQuery);
                    } else {
                        console.error('User document not found in POSTSSS');
                        return { docs: [] }; // Return an empty QuerySnapshot-like object
                    }
                })
                .then((querySnapshot) => {
                    const data = [];
                    // console.log("DATA ARRAY CREATED");

                    // Iterate over querySnapshot.docs instead of calling forEach on it
                    querySnapshot.docs.forEach((doc) => {
                        const id = doc.id;
                        // console.log("DETAILS PUSHED: ", doc.data());
                        const username = doc.data().userName;
                        const description = doc.data().description;
                        const imageLink = doc.data().downloadURL;
                        const date = doc.data().createdAt;
                        const time = doc.data().time;
                        const displayNames = doc.data().userName.split(' ');
                        
                        const param =  displayNames[0]+doc.data().userId;

                        if (doc.data().userId !== authUser?.uid) {
                            // console.log("Edaa Mone ..come on");
                            data.push({ id, username, description, imageLink, date, time,param });
                            // data ? console.log("POST DATA ARE: ",data) : console.log("NO POST DATA");
                        }
                    });

                    if (data) {
                        setPosts(data);
                    } else {
                        setPosts([]);
                    }
                    // console.log("data in firestore posts shows", data);
                })
                .catch((error) => {
                    // console.error("Error fetching Firestore data:", error);
                    setPosts([]);
                });
        } else {
            setAuthUser(null);
            console.log("NO USER FOUND");
        }
    }, [authUser, postData]);





    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const seeMoreHandle = () => {
        setIsContentExpanded(!isContentExpanded);
    }

    return (
        <div>


            <div className="row">

                <div className="posts">
                    <h4 style={{ color: '#737373' }}>My Timeline</h4>


                    {authUser ? (
                        posts.length > 0 ? (
                            posts
                                .slice()
                                .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                                .map((obj) => (
                                    <div className="post col-md-8 col-xs-12 ms-md-5">
                                        <div className="postAccount col-xs-12" style={{ display: 'flex' }}>
                                            <div style={{ display: 'inline-block' }}>
                                            <Link className='link' to={`/profile/${obj.param}`}><h6>{obj.username}</h6></Link>
                                                <p>Follow</p>

                                            </div>
                                            <h6 className="date">{obj.date}</h6>
                                        </div>
                                        <div className="postScene">
                                            <img src={obj.imageLink} className="img-thumbnail" alt="..." />
                                            <div className={`content ${isContentExpanded ? 'expanded' : ''}`}>
                                                <p className="postDesc">{obj.description}</p>
                                            </div>
                                        </div>
                                        <button
                                            className={`seeMore ${isContentExpanded ? 'expandedbtn' : ''}`}
                                            onClick={seeMoreHandle}
                                        >
                                            {isContentExpanded ? 'See less' : 'See more'}
                                        </button>
                                    </div>
                                ))
                        ) : (
                            <p>Follow some users to see posts</p>
                        )
                    ) : (
                        <>
                            <h2>User not Logged in</h2>
                            <p><Link to='/login'>Login</Link> to see posts</p>
                        </>
                    )}


                </div>



            </div>

        </div>
    )
}

export default Posts
