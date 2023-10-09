import React, { useState, useEffect } from 'react'
import "./Suggestions.css"


import { collection, getDocs } from "firebase/firestore"; //
import { db, auth } from '../../firebase/config';
import { listenToAuthChanges } from '../../firebase/AuthDetails';
import { User, onAuthStateChanged } from 'firebase/auth';

import { doc, getDoc, updateDoc } from "firebase/firestore";


function Suggestions({ updatePosts }: { updatePosts: (newData: any) => void } ) {

    const [authUser, setAuthUser] = useState<User | null>(null);
    const [suggested, setSuggested] = useState<{ id: string; fName: string; lName: string; email: string; time: string }[]>([]); //store details of suggested users

    const [following, setFollowing] = useState<string[]>([]);




    useEffect(() => {
        const user = auth.currentUser;
        const unSubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
                // User is signed in, fetch Firestore data and check followers
                const querySnapshotPromise = getDocs(collection(db, "users"));
                querySnapshotPromise
                    .then((querySnapshot) => {
                        const data: { id: string; fName: string; lName: string; email: string; time: string; }[] = []; // Define the type explicitly
                        querySnapshot.forEach((doc) => {
                            const id = doc.data().id;
                            const fName = doc.data().firstName;
                            const lName = doc.data().lastName;
                            const email = doc.data().email;
                            const time = doc.data().createdAt;

                            // Check if the userId is present in the 'followers' field
                            if (!doc.data().followers.includes(user.uid)) {
                                data.push({ id, fName, lName, email, time });
                            }
                        });
                        // Now 'data' contains the fetched Firestore data
                        setSuggested(data);
                        console.log("data in firestore suggested", data);
                    })
                    .catch((error) => {
                        console.error("Error fetching Firestore data:", error);
                        setSuggested([]);
                    });
            } else {
                // User is signed out, you can handle this case if needed
                setAuthUser(null)
                console.log("NO USER FOUND");
            }
        });

        // Clean up the listener when the component unmounts
        return () => unSubscribe();
    }, []);


    const userId = authUser ? authUser.displayName + authUser.uid : "" // Replace with the actual user's document ID
    const myId = authUser ? authUser.uid : '';

    const handleFollow = (id: string, fName: string) => {

        const userDocRef = doc(db, 'users', userId);

        let userToFollowId = id;

        // Retrieve the user's document
        //update following list of present user
        getDoc(userDocRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    // Document exists, now update the 'following' field
                    const userData = docSnapshot.data();
                    const currentFollowing = userData.following || []; // Initialize with an empty array if 'following' doesn't exist
                    const updatedFollowing = Array.from(new Set([...currentFollowing, userToFollowId])); // Ensure uniqueness

                    // Update the document with the new 'following' array
                    return updateDoc(userDocRef, { following: updatedFollowing });
                } else {
                    console.error('User document not found');
                }
            })
            .then(() => {
                console.log('Following updated successfully');
            })
            .catch((error) => {
                console.error('Error updating following:', error);
            });


        //update followers list of the other user
        let userToFollowDocId = fName + id;
        console.log("Other user id : ", userToFollowDocId);

        const userDoccRef = doc(db, 'users', userToFollowDocId);
        getDoc(userDoccRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    // Document exists, now update the 'following' field
                    const userData = docSnapshot.data();
                    const currentFollowers = userData.followers || []; // Initialize with an empty array if 'following' doesn't exist
                    const updatedFollowers = Array.from(new Set([...currentFollowers, myId])); // Ensure uniqueness

                    // Update the document with the new 'following' array
                    return updateDoc(userDoccRef, { followers: updatedFollowers });
                } else {
                    console.error('User document not found');
                }
            })
            .then(() => {
                console.log('Followers of other user updated successfully');
            })
            .catch((error) => {
                console.error('Error updating followers:', error);
            });


        // Check if the userId is not already in the following array
        if (!following.includes(id)) {
            // Add the userId to the following array
            setFollowing((prevFollowing) => [...prevFollowing, id]);
        }
        const newData =id
        updatePosts(newData);
    }


    return (


        <div className="container-fluid">


            <div className="people">
                <h5 className='mt-md-4 mb-md-5'>Suggested for you</h5>

                {authUser ? (
                    <>
                        {suggested
                            .filter((obj) => authUser.uid !== obj.id)
                            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                            .map((obj) => (
                                <div
                                    className="cardk row col-md-12 col-xs-12"
                                    style={{ width: '100%' }}
                                    key={obj.id}
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
                                        <h6 onClick={() => handleFollow(obj.id, obj.fName)}>
                                            {following.includes(obj.id) ? 'Following' : 'Follow'}
                                        </h6>
                                    </div>
                                </div>
                            ))
                        }

                    </>
                ) : (
                    <></>
                )}

            </div>
        </div>



    )
}

export default Suggestions
