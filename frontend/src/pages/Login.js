import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login(){
const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [error,setError] = useState("");
const [loading,setLoading] = useState(false);

const handleSubmit = async(e)=>{
e.preventDefault();
setError("");
setLoading(true);

try{
const response = await api.post(`/api/auth/login`,{
email: email.trim().toLowerCase(),
password
});

if(response?.data?.token){
localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response?.data?.user || {}));
navigate("/dashboard");
}
}catch(err){
setError(err?.response?.data?.message || "Unable to connect to server. Make sure backend is running on port 5000.");
}finally{
setLoading(false);
}
}

return(
<div className="page auth-page">
<div className="auth-card">
<h1>Welcome back</h1>
<p className="auth-subtitle">Sign in to continue working on your tasks.</p>

<form onSubmit={handleSubmit} className="auth-form">
<input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
<input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />

{error && <p className="status error">{error}</p>}

<button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>

</form>

<p className="auth-footer">
No account yet? <Link to="/register">Create one</Link>
</p>
</div>
</div>
)
}

export default Login;