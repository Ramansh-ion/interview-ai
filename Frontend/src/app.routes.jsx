import {createBrowserRouter} from "react-router";
import Register from "./features/interview/auth/pages/Register";
import Login from "./features/interview/auth/pages/Login";
import Protected from "./features/interview/auth/components/Protected";
import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/",
        element:<Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
])