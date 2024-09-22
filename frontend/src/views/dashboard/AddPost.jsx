import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";

function AddPost() {
    const user_id = useUserData()?.user_id;

    const [post , setPost] = useState({
        image: "",
        title : "",
        description : "",
        category : parseInt(""),
        tags : "",
        status : "",

    });

    const [imagePreview, setImagePreview] = useState("");
    const [categories, setCategory] = useState([]);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); 

    const fetchCategories = async() =>{
        try {
            const category_response = await apiInstance.get("post/category/list/");
            setCategory(category_response.data);
            
        } catch (error) {
            Toast("error","something went wrong")
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);


    const postChange = (event) =>{
        setPost({
            ...post,
            [event.target.name]: event.target.value,
        })
        console.log(post);

    };
    
    const handleImageChange = (event) =>{
        const image = event.target.files[0];
        const reader = new FileReader();

        setPost({
            ...post,
            image : {
                file: image,
                perview: reader.result,
            },
        });

        reader.onloadend = ()=>{
            setImagePreview(reader.result)
        }

        if (image){
            reader.readAsDataURL(image);
        }


    };

    const createPost = async(e) =>{
        e.preventDefault();
        setLoading(true);
        
        if (!post.title || !post.description || !post.image ){
            Toast("error","Please fill all the fields")
            setLoading(false);
            return
        }

        const formdata = new FormData();
        formdata.append('user_id', user_id);
        formdata.append('title', post.title);
        formdata.append('image', post.image.file);
        formdata.append('description', post.description);
        formdata.append('tags', post.tags);
        formdata.append('category_id', post.category);
        formdata.append('post_status', post.status);

        try {
            const createPostRequest = await apiInstance.post("author/dashboard/create-post/",formdata,{headers : {'Content-Type' : 'multipart/form-data',}});
            setLoading(true);
            console.log(createPostRequest.data)
            Toast("success","Post created");
            navigate ("/posts/");
        } catch (error) {
            Toast("error", "error saving your post")
            setLoading(false);
        }

    };

    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <>
                            <form onSubmit={createPost}>

                                <section className="pb-8 mt-5">
                                    <div className="card mb-3">
                                        {/* Basic Info Section */}
                                        <div className="card-header border-bottom px-4 py-3">
                                            <h4 className="mb-0">Post Information</h4>
                                        </div>
                                        <div className="card-body">
                                            <label htmlFor="postTHumbnail" className="form-label">
                                                Preview
                                            </label>
                                            <img style={{ width: "100%", height: "330px", objectFit: "cover", borderRadius: "10px" }} className="mb-4" src={imagePreview || "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"} alt="" />
                                            <div className="mb-3">
                                                <label htmlFor="postTHumbnail" className="form-label">
                                                    Thumbnail
                                                </label>
                                                <input id="postTHumbnail" name="image" onChange = {handleImageChange} className="form-control" type="file" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Title</label>
                                                <input className="form-control" type="text" placeholder="" onChange={postChange} name = "title"/>
                                                <small>Write a 60 character post title.</small>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">category</label>
                                                <select className="form-select" onChange={postChange} name = "category">
                                                    {categories?.map((category,index)=>(
                                                        <option value={category?.id} key={index}>{category?.title}</option>
                                                    
                                                    ))}
                                                    
                                                </select>
                                                <small>Help people find your posts by choosing categories that represent your post.</small>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Post Description</label>
                                                <textarea className="form-control" id="" cols="30" rows="10" onChange={postChange} name = "description"></textarea>
                                                <small>A brief summary of your posts.</small>
                                            </div>
                                            <label className="form-label">Tag</label>
                                            <input className="form-control" type="text" placeholder="technology, software, coding" onChange={postChange} name = "tags"/>

                                            <div>
                                                <label htmlFor="" className="form-label">
                                                    Status
                                                </label>
                                                <select className="form-select" onChange={postChange} name = "status">
                                                        <option value="Active">Active</option>
                                                        <option value="Disabled">Disabled</option>
                                                        <option value="Draft">Draft</option>

                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {loading? (
                                        <button disabled className="btn btn-lg btn-success w-100 mt-2" type="submit">
                                            saving post <i className="fas fa-spinner fa-spin"></i>
                                        </button>
                                    ) : (
                                        <button className="btn btn-lg btn-success w-100 mt-2" type="submit">
                                            Create Post <i className="bi bi-plus-circle-fill"></i>
                                        </button>
                                    )}

                                </section>
                            </form>
                            </>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AddPost;
