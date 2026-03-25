import axios from "axios";

/*
const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
});

// sample axios call (post & get) after creating axios instance to avoid repititive code
const response = api.post("/api/auth/register", {
    username, email, password
});

const response = api.get("/api/auth/logout");

*/


export async function register({ username, email, password }) {

    try {
        
        const response = axios.post("http://localhost:5000/api/auth/register", {
            username, email, password
        }, {
            withCredentials: true
        });

    return response;

    } catch (error) {
        console.log(error);
    }
    
}

export async function login({ email, password }) {

    try {
        
        const response = axios.post("http://localhost:5000/api/auth/login", {
            email, password
        }, {
            withCredentials: true
        });

    return response;

    } catch (error) {
        console.log(error);
    }
    
}

export async function logout() {

    try {
        
        const response = axios.get("http://localhost:5000/api/auth/logout", {
            withCredentials: true
        });

    return response;

    } catch (error) {
        console.log(error);
    }
    
}

export async function getMe() {

    try {
        
        const response = axios.get("http://localhost:5000/api/auth/get-me", {
            withCredentials: true
        });

    return response;

    } catch (error) {
        console.log(error);
    }
    
}