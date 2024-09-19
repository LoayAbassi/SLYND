import React, { useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";
import {useAuthStore} from "../../store/auth";
import {register} from "../../utils/auth";

function Register() {
    // default data 
    const [regData,setRegData] = useState({
        full_name : "",
        email : "",
        password : "",
        confirm_password : "",
    });

    // making user wait while he log in 
    const [loading, setloading] = useState(false);

    const navigate = useNavigate();

    const handleRegChange = (event)=>{
        setRegData({
            ...regData,
            [event.target.name]:event.target.value
        });

    }

    const resetForm = ()=>{
        setRegData({
            full_name : "",
            email : "",
            password : "",
            confirm_password : "",
        });
    }

    const handleReg = async(e) =>{
        e.preventDefault();
        setloading(true);

        const {error} = register(
            regData.full_name,
            regData.email,
            regData.password,
            regData.confirm_password
        );

        if (error){
            alert(JSON.stringify(error));
            resetForm();
        }
        else{
            navigate("/")
        }
        setloading(false);
    };

    return (
        <>
            <Header />
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <h1 className="mb-1 fw-bold">Sign up</h1>
                                    <span>
                                        Already have an account?
                                        <Link to="/login/" className="ms-1">
                                            Sign In
                                        </Link>
                                    </span>
                                </div>
                                {/* Form */}
                                <form className="needs-validation" noValidate="" onSubmit={handleReg}>
                                    {/* Username */}
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Full Name
                                        </label>
                                        <input type="text" id="full_name" className="form-control" onChange={handleRegChange} value={regData.full_name} name="full_name" placeholder="John Doe" required="" />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email Address
                                        </label>
                                        <input type="email" id="email" className="form-control" onChange={handleRegChange} value={regData.email} name="email" placeholder="example@domain.com" required="" />
                                    </div>

                                    {/* Password */}
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Password
                                        </label>
                                        <input type="password" id="password" className="form-control" onChange={handleRegChange} value={regData.password} name="password" placeholder="**************" required="" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">
                                            Confirm Password
                                        </label>
                                        <input type="password" id="confirm_password" className="form-control" onChange={handleRegChange} value={regData.confirm_password} name="confirm_password" placeholder="**************" required="" />
                                    </div>
                                    <div>
                                        <div className="d-grid">
                                            {loading === true ? 
                                            (
                                                <button disabled type="submit" className="btn btn-primary">
                                                Processing request<i className="fas fa-spinner fa-spin"></i>
                                                </button>)
                                            :(
                                            <button type="submit" className="btn btn-primary">
                                                Sign Up <i className="fas fa-user-plus"></i>
                                            </button>)}
                                            
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Register;
