import React, { useEffect, useState } from 'react';
import "./Posts.css"


import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../../firebase/config';
import { listenToAuthChanges } from '../../firebase/AuthDetails';
import { User } from 'firebase/auth';


function Posts() {

    const [authUser, setAuthUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<{ id: string; username: string; description: string; imageLink: string; date: string; time: string }[]>([]);

    useEffect(() => {
        const user = auth.currentUser;

        listenToAuthChanges(auth, setAuthUser); // checking if user is logged in and storing name in authUser.
        const querySnapshotPromise = getDocs(collection(db, "posts"));

        querySnapshotPromise
            .then((querySnapshot) => {
                const data: { id: string; username: string; description: string; imageLink: string; date: string; time: string }[] = []; // Define the type explicitly
                querySnapshot.forEach((doc) => {
                    const id = doc.id;
                    const username = doc.data().userName
                    const description = doc.data().description;
                    const imageLink = doc.data().downloadURL;
                    const date = doc.data().createdAt;
                    const time = doc.data().time
                    data.push({ id, username, description, imageLink, date, time });
                });
                // Now 'data' contains the fetched Firestore data
                setPosts(data);
                console.log("data in firestore", data);
            })
            .catch((error) => {
                console.error("Error fetching Firestore data:", error);
                setPosts([]); // Handle the error by setting a default value
            });

    }, []);



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
                        posts
                            .slice() // Create a copy of the 'posts' array to avoid modifying the original array
                            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()) // Sort the posts by date
                            .map((obj) => (
                                <div className="post col-md-8 col-xs-12 ms-md-5">
                                    <div className="postAccount col-xs-12" style={{ display: 'flex' }}>
                                        <div style={{ display: 'inline-block' }}>
                                            <h6>{obj.username}</h6>
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
                        <h2>User not Logged in</h2>
                    )}
                </div>



            </div>

        </div>
    )
}

export default Posts
