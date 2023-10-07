import React, { useState, useEffect, ChangeEvent } from 'react';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore';
import { auth, storage, db } from '../../firebase/config';
import { listenToAuthChanges } from '../../firebase/AuthDetails';
import { User } from 'firebase/auth';

import { useNavigate  } from 'react-router-dom';



import "./AddPost.css"

function AddPost() {

  const navigate = useNavigate();



  const [authUser, setAuthUser] = useState<User | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [desc, setdesc] = useState('')



  useEffect(() => {
    const user = auth.currentUser;

    listenToAuthChanges(auth, setAuthUser); // checking if user is logged in and storing name in authUser.
    console.log("From Homepage", listenToAuthChanges);

  }, []);

  // Function to handle file input change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };


  const date = new Date();

  const userId = authUser ? authUser.uid : ''
  const userName = authUser ? authUser.displayName : ''
  const storagePath = selectedImage ? `images/posts/${userId}/${date}-${selectedImage.name}` : '';
  const storageRef = ref(storage, storagePath);

  const postSubmit = async () => {
    if (authUser) {
      if (selectedImage) {
        try {
          // Upload the selected image to Firebase Storage
          const snapshot = await uploadBytes(storageRef, selectedImage);
          console.log("Image uploaded successfully");

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
            time: date.toISOString()
          });

          navigate("/");
        } catch (error) {
          console.error("Error uploading image:", error);
          // Handle the error, e.g., show an error message to the user
        }
      } else {
        alert("No image selected");
      }
    } else {
      alert("Login to add a product");
    }
  };


  return (
    <div className='container col-md-7 col-xs-12 mt-md-5 ms-md-7'>

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
          <div className="profImg d-none d-sm-block">
            <img
              src="https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png"
              className="card-img-top"
              alt="..."
            />
            <p style={{ fontWeight: 'bold', marginLeft: '15px' }}> {authUser?.displayName}</p>
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
  )
}

export default AddPost
