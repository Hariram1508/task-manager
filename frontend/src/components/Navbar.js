import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	};

	return (
		<nav className="navbar">
			<h2>Task Manager</h2>
			<div className="nav-actions">
				<Link to="/dashboard">Dashboard</Link>
				<Link to="/" onClick={handleLogout}>Logout</Link>
			</div>
		</nav>
	);
}

export default Navbar;
