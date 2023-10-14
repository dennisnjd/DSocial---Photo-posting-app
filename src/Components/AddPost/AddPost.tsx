import React, { useState, useEffect, ChangeEvent } from 'react';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, storage, db } from '../../firebase/config';
import { listenToAuthChanges } from '../../firebase/AuthDetails';
import { User } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';



import "./AddPost.css"

function AddPost() {

  const navigate = useNavigate();



  const [authUser, setAuthUser] = useState<User | null>(null);
  const [nameData, setNameData] = useState<{ fName: string; lName: string; dpURL: string; }[]>([]);
  const [userName, setUserName] = useState<string>('');

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [desc, setdesc] = useState('')




  useEffect(() => {
    const user = auth.currentUser;
  
    listenToAuthChanges(auth, setAuthUser); // checking if user is logged in and storing name in authUser.
  
    if (authUser && authUser.uid) {
      const userId = authUser.displayName+authUser.uid;
      const userDocRef = doc(db, 'users', userId);
  
      // Fetch user data from Firestore
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const firstName = userData.firstName;
            const lastName = userData.lastName;
            const dpURL = userData.dpURL;
  
            // Create an array with fName and lName
            const data = [{ fName: firstName, lName: lastName  , dpURL: dpURL}];
  
            // Concatenate firstName and lastName to create userName
            const fullName = firstName + ' ' + lastName;
  
 
            if (data) {
              setNameData(data);
              setUserName(fullName); // Set the userName in state
              
            } else {
              setNameData([]);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching Firestore data:', error);
        });
    } else {
      setAuthUser(null);
      console.log('NO USER FOUND');
    }
  }, [authUser]);
  



  // Function to handle file input change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };


  const date = new Date();

  const userId = authUser ? authUser.uid : ''
  const storagePath = selectedImage ? `images/posts/${userId}/${date}-${selectedImage.name}` : '';
  const storageRef = ref(storage, storagePath);




  const postSubmit = async () => {
    if (authUser) {
      if (selectedImage) {
        try {
          // Upload the selected image to Firebase Storage
          const snapshot = await uploadBytes(storageRef, selectedImage);
          console.log("DP  uploaded successfully");

          // Get the download URL of the uploaded image
          const downloadURL = await getDownloadURL(storageRef);
          console.log("Download URL:", downloadURL);

          // Store the download URL in your database or use it as needed
          const objId = selectedImage.name + userId;
          const userRef = doc(db, "posts", objId);

          await setDoc(userRef, {
            userId: userId,
            userName: userName,
            downloadURL,
            description: desc,
            createdAt: date.toDateString(),
            time: date.toISOString(),
          });

          // Hide addPostDiv and show success div if they exist
          const addPostDiv = document.getElementById("addPostDiv");
          if (addPostDiv) {
            addPostDiv.style.display = "none";
          }

          const successDiv = document.querySelector(".success") as HTMLElement;
          if (successDiv) {
            successDiv.style.display = "block";
          }

          // Delay the navigation after 1.5 seconds
          setTimeout(() => {
            navigate("/home ");
          }, 1500);
        } catch (error) {
          console.error("Error uploading image:", error);
          // Handle the error, e.g., show an error message to the user
        }
      } else {
        alert("No image selected");
      }
    } else {
      alert("Login to share post");
    }
  };



  return (
    <>
      <div className='container col-md-7 col-xs-12 mt-md-5 ms-md-7' id='addPostDiv'>

        <div className="heading d-flex justify-content-between align-items-center">
          <p className="text-center mb-0">Create new post</p>
          <h6 className="mb-0" onClick={postSubmit}>Share</h6>
        </div>

        <div className="wrp row">
          <div className="photoSelect col-md-6 col-xs-12">
            <img alt="Posts" width="200px" height="200px" src={selectedImage ? URL.createObjectURL(selectedImage) : ''}></img>
            <br />
            <input
              onChange={handleImageChange}

              type="file"
              accept="image/*"
              className='contentPhoto ms-4'
            />
          </div>

          <div className="desc col-md-5 col-xs-12 ms-md-3">
            <div className="profImg d-none d-sm-block mt-2 ">
            {nameData.map((item, index) => (
              <img
                src={item.dpURL ? item.dpURL : "https://i.pinimg.com/736x/04/59/df/0459df7b4b1a4a42c676584e5e865748.jpg"}
                className="card-img-top"
                alt="..."
              />
            )
            )}
              <p style={{ fontWeight: 'bold', marginLeft: '15px' }}> {userName}</p>
            </div>
            <div className="writeDesc">
              <input type="text"
                className='contentType'
                placeholder='Write the post'
                value={desc}
                onChange={(e) => setdesc(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>



      <div className="success container col-md-7 col-xs-12 mt-md-5 ms-md-7" >
        <div className='Succes1 row'>
          <div className="imgg col-md-5 col-xs-12">
            <img alt="Posts" width="200px" height="200px" src={selectedImage ? URL.createObjectURL(selectedImage) : ''}></img>
          </div>

          <div className="descc col-md-5 col-xs-12 mt-md-5 mt-xs-4">
            <p>{desc}</p>
          </div>

        </div>
        <div>
          <h5 style={{ marginTop: '10vh' }}>Your post is shared 👍</h5>
        </div>
      </div></>
  )
}

export default AddPost
