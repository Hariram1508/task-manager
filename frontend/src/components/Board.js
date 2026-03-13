import React from "react";

function Board({ title, tasks = [], onMoveLeft, onMoveRight, onDelete }) {
	return (
		<section className="board-column">
			<header className="board-header">
				<h3>{title}</h3>
				<span>{tasks.length}</span>
			</header>

			<div className="board-list">
				{tasks.length === 0 ? (
					<p className="empty-state">No tasks yet</p>
				) : (
					tasks.map((task) => (
						<article key={task._id} className="task-card">
							<h4>{task.title}</h4>
							<p>{task.description}</p>
							<div className="task-actions">
								{onMoveLeft && (
									<button onClick={() => onMoveLeft(task)}>Back</button>
								)}
								{onMoveRight && (
									<button onClick={() => onMoveRight(task)}>Next</button>
								)}
								<button className="danger" onClick={() => onDelete(task)}>Delete</button>
							</div>
						</article>
					))
				)}
			</div>
		</section>
	);
}

export default Board;
