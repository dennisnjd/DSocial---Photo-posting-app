import React, { useEffect, useState } from 'react'

import { auth, db } from '../../firebase/config'
import { listenToAuthChanges } from '../../firebase/AuthDetails';
import { User } from 'firebase/auth';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';

import "./Profile.css"
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';


interface userDetails {
    firstName: string;
    lastName: string;
    followers: string[];
    following: string[];
    id: string;
}

interface posts {
    description: string;
    downloadURL: string;
    time: string;
}

function Profile() {

    const { param } = useParams();
    console.log("PARAM PASSED IS : ", param);


    const [authUser, setAuthUser] = useState<User | null>(null);
    const [userDetails, setUserDetails] = useState<userDetails | null>(null);
    const [posts, setPosts] = useState<posts[]>([]);


    useEffect(() => {
        // const user = auth.currentUser;

        listenToAuthChanges(auth, setAuthUser); // checking if user is logged in and storing name in authUser.
        console.log("From Homepage", listenToAuthChanges);

    }, []);

    useEffect(() => {
        if (authUser && param) {

            const userDocRef = doc(db, 'users', param);

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


            const postsCollection = collection(db, 'posts');
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



    }, [authUser,param])


    useEffect(() => {

        if (userDetails && param) {

           

            const postsCollection = collection(db, 'posts');
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


    }, [userDetails,param])

    return (
        <div>
            <div className="container ">
                {userDetails && (
                    <div className="header row col-md-10 col-xs-12">
                        <div className='col-4 float-left ms-5' >
                            <img className=' profImg col-12 rounded float-left' src="https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png" alt="Profile DP" />
                        </div>
                        <div className="details col-7 ms-xs-3" style={{ textAlign: 'left' }}>
                            <div className="profName mt-3">
                                <h5>{userDetails.firstName + " " + userDetails.lastName}</h5> <hr />
                            </div>
                            <div className="detailsProf row  mt-3">
                                <div className="postNum col-4">
                                    <h6>{posts.length} posts</h6>
                                </div>
                                <div className="followDetails col-4">
                                    <h6>{userDetails.following.length} following</h6>
                                </div>
                                <div className="followDetails col-4 col-xs-3"   >
                                    <h6>{userDetails.followers.length} followers</h6>
                                </div>
                            </div>
                            <div className="bio">
                                <p>This is my bio</p>

                            </div>
                            <div className="editProf">
                                <Link to='/'><button className="bn30">Edit profile</button></Link>

                            </div>
                        </div>
                        <hr className='mt-3' />
                    </div>
                )}


                <div className="body row col-12" >

                    {posts && (
                        posts
                            .slice()
                            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                            .map((obj) => (
                                <div className='postPhoto col-4 mt-1' >
                                    <div className="card bg-dark text-white mb-0">
                                        <img className="card-img img-responsive" src={obj.downloadURL} alt="Card image" />
                                        <div className="loveSym card-img-overlay mt-5 pt-md-5">
                                            <span ><i className="fa-brands fa-gratipay fa-beat fa-lg" style={{ color: "#99e5e5" }}></i>  5 </span>
                                        </div>
                                    </div>
                                </div>

                            ))
                    )}
                </div>

            </div>
        </div>
    )
}

export default Profile
