import React, { useEffect, useState } from 'react'

import { auth, db } from '../../firebase/config'
import { listenToAuthChanges } from '../../firebase/AuthDetails';
import { User } from 'firebase/auth';
import { getDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/config';

import "./Profile.css"
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';


interface userDetails {
    firstName: string;
    lastName: string;
    followers: string[];
    following: string[];
    id: string;
    bio: string;
    dpURL: string;
}

interface posts {
    downloadURL: string;
    time: string;
}

interface followList {
    following: string[];
}


function Profile() {

    const { param } = useParams();


    const [authUser, setAuthUser] = useState<User | null>(null); //current user details
    const [userDetails, setUserDetails] = useState<userDetails | null>(null); //profle user details
    const [posts, setPosts] = useState<posts[]>([]);//profile user posts
    const [followList, setFollowList] = useState<followList | null>(null);//current user following list
    const [isUserFollowed, setIsUserFollowed] = useState(false) // check current user follows profile user
    const [shouldFetchPosts, setShouldFetchPosts] = useState(false);




    //to get following list of the logged in user to check if the user in the profle is i the following list of the curent user
    const checkFollow = () => {
        if (authUser) {

            const myId = authUser.displayName + authUser.uid;
            const userDocRef = doc(db, 'users', myId);

            getDoc(userDocRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userDta = docSnapshot.data() as followList;

                        if (userDta && userDta.following) {
                            const followingList: followList = { following: userDta.following, }
                            setFollowList(followingList);

                        } else {
                            console.error('Following data not found in user document');
                        }

                        // const followingList = userData[followingField] || [];

                    } else {
                        console.error('User document not FOUND');
                    }
                })
                .catch((error) => {
                    console.log("Error fetching document");

                })
        }

        if (userDetails && userDetails.id && followList && followList.following) {
            if (followList.following.includes(userDetails.id)) {
                setIsUserFollowed(true);
            } else {
                setIsUserFollowed(false);
            }
        }
    }


    useEffect(() => {
        // const user = auth.currentUser;

        listenToAuthChanges(auth, setAuthUser); // checking if user is logged in and storing name in authUser.
        console.log("From Homepage", listenToAuthChanges);
    }, []);


    useEffect(() => { //to retrieve the details of the profile
        if (authUser && param) {

            const userDocRef = doc(db, 'users', param);  //get details of the profile

            getDoc(userDocRef)
                .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const userDetailsData = docSnapshot.data() as userDetails;
                        console.log("User details : ", userDetails);
                        setUserDetails(userDetailsData);

                        // const followingList = userData[followingField] || [];

                    } else {
                        console.error('User document not FOUND');
                    }
                })
                .catch((error) => {
                    console.log("Error fetching document");

                })
        }

    }, [authUser, param])

    useEffect(() => {
        // Call checkFollow to check if the user is followed
        checkFollow();
    }, [userDetails, followList]);


    useEffect(() => { //to retrive posts of the profile

        if (userDetails && param) {

            const postsCollection = collection(db, 'posts'); //get posts of the profile
            const postsQuery = query(postsCollection, where('userId', '==', userDetails ? userDetails.id : null));

            // Fetch the posts using the query
            getDocs(postsQuery)
                .then((querySnapshot) => {
                    const postsData: posts[] = []
                    querySnapshot.forEach((doc) => {
                        // Assuming you have a Post type defined, replace 'Post' with your actual type
                        const post = doc.data() as posts;
                        postsData.push(post);
                    });
                    setPosts(postsData);
                })
                .catch((error) => {
                    console.error('Error fetching posts:', error);
                });
        }


    }, [userDetails, param, shouldFetchPosts])


    const userId = authUser ? authUser.displayName + authUser.uid : "" // Replace with the actual user's document ID
    const myId = authUser ? authUser.uid : '';

    const handleFollow = (id: string, firstName: string) => {  //to follow the profile user

        const userDocRef = doc(db, 'users', userId);

        let userToFollowId = userDetails?.id;

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
        let userToFollowDocId = userDetails?.id ? userDetails.firstName + userDetails.id : '';
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



    }



    const handleDeletePost = async (dwldURL: string) => {
        // Add logic to handle the delete action
        console.log('Delete clicked', dwldURL);

        try {
            // Step 1: Query the Firestore collection to find the document with matching downloadURL
            const postsCollection = collection(db, 'posts');
            const postsQuery = query(postsCollection, where('downloadURL', '==', dwldURL));
            const querySnapshot = await getDocs(postsQuery);

            if (!querySnapshot.empty) {
                // Check if there are matching documents

                // Assuming there's only one matching document, you can access it directly
                const document = querySnapshot.docs[0];

                // Retrieve the document ID
                const postId = document.id;

                // Create a reference to the document
                const postRef = doc(db, 'posts', postId);

                // Delete the document from Firestore
                await deleteDoc(postRef);
            }

            const storageRef = ref(storage, dwldURL);

            // Delete the image from Firebase Storage
            await deleteObject(storageRef);
            console.log("Image deleted from Firebase Storage.");

            setShouldFetchPosts(true);

        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }



    return (


        <section className="h-100 gradient-custom-2">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-lg-9 col-xl-7">
                        <div className="card">

                            {userDetails && (

                                <div>
                                    <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: "#000", height: "200px" }}>
                                        <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "150px" }}>
                                            <img src={userDetails.dpURL ? userDetails.dpURL : "https://i.pinimg.com/736x/04/59/df/0459df7b4b1a4a42c676584e5e865748.jpg"}
                                                alt="Generic placeholder image" className="img-fluid img-thumbnail mt-4 mb-2"
                                                style={{ width: "150px", zIndex: "1" }} />



                                            {userDetails?.id === authUser?.uid ? (
                                                <Link to="/editprofile">
                                                    <button type="button" className="btn btn-outline-dark mt-5" data-mdb-ripple-color="dark" style={{ zIndex: "1" }}>
                                                        Edit profile
                                                    </button>
                                                </Link>
                                            ) : (
                                                <>
                                                    {isUserFollowed ? (
                                                        <button type="button" className="btn btnFlwng btn-outline-dark mt-5" data-mdb-ripple-color="dark" style={{ zIndex: "1" }}>Following</button>
                                                    ) : (
                                                        <button type="button"
                                                            className="btn btn-outline-dark mt-5" data-mdb-ripple-color="dark"
                                                            style={{ zIndex: "1" }}
                                                            onClick={() => handleFollow(userDetails.id, userDetails.firstName)}>
                                                            Follow
                                                        </button>
                                                    )}
                                                </>
                                            )}





                                        </div>
                                        <div className="ms-3" style={{ marginTop: "130px" }}>
                                            <h5>{userDetails.firstName + " " + userDetails.lastName}</h5>
                                        </div>
                                    </div>
                                    <div className="p-4 text-black" style={{ backgroundColor: "#f8f9fa" }}>
                                        <div className="d-flex justify-content-end text-center py-1">
                                            <div>
                                                <p className="mb-1 h5">{posts.length}</p>
                                                <p className="small text-muted mb-0">Photos</p>
                                            </div>
                                            <div className="px-3">
                                                <p className="mb-1 h5">{userDetails.followers.length}</p>
                                                <p className="small text-muted mb-0">Followers</p>
                                            </div>
                                            <div>
                                                <p className="mb-1 h5">{userDetails.following.length}</p>
                                                <p className="small text-muted mb-0">Following</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="card-body p-4 text-black">
                                <div className="mb-5">
                                    <p className="lead fw-normal mb-1">Bio</p>
                                    <div className="p-4" style={{ backgroundColor: "#F6FDC3" }}>
                                        <p className="font-italic mb-1">{userDetails?.bio}</p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <p className="lead fw-normal mb-0">Photos shared</p>
                                </div>
                                <div className="row g-2 col-12">

                                    {posts && (
                                        posts
                                            .slice()
                                            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                                            .map((obj) => (

                                                <div className="imgOutline card bg-light text-white mb-2 col-4">
                                                    <img src={obj.downloadURL} alt="image 1" className="w-100 rounded-3 card-img img-responsive" />
                                                    {userDetails?.id === authUser?.uid && (
                                                        <div
                                                            className="dltsym card-img-overlay d-flex  align-items-end justify-content-end"
                                                            onClick={() => handleDeletePost(obj.downloadURL)}
                                                        >
                                                            <i className="fa-solid fa-trash" style={{ color: "#65e3ec", cursor: "pointer" }}></i>
                                                        </div>
                                                    )}

                                                </div>
                                            ))
                                    )}

                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Profile;
