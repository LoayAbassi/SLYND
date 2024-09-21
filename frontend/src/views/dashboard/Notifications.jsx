import React, { useState,useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import useUserData from "../../plugin/useUserData";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import moment from "moment";
import Toast from "../../plugin/Toast";

function Notifications() {
    const user_id = useUserData()?.user_id;
    const [notifications,setNotification] = useState([]);
    
    const fetchNotifications = async() =>{
        try{
            const notification_response = await apiInstance.get(`author/dashboard/notification-list/${user_id}`);
            setNotification(notification_response?.data);
        }
        catch(error){
            Toast("error","internal server error")
        }

    };
    useEffect(() => {
        fetchNotifications();
    }, [])
    const markAsSeen = async(id)=>{
        const data = {
            notification_id:id,
        }
        try {
            const response = await apiInstance.post("/author/dashboard/notification-mark-seen/",data);
            fetchNotifications();
            Toast("success","notification marked as seen");
        } catch (error) {
            Toast("error", "error connecting to server");
        }
    };

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <div className="card mb-4">
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Notifications</h3>
                                        <span>Manage all your notifications from here</span>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-flush">
                                        {notifications?.map((notification,index)=>(
                                            <li className="list-group-item p-4 shadow rounded-3 mt-4" key = {index}>
                                                <div className="d-flex">
                                                    <div className="ms-3 mt-2">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                            <h4 className="mb-0 fw-bold"> 
                                                                <i 
                                                                    className={`bi ${
                                                                        notification?.type === 'Like' 
                                                                            ? 'bi-hand-thumbs-up-fill text-primary' 
                                                                            : notification?.type === 'Comment' 
                                                                            ? 'bi-chat-left-text-fill text-success' 
                                                                            : notification?.type === 'Bookmark' 
                                                                            ? 'bi-bookmark-fill text-warning' 
                                                                            : ''
                                                                    }`}
                                                                ></i> 
                                                                &nbsp;&nbsp;New {notification?.type}
                                                            </h4>
                                                                <p className="mt-3">
                                                                    you recieved a new {notification?.type.toLowerCase()} on <b>{notification?.post?.title}</b>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="mt-1">
                                                                <span className="me-2 fw-bold">
                                                                    Date: <span className="fw-light">{moment(notification?.date).fromNow()}</span>
                                                                </span>
                                                            </p>
                                                            <p>
                                                                <button class="btn btn-outline-secondary" type="button" onClick={()=>markAsSeen(notification?.id)}>
                                                                    Mark as Seen <i className="fas fa-check"></i>
                                                                </button>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Notifications;
