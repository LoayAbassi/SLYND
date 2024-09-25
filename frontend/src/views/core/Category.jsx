import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useParams } from "react-router-dom";
import Toast from "../../plugin/Toast";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import useUserData from "../../plugin/useUserData";

function Category() {
    const [relatedPost, setRelatedPost] = useState([]);
    const category_slug = useParams().slug;

    const fetchCategoryposts = async() =>{
        try {
            const responseC = await apiInstance.get(`post/category/posts/${category_slug}`);
            setRelatedPost(responseC?.data);
            console.log(responseC?.data);
        } catch (error) {
            Toast.error(error.message);
            
        }

    }

    useEffect(() => {
        fetchCategoryposts();
        
    }, [])
    
    return (
        <div>
            <Header />
            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <a href="#" className="d-block card-img-flash">
                                <img src="assets/images/adv-3.png" alt="" />
                            </a>
                            <h2 className="text-start d-block mt-1">
                                <i className="bi bi-grid-fill"></i> {category_slug} ({relatedPost.length})
                            </h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0 mt-4">
                <div className="container">
                    <div className="row">
                        {relatedPost?.length >0 ? (
                            <>
                            
                            
                        {relatedPost?.map((post,idx)=>(
                            <div className="col-sm-6 col-lg-3" key = {idx}>
                                <div className="card mb-4">
                                    <div className="card-fold position-relative">
                                        <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src={post?.image} alt="Card image" />
                                    </div>
                                    <div className="card-body px-3 pt-3">
                                        <h4 className="card-title">
                                        <Link to={`/${post.slug}`} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            {post.title.slice(0,40)}
                                        </Link>
                                        </h4>
                                        <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                            <li>
                                                <a href="#" className="text-dark text-decoration-none">
                                                    <i className="fas fa-user"></i> {post?.profile?.full_name}
                                                </a>
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-calendar"></i> {Moment(post?.date)}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-eye"></i> {post?.view}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}</>
                        ):(

                            <h1>
                                No posts for this Category yet
                                <h3>you can be the first one to share something in it </h3>
                            </h1>
                        )}

                        

                    </div>


                </div>
            </section>


        </div>
    );
}

export default Category;
