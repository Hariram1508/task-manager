import React, { useEffect, useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import Navbar from "../components/Navbar";
import api from "../api";

function Dashboard(){
const [projects, setProjects] = useState([]);
const [selectedProjectId, setSelectedProjectId] = useState("");
const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [error, setError] = useState("");

const loadProjects = async () => {
try {
const response = await api.get(`/api/projects`);
const items = response.data || [];
setProjects(items);
if (items.length > 0 && !selectedProjectId) {
setSelectedProjectId(items[0]._id);
}
} catch (err) {
setError(err?.response?.data?.message || "Could not load projects");
}
};

useEffect(() => {
loadProjects();
}, []);

const createProject = async (e) => {
e.preventDefault();
setError("");

try {
const response = await api.post(`/api/projects`, {
name: name.trim(),
description: description.trim()
});
const created = response.data;
setProjects((prev) => [created, ...prev]);
setSelectedProjectId(created._id);
setName("");
setDescription("");
} catch (err) {
setError(err?.response?.data?.message || "Could not create project");
}
};

return(
<div className="page dashboard-page">
<Navbar/>
<main className="dashboard-content">
<h1>Project Dashboard</h1>
<p>Track progress across your team with a clear board view.</p>

<form className="project-create-form" onSubmit={createProject}>
<input
placeholder="Project name"
value={name}
onChange={(e) => setName(e.target.value)}
required
/>
<input
placeholder="Project description"
value={description}
onChange={(e) => setDescription(e.target.value)}
/>
<button type="submit">Create project</button>
</form>

<div className="project-picker">
<label htmlFor="project-select">Current project</label>
<select
id="project-select"
value={selectedProjectId}
onChange={(e) => setSelectedProjectId(e.target.value)}
>
{projects.length === 0 ? <option value="">No projects yet</option> : null}
{projects.map((project) => (
<option key={project._id} value={project._id}>{project.name}</option>
))}
</select>
</div>

{error && <p className="status error">{error}</p>}

<KanbanBoard projectId={selectedProjectId}/>
</main>
</div>

)

}

export default Dashboard;