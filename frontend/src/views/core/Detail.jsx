import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useParams } from "react-router-dom";
import Toast from "../../plugin/Toast";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";

function Detail() {
    // fetching selected post details and displayong it to the screen 

    const [post, setPost] = useState([]);
    const [tags, settags] = useState([]);
    const [relatedPost, setRelatedPost] = useState([]);
    const parm = useParams();

    const [createComment, setCreatComment] = useState({full_name : "", email : "",comment:""});

    // making sure the related poss doesn't fetch unless the post is received
    useEffect(() => {
        const fetchPostAndRelatedPosts = async () => {
            // First, fetch the post
            const response = await apiInstance.get(`post/detail/${parm.slug}`);
            setPost(response?.data);
            
            // If the post contains tags, set them
            const tagArr = response?.data?.tags.split(",");
            settags(tagArr);
            
            // Now, fetch related posts based on the category slug
            const category_slug = response?.data?.category?.slug;
            if (category_slug) {
                const responseC = await apiInstance.get(`post/category/posts/${category_slug}`);
                setRelatedPost(responseC?.data);
            }
        };
    
        fetchPostAndRelatedPosts();
    }, [parm.slug]); // Dependency array on the post slug to re-fetch if it changes
    // saves the state of the comment for everytime the user types a letter
    const handleCommentChange = (event)=>{
        setCreatComment({
            ...createComment,
            [event.target.name]:event.target.value,
        });
    };
    // makes sure the form doesn't reload the page
    // and adding the comment with realtime to the page without reloading 
    // with a toast notification in ase of sucess or error
    const handleCreateCommentSubmit = async(event)=>{
        event.preventDefault();

        const data = {
            post_id : post?.id,
            name: createComment.full_name,
            email: createComment.email,
            comment: createComment.comment,
        }
        try {
            const response = await apiInstance.post("post/comment-post/", data);
            Toast("success", "Comment posted successfully");
    
            // Fetch the post and related posts again after successful comment posting
            
            const update = await apiInstance.get(`post/detail/${parm.slug}`);
            setPost(update?.data);
        } catch (error) {
            Toast("error", "Failed to post comment");
        }

        setCreatComment(
            {
                name : "",
                email: "",
                comment:"",
            }
        );


    };
    return (
        <>
            <Header />
            <section className=" mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="text-center">{post.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-0">
                <div className="container position-relative" data-sticky-container="">
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="text-start text-lg-center mb-5" data-sticky="" data-margin-top={80} data-sticky-for={991}>
                                <div className="position-relative">
                                    <div className="avatar avatar-xl">
                                        <img className="avatar-img" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} src={post?.profile?.image} alt="avatar" />
                                    </div>
                                    <a href="#" className="h5 fw-bold text-dark text-decoration-none mt-2 mb-0 d-block">
                                        {post?.profile?.full_name}
                                    </a>
                                    <p>{post?.profile?.bio || ""}</p>
                                </div>

                                <hr className="d-none d-lg-block " />

                                <ul className="list-inline list-unstyled">
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-calendar"></i> {Moment(post?.date)}
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <a href="#" className="text-body">
                                            <i className="fas fa-heart me-1" />
                                        </a>
                                        {post?.likes?.length} {post?.likes?.length === 1 ? "Like":"Likes"}
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-eye" />
                                        {post?.view} {post?.view === 1 ? "View" : "Views"}
                                    </li>
                                </ul>
                                {/* Tags */}
                                <ul className="list-inline text-primary-hover mt-0 mt-lg-3 text-start">
                                    {tags?.map((tag, index)=>(
                                        <li className="list-inline-item" key = {index}>
                                                #{tag}
                                        </li>
                                    ))}

                                </ul>
                            </div>
                        </div>
                        {/* Left sidebar END */}
                        {/* Main Content START */}
                        <div className="col-lg-10 mb-5">
                            <p style={{ fontSize: "30px", padding:"10px" }}>
                                {post?.description}
                            </p>
                            <div className="mt-5">
                                <h2 className="my-3">
                                    <i className="bi bi-symmetry-vertical me-2" />
                                    Related Posts
                                </h2>
                                <section className="pt-4 pb-0">
                                    <div className="container">
                                        <div className="row">
                                            {relatedPost && relatedPost.length > 1 ? (
                                                relatedPost
                                                    .filter((related) => related.slug !== post.slug)
                                                    .map((post) => (
                                                        <div className="col-sm-6 col-lg-3" key={post.title}>
                                                            <div className="card mb-4">
                                                                <div className="card-fold position-relative">
                                                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src={post?.image} alt="Card image" />
                                                                </div>
                                                                <div className="card-body px-3 pt-3">
                                                                    <h4 className="card-title">
                                                                        <a href={`${post?.slug}`} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                                                            {post?.title}
                                                                        </a>
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <p>No more posts in this category</p>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <hr />
                            <div>
                                <h3>{post?.comments?.length} {post?.comments?.length===1 ? "Comment":"Comments"} </h3>
                                
                                {post?.comments?.length > 0 ? (
                                    post?.comments?.slice(0,3).map((c, index) => (
                                        <div className="my-4 d-flex bg-light p-3 mb-3 rounded" key={c.id}>
                                            {/* <img
                                                className="avatar avatar-md rounded-circle float-start me-3"
                                                src="https://img.freepik.com/free-photo/front-portrait-woman-with-beauty-face_186202-6146.jpg?size=626&ext=jpg&ga=GA1.1.735520172.1710979200&semt=ais"
                                                style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%" }}
                                                alt="avatar"
                                            />*/}
                                            
                                            <div>
                                                <div className="mb-2">
                                                    <h5 className="m-0">{c.name}</h5>
                                                    <span className="me-3 small">{new Date(c.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="fw-bold">{c.comment}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No comments yet.</p>
                                )}


                            </div>
                            {/* Comments END */}
                            {/* Reply START */}
                            <div className="bg-light p-3 rounded">
                                <h3 className="fw-bold">Leave a reply</h3>
                                <small>Your email address will not be published. Required fields are marked *</small>
                                <form onSubmit={handleCreateCommentSubmit} className="row g-3 mt-2">
                                    <div className="col-md-6">
                                        <label className="form-label">Name *</label>
                                        <input onChange={handleCommentChange} name = "full_name" value = {createComment.full_name} type="text" className="form-control" aria-label="First name" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email *</label>
                                        <input onChange={handleCommentChange} type="email" name = "email" className="form-control" value = {createComment.email} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Write Comment *</label>
                                        <textarea onChange={handleCommentChange} name = "comment" className="form-control" rows={4} value = {createComment.comment}/>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary" >
                                            Post comment <i className="fas fa-paper-plane"></i>
                                        </button>
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

export default Detail;
