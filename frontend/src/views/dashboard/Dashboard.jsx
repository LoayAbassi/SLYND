import React, { useState,useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import useUserData from "../../plugin/useUserData";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import moment from "moment";



function Dashboard() {
    // initial states
    const [stats,setStats] = useState([]);
    const [posts,setPosts] = useState([]);
    const [comments,setComment] = useState([]);
    const [notifications,setNotification] = useState([]);
    // getting user id
    const user_id = useUserData()?.user_id;

    // fetching stats, posts,comments,notifications
    const fetchDashboardData = async() =>{
        const stats_response = await apiInstance.get(`author/dashboard/stats/${user_id}/`);
        
        setStats(stats_response?.data[0]);
        
        const posts_response = await apiInstance.get(`author/dashboard/post-list/${user_id}/`);
        setPosts(posts_response?.data);
        
        const comments_response = await apiInstance.get(`author/dashboard/comment-list/${user_id}/`);
        setComment(comments_response?.data);

        const notification_response = await apiInstance.get(`author/dashboard/notification-list/${user_id}`);
        setNotification(notification_response?.data);
    }

    // rendering components 
    useEffect(() => {
        fetchDashboardData();
    }, [])
    

    return (
        <>
            <Header />
            <section className="py-4">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="row g-4">
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-success bg-opacity-10 rounded-3 text-success">
                                                <i className="bi bi-people-fill" />
                                            </div>
                                            <div className="ms-3">
                                                <h3>{stats?.views}</h3>
                                                <h6 className="mb-0">Total Views</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-primary bg-opacity-10 rounded-3 text-primary">
                                                <i className="bi bi-file-earmark-text-fill" />
                                            </div>
                                            <div className="ms-3">
                                                <h3>{stats?.posts}</h3>
                                                <h6 className="mb-0">Posts</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-danger bg-opacity-10 rounded-3 text-danger">
                                                <i className="bi bi-suit-heart-fill" />
                                            </div>
                                            <div className="ms-3">
                                                <h3>{stats?.likes}</h3>
                                                <h6 className="mb-0">Likes</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-lg-3">
                                    <div className="card card-body border p-3">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-xl fs-1 p-3 bg-info bg-opacity-10 rounded-3 text-info">
                                                <i className="bi bi-tag" />
                                            </div>
                                            <div className="ms-3">
                                                <h3>{stats?.bookmarks}</h3>
                                                <h6 className="mb-0">Bookmarks</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header border-bottom d-flex justify-content-between align-items-center  p-3">
                                    <h5 className="card-header-title mb-0">Latest Posts</h5>
                                    <div className="dropdown text-end">
                                        <a href="#" className="btn border-0 p-0 mb-0" role="button" id="dropdownShare3" data-bs-toggle="dropdown" aria-expanded="false">
                                        {posts?.length} <i className="bi bi-grid-fill text-danger fa-fw" />
                                        </a>
                                    </div>
                                </div>
                                <div className="card-body p-3">
                                    <div className="row">
                                        {posts?.slice(0,3)?.map((post,index)=>(

                                            <div key = {index}>
                                                <div className="col-12">
                                                    <div className="d-flex position-relative">
                                                        <img className="w-60 rounded" src={post?.image} style={{ width: "100px", height: "110px", objectFit: "cover", borderRadius: "10px" }} alt="product" />
                                                        <div className="ms-3">
                                                            <a href="#" className="h6 stretched-link text-decoration-none text-dark">
                                                                {post?.title}
                                                            </a>
                                                            <p className="small mb-0 mt-3">
                                                                <i className="fas fa-calendar me-2"></i>{Moment(post?.date)}
                                                            </p>
                                                            <p className="small mb-0">
                                                                <i className="fas fa-eye me-2"></i>{post?.view}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr className="my-3" />
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <div className="card-footer border-top text-center p-3">
                                    <Link to="/posts/" className="fw-bold text-decoration-none text-dark">
                                        View all Posts
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header border-bottom d-flex justify-content-between align-items-center  p-3">
                                    <h5 className="card-header-title mb-0">Recent Comments</h5>
                                    <div className="dropdown text-end">
                                        <b className="btn border-0 p-0 mb-0" role="button" id="dropdownShare3" data-bs-toggle="dropdown" aria-expanded="false">
                                            {comments?.length} <i className="bi bi-chat-left-quote-fill text-success fa-fw" />
                                        </b>
                                    </div>
                                </div>
                               
                                    <div className="card-body p-3">
                                        <div className="row">
                                            {comments?.slice(0,3)?.map((comment,index)=>(

                                                <div key = {index}>

                                                
                                                    <div className="col-12">
                                                        <div className="d-flex align-items-center position-relative">
                                                            <div className="avatar avatar-lg flex-shrink-0">
                                                                <img className="avatar-img" src="../default.png" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} alt="avatar" />
                                                            </div>
                                                            <div className="ms-3">
                                                                <p className="mb-1">
                                                                    {" "}
                                                                    <a className="h6 stretched-link text-decoration-none text-dark" href="#">
                                                                        {" "}
                                                                        {comment.comment}{" "}
                                                                    </a>
                                                                </p>
                                                                <div className="d-flex justify-content-between">
                                                                    <p className="small mb-0">
                                                                        <i>by</i> {comment.name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <hr className="my-3" />
                                                </div>
                                            ))}
                                        
                                        </div>
                                    </div>


                                <div className="card-footer border-top text-center p-3">
                                    <Link to="/comments/" className="fw-bold text-decoration-none text-dark">
                                        View all Comments
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-xxl-4">
                            <div className="card border h-100">
                                <div className="card-header border-bottom d-flex justify-content-between align-items-center  p-3">
                                    <h5 className="card-header-title mb-0">Notifications  </h5>
                                    <div className="dropdown text-end">
                                        <b className="btn border-0 p-0 mb-0" role="button" id="dropdownShare3" data-bs-toggle="dropdown" aria-expanded="false">
                                            {notifications?.length} <i className="fas fa-bell text-warning fa-fw" />
                                        </b>
                                        
                                    </div>
                                </div>
                                <div className="card-body p-3">
                                    <div className="custom-scrollbar h-350">
                                        <div className="row">
                                            {notifications?.slice(0,4)?.map((notification,index)=>(
                                                <div key = {index}>
                                                    <div className="col-12">
                                                        <div className="d-flex justify-content-between position-relative">
                                                            <div className="d-sm-flex">
                                                                <div className="icon-lg bg-opacity-15 rounded-2 flex-shrink-0">
                                                                {
                                                                    notification.type === 'Like' ? (
                                                                        <i className="fas fa-thumbs-up text-primary fs-5" />
                                                                    ) : notification.type === 'Comment' ? (
                                                                        <i className="fas fa-comment text-secondary fs-5" />
                                                                    ) :(
                                                                        <i className="fas fa-bookmark text-info fs-5" />
                                                                    )
                                                                }
                                                                </div>
                                                                <div className="ms-0 ms-sm-3 mt-2 mt-sm-0">
                                                                    <h6 className="mb-0">
                                                                        <a href="#" className="stretched-link text-decoration-none text-dark fw-bold">
                                                                            New {notification?.type}
                                                                        </a>
                                                                    </h6>
                                                                    <p className="mb-0">
                                                                         <b>{notification?.post?.title}</b>
                                                                    </p>
                                                                    <span className="small">{moment(notification.date).fromNow()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr className="my-3" />
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer border-top text-center p-3">
                                    <Link to ="/notifications/" className="fw-bold text-decoration-none text-dark">
                                        View all Notifications
                                    </Link>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section>
        </>
    );
}

export default Dashboard;
