import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		setLoading(true);
		try {
			await api.post(`/api/auth/register`, {
				name: name.trim(),
				email: email.trim().toLowerCase(),
				password,
			});

			setSuccess("Registration successful. Redirecting to login...");
			setTimeout(() => navigate("/"), 1000);
		} catch (err) {
			setError(err?.response?.data?.message || err?.response?.data || "Unable to register right now");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="page auth-page">
			<div className="auth-card">
				<h1>Create account</h1>
				<p className="auth-subtitle">Start managing projects and tasks in one place.</p>

				<form onSubmit={handleSubmit} className="auth-form">
					<input
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Confirm password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>

					{error && <p className="status error">{error}</p>}
					{success && <p className="status success">{success}</p>}

					<button type="submit" disabled={loading}>
						{loading ? "Creating account..." : "Register"}
					</button>
				</form>

				<p className="auth-footer">
					Already registered? <Link to="/">Go to login</Link>
				</p>
			</div>
		</div>
	);
}

export default Register;
