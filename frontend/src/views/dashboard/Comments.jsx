import React,{useState,useEffect} from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import moment from "moment";

function Comments() {
    const [comments , setComments] = useState([]);
    const user_id = useUserData()?.user_id;

    const [reply,setReply] = useState("");

    const fetchComments = async()=>{
        try{
            const comment_response =await apiInstance.get(`/author/dashboard/comment-list/${user_id}/`);
            setComments(comment_response.data)
            console.log(comments)
        }
        catch(error){
            console.log(error)
            Toast("error", "failed displaying comments")
        }

    };



    
    useEffect(() => {
      fetchComments();
    }, [])
    
    const handleReplySubmittint = async(event,commentId) =>{
        event.preventDefault();
        try{
            const response = await apiInstance.post(`/author/dashboard/reply-comment/`,{
                comment_id : commentId,
                reply: reply,
            });
            console.log(response.data);
            fetchComments();
            Toast("success","Reply saved");
            setReply("");

        }
        catch(error){
            Toast("error","couldn't reply to comment");
        }
    };
    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            {/* Card */}
                            <div className="card mb-4">
                                {/* Card header */}
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Comments</h3>
                                        <span>You have full control to manage your own comments.</span>
                                    </div>
                                </div>
                                {/* Card body */}
                                {comments?.map((comment,index) =>(
                                    <div className="card-body" key ={index}>
                                        {/* List group */}
                                        <ul className="list-group list-group-flush">
                                            {/* List group item */}
                                            <li className="list-group-item p-4 shadow rounded-3">
                                                <div className="d-flex">
                                                    <img src="../default.png" alt="avatar" className="rounded-circle avatar-lg" style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }} />
                                                    <div className="ms-3 mt-2">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div>
                                                                <h4 className="mb-0">{comment?.name} : {comment?.post?.title}</h4>
                                                                <span>{moment(comment.date).fromNow()}</span>
                                                            </div>
                                                            <div>
                                                                <a href="#" data-bs-toggle="tooltip" data-placement="top" title="Report Abuse">
                                                                    <i className="fe fe-flag" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="mt-2">
                                                                <span className="fw-bold me-2">
                                                                    Comment <i className="fas fa-arrow-right"></i>
                                                                </span>
                                                                {comment.comment}
                                                            </p>
                                                            <p className="mt-2">
                                                                {comment.reply?(
                                                                    <>
                                                                    <span className="fw-bold me-2">
                                                                        Response <i className="fas fa-arrow-right"></i>
                                                                    </span>
                                                                    {comment.reply}
                                                                    </>
                                                                ):(
                                                                    ""
                                                                )}
                                                                
                                                            </p>
                                                            <p>
                                                                <button class="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseExample${comment.id.toString()}`} aria-expanded="false" aria-controls={`collapseExample${comment.id.toString()}`}>
                                                                    {comment.reply ? "Update Response" : "Send Response"}
                                                                    

                                                                </button>
                                                            </p>
                                                            <div class="collapse" id = {`collapseExample${comment.id.toString()}`}>
                                                                <div class="card card-body">
                                                                    <form onSubmit={(event)=> handleReplySubmittint(event,comment.id)}>
                                                                        <div class="mb-3">
                                                                            <label for="exampleInputEmail1" class="form-label">
                                                                                Write Response
                                                                            </label>
                                                                            <textarea onChange={(event) => setReply(event.target.value)} value = {reply} name="" id="" cols="30" className="form-control" rows="4"></textarea>
                                                                        </div>

                                                                        <button type="submit"  class="btn btn-primary">
                                                                            Send Response <i className="fas fa-paper-plane"> </i>
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                ))}

                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Comments;
