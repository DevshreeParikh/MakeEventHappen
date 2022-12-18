import React from 'react'
import bgImg from '../img/img1.png';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// import '../css/User.css';

export default function Form() {
    const [resend, setResend] = useState(false);
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [validate, setValidate] = useState(false);
    const [alreadyExist, setExist] = useState(false);
    const [mail, setMail] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = async data => {
        const res = await axios.post('http://localhost:8000/user/signup', data)
        if (res.data.status === "PENDING") {
            setValidate(true);
            setExist(false);
            setMail(true);
            setResend(false);
            setId(res.data.data.userId);
            setEmail(res.data.data.email);
        }
        if (res.data.message === "User with the provided email already exists") {
            setExist(true);
            setValidate(false);
            setResend(false);
            setMail(false)
        }
    }

    const onSubmit4 = async data1 => {
        data1.userId = id;
        data1.email = email;
        const res = await axios.post('http://localhost:8000/email_verification/resend', data1)
        if (res.data.status === "PENDING") {
            setResend(true);
            setValidate(false);
            setExist(false);
            setMail(false);
        }
    }


    return (
        <section>
            <div className="register">
                <div className="col-1">
                    <h1>SIGN UP</h1>
                    <span>Register and Enjoy the Services</span>

                    <form id='form' className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
                        <label for="fullname">Full Name</label>
                        <input id="fullname" type="text" {...register("name",{ required: true,minLength: 4, maxLength: 50 })} placeholder='Your Name' required />
                        {errors.name && <p id="exists">Name should be min 4 characters and max 50 characters</p>}
                        <label for="email">Email</label>
                        <input id="email" type="email" {...register("email",{ required: true, pattern: /[a-zA-Z]+@stevens\.edu/i})} placeholder='username@stevens.edu' required />
                        {errors.email && <p id='exists'>Please enter Stevens mail id</p>}
                        <label for="password">Password</label>
                        <input id="password" type="password" {...register("password",{ required: true, minLength: 8,maxLength:16,pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/})} placeholder='password' required />
                        {errors.password && <p id='exists'>Password should contain one Capital Letter, one Small Letter, and the number of characters should be between 8 to 15</p>}
                        <label for="dob">Date Of Birth</label>
                        <input id="dob" type="date" {...register("dateOfBirth")} />
                        {/* {errors.date && <p id='exists'>Please enter Date from the past</p>} */}
                        <label for="gender">Gender</label>
                        <select id="gender"{...register("gender")} required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                            <option value="Pefer not to say">Prefer not to say</option>
                        </select>
                        {/* <input type="text" {...register("mobile")}  placeholder='' /> */}
                        <button className='btn'>Sign Up</button>
                    </form>
                    <Link to="/signin">Already a Member, Sign In</Link>
                    <br></br>
                    <br></br>
                    {validate && !alreadyExist ? (<span id="valid">Verification email sent.</span>) : (resend ? (<span id="valid">Verification email sent again.</span>) : (alreadyExist && !validate ? (<span id="exists">User already exists. Please Log In</span>) : ("")))}
                    <br></br>
                    <br></br>
                    {mail ? (
                        <button onClick={handleSubmit(onSubmit4)}>Resend Verification Mail</button>) : ("")}

                </div>
                <div className="col-2">
                    <img src={bgImg} alt="" />
                </div>
            </div>
        </section>
    )
}