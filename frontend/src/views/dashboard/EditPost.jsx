import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";

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

    const fetchPost = async() =>{
        try {
            const post_response = await apiInstance.get(`author/dashboard/post_detail/${user_id}/${param?.id}/`);
            setPost(post_response.data);

        } catch (error) {
            Toast("error", "Internal Server Error");
        }
    };

    const [imagePreview, setImagePreview] = useState("");
    const [categories, setCategory] = useState([]);

    const [loading, setLoading] = useState(false);
    const param  = useParams();
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
        fetchPost();
        fetchCategories();
    }, []);


    

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

    const updatePost = async(e) =>{
        e.preventDefault();
        setLoading(true);
        
        if (!post.title || !post.description || !post.image  ){
            Toast("error","Please fill all the fields")
            setLoading(false);
            return
        }
        setPost()
        const formdata = new FormData();
        formdata.append('user_id', user_id);
        formdata.append('title', post.title);
        formdata.append('image', post.image.file);
        formdata.append('description', post.description);
        formdata.append('tags', post.tags);
        if(post?.category?.id){
            formdata.append('category_id', post?.category?.id);
        }
        else{
            formdata.append('category_id', post?.category);
        }
        formdata.append('post_status', post.status);

        try {
            console.log(post)
            const createPostRequest = await apiInstance.patch(`author/dashboard/post_detail/${user_id}/${param?.id}/`,formdata,{headers : {'Content-Type' : 'multipart/form-data',}});
            setLoading(true);
            Toast("success","Post updated");
            navigate ("/posts/");
        } catch (error) {
            Toast("error", "error updating your post")
            setLoading(false);
        }

    };
    const postChange = (event) =>{
        setPost({
            ...post,
            [event.target.name]: event.target.value,
        });
        console.log(post?.category);

    };
    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <>                            
                            <form onSubmit={updatePost}>

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
                                            <img style={{ width: "100%", height: "330px", objectFit: "cover", borderRadius: "10px" }} className="mb-4" src={imagePreview || post?.image} alt="" />
                                            <div className="mb-3">
                                                <label htmlFor="postTHumbnail" className="form-label">
                                                    Thumbnail
                                                </label>
                                                <input id="postTHumbnail" name="image" onChange = {handleImageChange} className="form-control" type="file" />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Title</label>
                                                <input value = {post?.title} className="form-control" type="text" placeholder="" onChange={postChange} name = "title"/>
                                                <small>Write a 60 character post title.</small>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">category</label>
                                                <select className="form-select" onChange={postChange} name = "category" value={post?.category?.id} >
                                                    {categories?.map((category,index)=>(
                                                        <option value={category?.id} key={index}>{category?.title}</option>
                                                    
                                                    ))}
                                                    
                                                </select>
                                                <small>Help people find your posts by choosing categories that represent your post.</small>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Post Description</label>
                                                <textarea className="form-control" value={post?.description} id="" cols="30" rows="10" onChange={postChange} name = "description"></textarea>
                                                <small>A brief summary of your posts.</small>
                                            </div>
                                            <label className="form-label">Tag</label>
                                            <input className="form-control" value ={post?.tags} type="text" placeholder="technology, software, coding" onChange={postChange} name = "tags"/>

                                            <div>
                                                <label htmlFor="" className="form-label">
                                                    Status
                                                </label>
                                                <select className="form-select" onChange={postChange} value={post?.status} name = "status">
                                                        <option value="Active">Active</option>
                                                        <option value="Disabled">Disabled</option>
                                                        <option value="Draft">Draft</option>

                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {loading? (
                                        <button disabled className="btn btn-lg btn-success w-100 mt-2" type="submit">
                                            saving changes <i className="fas fa-spinner fa-spin"></i>
                                        </button>
                                    ) : (
                                        <button className="btn btn-lg btn-success w-100 mt-2" type="submit">
                                            Save changes <i className="bi bi-plus-circle-fill"></i>
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
