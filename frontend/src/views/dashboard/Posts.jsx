import React, { useState,useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import useUserData from "../../plugin/useUserData";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import moment from "moment";
function Posts() {
    const [original,setOriginal] = useState([]);
    const [posts, setPosts] = useState([]);
    // decoding access token and taking user id from it (if it exists)
    const user_id = useUserData()?.user_id;
    // fetching posts
    const fetchPost = async() =>{
        try{
            const posts_response = await apiInstance.get(`author/dashboard/post-list/${user_id}/`);
            setPosts(posts_response?.data);
            setOriginal(posts_response?.data);
        }

        catch(error){
            console.log(error);
        }
    }

    // handeling the searching of postsby title
    const handleSearch = (event) =>{
        const search = event.target.value.toLowerCase();
        if (search ===""){
            setPosts(original);
        }
        else{
            const filteredPosts =original.filter((post)=>{
                return post.title.toLowerCase().includes(search);
            });
            setPosts(filteredPosts);
        }
    }
    // handeling the filtering of post based on selected option
    const handleSortChange = (event) =>{
        const sort = event.target.value;
        let sorted = [...original];

        if (sort === "newest") {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sort === "oldest") {
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sort === "most_commented") {
            sorted.sort((a, b) => b.comments.length - a.comments.length);
        } else if (sort === "most_liked") {
            sorted.sort((a, b) => b.likes.length - a.likes.length);
        } else if (sort === "most_viewed") {
            sorted.sort((a, b) => b.view - a.view);
        } else if (sort === "status_active") {
            sorted = sorted.filter(post => post.status === "Active");
        } else if (sort === "status_draft") {
            sorted = sorted.filter(post => post.status === "Draft");
        } else if (sort === "status_disabled") {
            sorted = sorted.filter(post => post.status === "Disabled");
        } else {
            sorted = [...original];
        }
        
        setPosts(sorted);
    }

    useEffect(() => {
      fetchPost();
    }, [])
    
    return (
        <>
            <Header />
            <section className="py-4">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="card border bg-transparent rounded-3">
                                <div className="card-header bg-transparent border-bottom p-3">
                                    <div className="d-sm-flex justify-content-between align-items-center">
                                        <h5 className="mb-2 mb-sm-0">
                                            All Blog Posts <span className="badge bg-primary bg-opacity-10 text-primary">{posts.length}</span>
                                        </h5>
                                        <a href="#" className="btn btn-sm btn-primary mb-0">
                                            Add New <i className="fas fa-plus"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3 align-items-center justify-content-between mb-3">
                                        <div className="col-md-8">
                                            <form className="rounded position-relative">
                                                <input onChange={(event)=> handleSearch(event)} className="form-control pe-5 bg-transparent" type="search" placeholder="Search Articles" aria-label="Search" />
                                                <button className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit">
                                                    <i className="fas fa-search fs-6 " />
                                                </button>
                                            </form>
                                        </div>
                                        <div className="col-md-3">
                                            <form>
                                                <select onChange={(event) => handleSortChange(event)} className="form-select z-index-9 bg-transparent" aria-label=".form-select-sm">
                                                <option value="newest">Newest</option>
                                                <option value="oldest">Oldest</option>
                                                <option value="most_commented">Most Commented</option>
                                                <option value="most_liked">Most Liked</option>
                                                <option value="most_viewed">Most Viewed</option>
                                                <option value="status_active">Active</option>
                                                <option value="status_draft">Draft</option>
                                                <option value="status_disabled">Disabled</option>
                                                </select>
                                            </form>
                                        </div>
                                    </div>
                                    {/* Search and select END */}
                                    {/* Blog list table START */}
                                    <div className="table-responsive border-0">
                                        <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                                            {/* Table head */}
                                            <thead className="table-dark">
                                                <tr>
                                                    <th scope="col" className="border-0 rounded-start">
                                                        Article Name
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Views
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Published Date
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Category
                                                    </th>
                                                    <th scope="col" className="border-0">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="border-0 rounded-end">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="border-top-0">
                                                {posts?.slice(0,6)?.map((post, index) => (
                                                    <tr key = {index}>
                                                        <td>
                                                            <h6 className="mt-2 mt-md-0 mb-0 ">
                                                                <a href="#" className="text-dark text-decoration-none">
                                                                    {post?.title}
                                                                </a>
                                                            </h6>
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">
                                                                <a href="#" className="text-dark text-decoration-none">
                                                                    {post.view}
                                                                </a>
                                                            </h6>
                                                        </td>
                                                        <td>{Moment(post?.date)}</td>
                                                        <td>{post?.category?.title}</td>
                                                        <td>
                                                            <span className={`badge mb-2 ${
                                                                post?.status === "Active" ? "bg-success bg-opacity-10 text-success" : 
                                                                post?.status === "Draft" ? "bg-warning bg-opacity-10 text-warning" : 
                                                                post?.status === "Disabled" ? "bg-danger bg-opacity-10 text-danger" : ""
                                                                }`}>{post?.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-2">
                                                                <a href="#" className="btn-round mb-0 btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
                                                                    <i className="bi bi-trash" />
                                                                </a>
                                                                <a href="dashboard-post-edit.html" className="btn btn-primary btn-round mb-0" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                                                                    <i className="bi bi-pencil-square" />
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Posts;
