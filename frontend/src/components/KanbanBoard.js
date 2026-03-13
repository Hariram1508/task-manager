import React, { useEffect, useMemo, useState } from "react";
import Board from "./Board";
import api from "../api";

function KanbanBoard({ projectId }){
const [tasks, setTasks] = useState([]);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const grouped = useMemo(() => {
return {
todo: tasks.filter((task) => task.status === "todo"),
inprogress: tasks.filter((task) => task.status === "inprogress"),
done: tasks.filter((task) => task.status === "done")
};
}, [tasks]);

const loadTasks = async () => {
if (!projectId) {
setTasks([]);
return;
}

setLoading(true);
setError("");
try {
const response = await api.get(`/api/tasks`, { params: { projectId } });
setTasks(response.data || []);
} catch (err) {
setError(err?.response?.data?.message || "Could not load tasks");
} finally {
setLoading(false);
}
};

useEffect(() => {
loadTasks();
}, [projectId]);

const addTask = async (e) => {
e.preventDefault();
if (!projectId) return;

try {
await api.post(`/api/tasks`, {
title: title.trim(),
description: description.trim(),
project: projectId,
status: "todo"
});

setTitle("");
setDescription("");
loadTasks();
} catch (err) {
setError(err?.response?.data?.message || "Could not create task");
}
};

const moveTask = async (task, nextStatus) => {
try {
await api.patch(`/api/tasks/${task._id}/status`, { status: nextStatus });
setTasks((prev) => prev.map((item) => (item._id === task._id ? { ...item, status: nextStatus } : item)));
} catch (err) {
setError(err?.response?.data?.message || "Could not update task status");
}
};

const deleteTask = async (task) => {
try {
await api.delete(`/api/tasks/${task._id}`);
setTasks((prev) => prev.filter((item) => item._id !== task._id));
} catch (err) {
setError(err?.response?.data?.message || "Could not delete task");
}
};

return(
<>
<form className="task-create-form" onSubmit={addTask}>
<input
placeholder="Task title"
value={title}
onChange={(e) => setTitle(e.target.value)}
required
/>
<input
placeholder="Task description"
value={description}
onChange={(e) => setDescription(e.target.value)}
/>
<button type="submit" disabled={!projectId}>Add task</button>
</form>

{error && <p className="status error">{error}</p>}
{loading && <p className="status">Loading tasks...</p>}

<div className="board-grid">
<Board
title="Todo"
tasks={grouped.todo}
onMoveRight={(task) => moveTask(task, "inprogress")}
onDelete={deleteTask}
/>
<Board
title="In Progress"
tasks={grouped.inprogress}
onMoveLeft={(task) => moveTask(task, "todo")}
onMoveRight={(task) => moveTask(task, "done")}
onDelete={deleteTask}
/>
<Board
title="Done"
tasks={grouped.done}
onMoveLeft={(task) => moveTask(task, "inprogress")}
onDelete={deleteTask}
/>
</div>
</>

)

}

export default KanbanBoard;
