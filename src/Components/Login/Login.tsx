import React, { useEffect, useState } from 'react';

import './Login.css';
import { auth } from '../../firebase/config'
import { signInWithEmailAndPassword ,User} from 'firebase/auth';
import { listenToAuthChanges } from '../../firebase/AuthDetails';
import { Link, useNavigate } from 'react-router-dom';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';


function Login() {

    const navigate = useNavigate();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [authUser, setAuthUser] = useState<User | null>(null);

    //firebase function for  signin user
    const handleSubmit = (
        e: React.FormEvent,
        email: string,
        password: string
    ) => {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
            .then((useCredential) => {
                console.log(useCredential);
                navigate("/")

            }).catch((error) => {
                alert(error.message)
            })
    }




    //checking it the user already loggedin
    useEffect(() => {
        const user = auth.currentUser;

        listenToAuthChanges(auth, setAuthUser);
        console.log(listenToAuthChanges);
    }, [])

    return (
        <div>
            <div className="loginParentDiv">
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <form onSubmit={(e) => handleSubmit(e, email, password)}>
                    <label htmlFor="fname">Email</label>
                    <br />
                    <input
                        className="input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="fname"
                        name="email"
                    />
                    <br />
                    <label htmlFor="lname">Password</label>
                    <br />
                    <input
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="lname"
                        name="password"
                    />
                    <br />
                    <br />
                    <button >Login</button>
                </form>
                <Link to='/signup'>
                    <p>Signup</p>
                </Link>
            </div>

        </div>
    );
}

export default Login;
