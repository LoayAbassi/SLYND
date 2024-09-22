import React,{useEffect, useState} from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";
import Moment from "../../plugin/Moment"
import "./index.css"
function Index() {
    // fetching posts and categories
    const [posts,setPost] = useState([]);
    const [categories,setCategory] = useState([]);
 
    const fetchPostCategory = async()=>{
        try{
            const post_res = await apiInstance.get('post/lists/');
            const  category_res = await apiInstance.get('post/category/list/');
            setPost(post_res.data)
            setCategory(category_res.data)
        }
        catch(error){
            console.log(error);
        }
        
    };
    // making sure the page renders only once
    useEffect(()=>{
        
        fetchPostCategory();
    },[]);
    // post pagination set
    const items = 4;
    const [currentPage,setCurrentPage] = useState(1);
    const [currentPageD,setCurrentPageD] = useState(1);

    // by view post pagination
    const lastItemIndex = currentPage * items;
    const firstItemIndex = lastItemIndex- items;
    const byViewPosts = posts?.sort((a, b) => b.view - a.view);
                        //posts?.sort((a, b) => new Date(b.date) - new Date(a.date))
    const postItems = byViewPosts?.slice(firstItemIndex,lastItemIndex);
    const totalPages = Math.ceil(posts?.length / items) ;
    const page_number = Array.from({length:totalPages},(_,index)=>index+1); 
    
    // by date post pagination
    const lastItemIndexD = currentPageD * items;
    const firstItemIndexD = lastItemIndexD- items;
    const byDatePosts = posts?.sort((a, b)=> new Date(b.date) - new Date(a.date));
    const postItemsDate = byDatePosts?.slice(firstItemIndexD,lastItemIndexD);
    const page_numberD = Array.from({length:totalPages},(_,index)=>index+1); 

    

    
    //categories pagination
    const itemsC = 4;
    const [currentCategory,setCurrentCategory] = useState(1);
    const lastCategoryIndex = currentCategory * itemsC;
    const firstCategoryIndex = lastCategoryIndex- itemsC;
    const categoryItems = categories?.slice(firstCategoryIndex,lastCategoryIndex);
    const totalCategories = Math.ceil(categories?.length / itemsC) ;
    const page_numberC = Array.from({length:totalCategories},(_,index)=>index+1); 

    return (
        <div>
            <Header />
            {/* most viewed posts title*/}

            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <a href="#" className="d-block card-img-flash">
                                <img src="assets/images/adv-3.png" alt="" />
                            </a>
                            <h2 className="text-start d-block mt-1">Most Viewed Posts</h2>
                        </div>
                    </div>
                </div>
            </section>
            {/* most viewed posts row*/}

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        {postItems.map((post)=>(
                            <div className="col-sm-6 col-lg-3" key = {post?.id} >
                            <div className="card mb-4">
                                <div className="card-fold position-relative">
                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src={post.image} alt={post.title} />
                                </div>
                                <div className="card-body px-3 pt-3">
                                    <h4 className="card-title">
                                        <Link to={post.slug} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            {post.title.slice(0,40)}
                                        </Link>
                                    </h4>
                                    <button style={{ border: "none", background: "none" }}>
                                        <i className="fas fa-bookmark text-danger"></i>
                                    </button>
                                    <button style={{ border: "none", background: "none" }}>
                                        <i className="fas fa-thumbs-up text-primary"></i>
                                    </button>

                                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                        <li>
                                            <a href="#" className="text-dark text-decoration-none">
                                                <i className="fas fa-user"></i> {post.user.full_name}
                                            </a>
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-calendar"></i> {Moment(post.date)}
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-eye"></i> {post.view}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <nav className="d-flex mt-2">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage ===1 ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold me-1 rounded" onClick={()=>currentPage>1 && setCurrentPage(currentPage-1)}>
                                    <i className="fas fa-arrow-left me-2" />
                                    Previous
                                </button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            {page_number?.map((number)=>(
                                <li key={page_number} className={`page-item ${currentPage === number? "active" :""}`}>
                                    <button className="page-link text-dark fw-bold rounded" onClick={()=>setCurrentPage(number)}>{number}</button>
                                </li>
                            ))}

                        </ul>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage ===totalPages ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold ms-1 rounded" onClick={()=>currentPage<totalPages && setCurrentPage(currentPage+1)}>
                                    Next
                                    <i className="fas fa-arrow-right ms-3 " />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>
            
            {/* categories row*/}

            <section className="bg-light pt-5 pb-5 mb-3 mt-3">
                <h1 className="cattitle">Categories</h1>
                <div className="container">
                    <div className="container">
                        <div className="row">
                            {categoryItems.map((category) => (
                                
                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={category.id}>
                                        <div className="card bg-transparent">
                                            <img 
                                                className="card-img" 
                                                src={category.image} 
                                                style={{ width: "100%", height: "160px", objectFit: "cover" }} 
                                                alt="card image" 
                                            />
                                            <div className="d-flex flex-column align-items-center mt-3 pb-2">
                                                <Link to = {`category/${category.slug}`} className="cattitle1" >

                                                <h5 className="mb-0">{category.title}</h5>                                        
                                                </Link>
                                                <small>{category.post_count == 1 ? "1 Post" : `${category.post_count} Posts`}</small>
                                            </div>
                                        </div>
                                    </div>
                                

                            ))}
                        </div>
                    </div>
                    <nav className="d-flex mt-2">
                        <ul className="pagination">
                            <li className={`page-item ${currentCategory ===1 ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold me-1 rounded" onClick={()=>currentCategory>1 && setCurrentCategory(currentCategory-1)}>
                                    <i className="fas fa-arrow-left me-2" />
                                    Previous
                                </button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            {page_numberC?.map((numberC)=>(
                                <li key={numberC} className={`page-item ${currentCategory === numberC? "active" :""}`}>
                                    <button className="page-link text-dark fw-bold rounded" onClick={()=>setCurrentCategory(numberC)}>
                                        {numberC}
                                    </button>
                                </li>
                            ))}

                        </ul>
                        <ul className="pagination">
                            <li className={`page-item ${currentCategory ===totalCategories ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold ms-1 rounded" onClick={()=>currentCategory<totalCategories && setCurrentCategory(currentCategory+1)}>
                                    Next
                                    <i className="fas fa-arrow-right ms-3 " />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>
            {/*latest posts title */}
            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <a href="#" className="d-block card-img-flash">
                                <img src="assets/images/adv-3.png" alt="" />
                            </a>
                            <h2 className="text-start d-block mt-1">Latest Posts </h2>
                        </div>
                    </div>
                </div>
            </section>
            {/*latest posts row */}

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        {postItemsDate.map((postD)=>(
                            <div className="col-sm-6 col-lg-3" key = {postD?.id} >
                            <div className="card mb-4">
                                <div className="card-fold position-relative">
                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src={postD.image} alt={postD.title} />
                                </div>
                                <div className="card-body px-3 pt-3">
                                    <h4 className="card-title">
                                        <Link to={postD.slug} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            {postD.title.slice(0,40)}
                                        </Link>
                                    </h4>
                                    <button style={{ border: "none", background: "none" }}>
                                        <i className="fas fa-bookmark text-danger"></i>
                                    </button>
                                    <button style={{ border: "none", background: "none" }}>
                                        <i className="fas fa-thumbs-up text-primary"></i>
                                    </button>

                                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                        <li>
                                            <a href="#" className="text-dark text-decoration-none">
                                                <i className="fas fa-user"></i> {postD.user.full_name}
                                            </a>
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-calendar"></i> {Moment(postD.date)}
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-eye"></i> {postD.view}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <nav className="d-flex mt-2">
                        <ul className="pagination">
                            <li className={`page-item ${currentPageD ===1 ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold me-1 rounded" onClick={()=>currentPageD>1 && setCurrentPageD(currentPageD-1)}>
                                    <i className="fas fa-arrow-left me-2" />
                                    Previous
                                </button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            {page_number?.map((numberD)=>(
                                <li key={numberD} className={`page-item ${currentPageD === numberD? "active" :""}`}>
                                    <button className="page-link text-dark fw-bold rounded" onClick={()=>setCurrentPageD(numberD)}>{numberD}</button>
                                </li>
                            ))}

                        </ul>
                        <ul className="pagination">
                            <li className={`page-item ${currentPageD ===totalPages ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold ms-1 rounded" onClick={()=>currentPageD<totalPages && setCurrentPageD(currentPageD+1)}>
                                    Next
                                    <i className="fas fa-arrow-right ms-3 " />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Index;
