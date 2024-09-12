# packages

specify everything u need in ur package.json after installing yarn and vite
this will install only needed modules, unlike what npm install does XD

# server

yarn dev

# libraries

I. Notifications
import Swal from "sweetalert2";

    const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
    });

II. decoding JWT tokens
import jwt_decode from "jwt-decode";
const decoded = jwt_decode(token);

III. AJAX communication

    import axios from "axios";
    axios.post(api_endpoint, {
    username: 'yourUsername',
    password: 'yourPassword',
    })

    // in order to use it inside a fucntion add await
    (requires async"a function with a promise")
    i. async
    in async operations we can use the setLoading(boolean)
    that stops the loading once operation is done

    best example : utils/axios.js
    use axios instance to configure default things like BASE_URL,headers useAxios.js 15
    ii. interceptors
    interceptors allows request,response modifiaction before they
    get handled by then and catch , 21

