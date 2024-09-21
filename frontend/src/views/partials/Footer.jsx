import React from "react";
function Footer() {
    return (
        <footer>
            <div className="row bg-dark py-5 mx-0 card card-header  flex-row align-items-center text-center text-md-start">
                <div className="col-md-5 mb-3 mb-md-0">
                    <div className="text-primary-hover text-white">
                        {"SLYND  |  Your Safe Place"}
                    </div>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                    <img src="/logo.png" style={{ width: "200px" }} alt="footer logo" />
                </div>
                <div className="col-md-4">
                    <ul className="nav text-primary-hover justify-content-center justify-content-md-end">
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" href="https://facebook.com/loayabassii" target="_blank">
                                <i className="fab fa-facebook-square" />
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" href="https://X.com/abassiloay" target="_blank">
                                <i className="fab fa-twitter-square" />
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link text-white px-2 fs-5" href="https://www.instagram.com/loay_abassi" target="_blank">
                                <i className="fab fa-instagram-square" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
