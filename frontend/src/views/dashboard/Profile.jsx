import React, { useState,useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import Toast from "../../plugin/Toast";
import useUserData from "../../plugin/useUserData";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import moment from "moment";

function Profile() {
    const user_id = useUserData()?.user_id;

    const [profile,setProfile] = useState({
        image : "",
        full_name : "",
        about : "",
        bio : "",
        country : "",
    });

    const [imagePreview,setImagePreview] = useState([""]);


    const fetchProfile = async()=>{
        try {
            const profile_response = await apiInstance.get(`user/profile/${user_id}`);
            setProfile(profile_response?.data);
        } catch (error) {
            Toast("error", "error connecting to the server");
        }

    };

    useEffect(() => {
        fetchProfile();
    }, []);
    
    const imageChangeHandle = (event) =>{
        const imageFile = event.target.files[0];
        setProfile({
            ...profile,
            [event.target.name]: imageFile,
        });

        const display = new FileReader();
        display.onload = () => {
            setImagePreview(display.result);
        }
        if(imageFile){
            display.readAsDataURL(imageFile);
        }
    };

    const handleProfileChange = (event)=>{
        setProfile({
            ...profile,
            [event.target.name] :event.target.value,
        })
    }
    
    const handleFormSubmit = async(e) => {
        e.preventDefault();
        const profile_response = await apiInstance.get(`user/profile/${user_id}`);
        const data = new FormData();
        if (profile.image !== profile_response.data.image){
            data.append('image', profile.image);
        }
        data.append('full_name', profile.full_name);
        data.append('about', profile.about);
        data.append('bio', profile.bio);
        data.append('country', profile.country);

        try {
            const profile_change = await apiInstance.patch(`user/profile/${user_id}/`,data, {headers: {
                'Content-Type': 'multipart/form-data',
            }});
            Toast("success", "Profile updated");
        } catch (error) {
            Toast("error", "try again later")
        }
    };

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="mb-0">Profile Details</h3>
                                    <p className="mb-0">You have full control to manage your own account setting.</p>
                                </div>
                                <form className="card-body" onSubmit={(e)=> handleFormSubmit(e)}>
                                    <div className="d-lg-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center mb-4 mb-lg-0">
                                            <img src={imagePreview!=""? imagePreview :profile?.image } id="img-uploaded" className="avatar-xl rounded-circle" alt="avatar" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
                                            <div className="ms-3">
                                                <h4 className="mb-0">Your avatar</h4>
                                                <input type="file" className="form-control mt-3" name="image" onChange={imageChangeHandle} id="" />
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-5" />
                                    <div>
                                        <h4 className="mb-0 fw-bold">
                                            <i className="fas fa-user-gear me-2"></i>Personal Details
                                        </h4>
                                        <p className="mb-4 mt-2">Edit your personal information and address.</p>
                                        <div className="row gx-3">
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="fname">
                                                    Full Name
                                                </label>
                                                <input type="text" id="fname" onChange={handleProfileChange} name = "full_name" className="form-control" placeholder="What's your full name?" value = {profile?.full_name || ""} required="" />
                                                <div className="invalid-feedback">Please enter first name.</div>
                                            </div>
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="fname">
                                                    Bio
                                                </label>
                                                <input type="text" onChange={handleProfileChange} name = "bio" id="fname" className="form-control" placeholder="Write a catchy bio!" value = {profile?.bio || ""} required="" />
                                                <div className="invalid-feedback">Please enter first name.</div>
                                            </div>
                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="lname">
                                                    About Me
                                                </label>
                                                <textarea onChange={handleProfileChange} name = "about"  placeholder="Tell us about yourself..."  id="" cols="30" rows="5" value = {profile?.about || ""} className="form-control"></textarea>
                                                <div className="invalid-feedback">Please enter last name.</div>
                                            </div>

                                            <div className="mb-3 col-12 col-md-12">
                                                <label className="form-label" htmlFor="editCountry">
                                                    Country
                                                </label>
                                                <input value = {profile?.country || ""} onChange={handleProfileChange} name = "country" type="text" id="country" className="form-control" placeholder="What country are you from?" required="" />
                                                <div className="invalid-feedback">Please choose country.</div>
                                            </div>
                                            <div className="col-12 mt-4">
                                                <button className="btn btn-primary" type="submit">
                                                    Update Profile <i className="fas fa-check-circle"></i>
                                                </button>
                                            </div>
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

export default Profile;
