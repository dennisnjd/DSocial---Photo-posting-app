import React, { useState, ChangeEvent, useEffect } from 'react'
import "./EditProfile.css"

import { listenToAuthChanges } from '../../firebase/AuthDetails';
import { User } from 'firebase/auth';
import { auth, storage, db } from '../../firebase/config';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';





function EditProfile() {
  const navigate = useNavigate();


  const [authUser, setAuthUser] = useState<User | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [bio, setBio] = useState('')


  useEffect(() => {
    listenToAuthChanges(auth, setAuthUser); // checking if user is logged in and storing name in authUser.

  })

  // Function to handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };


  const date = new Date();

  const userId = authUser ? authUser.uid : ''
  const storagePath = selectedImage ? `images/dp/${userId}/dp` : '';
  const storageRef = ref(storage, storagePath);

  const handleUpdate = async () => {
    console.log("CAUTION : UPDATE FUNCITON RUNNING");
    

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
          const objId = authUser?.displayName + userId;
          const userRef = doc(db, "users", objId);

          await setDoc(userRef, {
            bio: bio,
            dpURL: downloadURL,
          },{ merge:true });


          navigate(`/profile/${objId}`);


        }
        catch (error) {
          console.error("Error uploading image:", error);
          // Handle the error, e.g., show an error message to the user
        }
      } else {
        alert("No image selected");
      }
    }
  }

  return (
    <div>
      <div className="container col-xs-12">

          <div className="imgdiv col-md-8 col-xs-9 ms-md-5" style={{ display: "block" }}>
            <div className='row'>
              <div className='col-md-4 col-xs-12 mt-5 pt-5'>
                <h6 style={{ color: "silver" }}>Change Profile pic</h6>
              </div>

              <div className="ip col-md-6 col-xs-10 mt-4 pt-md-5 ms-xs-1">
                <input
                  className='col-12 inputfile'
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="biodiv col-md-12 col-xs-12 col-mt-4">
            <h6 style={{ color: "silver" }}>My Bio</h6>
            <textarea
              placeholder='Type Bio here...'
              className='col-9 bioInput'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <button className='mt-2' onClick={handleUpdate}>
            <div  className="bn39" ><span className="bn39span">Submit</span></div>

          </button>


      </div>
    </div >
  )
}

export default EditProfile
