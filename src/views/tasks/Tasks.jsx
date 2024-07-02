import styles from "./Tasks.module.css";
import modalStyles from "./Modal.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPenToSquare,
	faPlus,
	faPowerOff,
	faSearch,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ReactModal from "react-modal";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import Loader from "../../components/loader/Loader";

const Tasks = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [createTaskModal, setCreateTaskModal] = useState(false);
	const [editTaskModal, setEditTaskModal] = useState(false);
	const [editTaskId, setEditTaskId] = useState("");
	const [deleteTaskId, setDeleteTaskId] = useState("");
	const [tasks, setTasks] = useState([]);

	const user = useSelector((state) => state.user.user);

	useEffect(() => {
		if (user) {
			if (user.role === "user") {
				setLoading(false);
			} else {
				navigate("/login");
			}
		} else {
			navigate("/login");
		}
	}, [user, navigate]);

	const userId = user?.id;

	const [taskData, setTaskData] = useState({
		title: "",
		description: "",
		status: "pending",
		priority: "low",
		dueDate: "",
		userId: userId,
	});

	const gettasks = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/all/` + userId
			);
			setTasks(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		gettasks();
	}, []);

	const handleTaskDataChange = (e) => {
		setTaskData({ ...taskData, [e.target.name]: e.target.value });
	};

	const handleCreateTask = async (e) => {
		e.preventDefault();
		try {
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/create`,
				taskData
			);
			gettasks();
			alert("Task Created Successfully");
		} catch (error) {
			console.log(error);
		} finally {
			setTaskData({
				title: "",
				description: "",
				status: "pending",
				priority: "low",
				dueDate: "",
				userId: userId,
			});
			setCreateTaskModal(false);
		}
	};

	const handleDeleteTask = async (id) => {
		console.log(id);
		try {
			await axios.delete(
				`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/delete/` + id
			);
			gettasks();
			alert("Task Deleted Successfully");
		} catch (error) {
			console.log(error);
		} finally {
			setDeleteTaskId(() => null);
		}
	};

	const handleEditTaskData = (data) => {
		setEditTaskModal(true);
		setTaskData({
			title: data.title,
			description: data.description,
			status: data.status,
			priority: data.priority,
			dueDate: new Date(data.dueDate).toISOString().split("T")[0],
			userId: userId,
		});
		setCreateTaskModal(true);
	};

	const handleEditTaskDetail = (data) => {
		axios
			.put(
				`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/edit/` +
					data.id,
				data
			)
			.then(() => {
				gettasks();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleEditTask = async (e) => {
		e.preventDefault();
		try {
			await axios.put(
				`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/edit/` +
					editTaskId,
				taskData
			);
			gettasks();
			alert("Task Updated Successfully");
		} catch (error) {
			console.log(error);
		} finally {
			setTaskData({
				title: "",
				description: "",
				status: "pending",
				priority: "low",
				dueDate: "",
				userId: userId,
			});
			setEditTaskModal(false);
			setCreateTaskModal(false);
		}
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<>
			<section className={styles.tasks}>
				<div className={styles.header}>
					<div className={styles.heading}>
						<h1>My Tasks</h1>
						<p
							onClick={() => {
								localStorage.removeItem("jwt_token");
								dispatch(logout());
								navigate("/");
							}}
						>
							<FontAwesomeIcon
								icon={faPowerOff}
								style={{ width: "1.25rem", height: "1.25rem" }}
							/>
							<span>Logout</span>
						</p>
					</div>
					<div className={styles.search}>
						<FontAwesomeIcon
							icon={faSearch}
							className={styles.searchIcon}
						/>
						<input type="text" placeholder="Search" />
					</div>
					<div className={styles.filtersBox}>
						<div className={styles.filters}>
							<h3>Filters :</h3>
							<select>
								<option>Status (All)</option>
								<option>Pending</option>
								<option>Ongoing</option>
								<option>Completed</option>
								<option>Overdue</option>
							</select>
							<select>
								<option>Priority (All)</option>
								<option>High</option>
								<option>Medium</option>
								<option>Low</option>
							</select>
							<input
								className={styles.filterDueDate}
								type="date"
							/>
						</div>
						<div className={styles.createTask}>
							<button
								className={styles.addTask}
								onClick={() => {
									setCreateTaskModal(true);
									setEditTaskModal(false);
									setTaskData({
										title: "",
										description: "",
										status: "pending",
										priority: "low",
										dueDate: "",
										userId: userId,
									});
								}}
							>
								<FontAwesomeIcon icon={faPlus} />
								<span>Create Task</span>
							</button>
						</div>
					</div>
				</div>
				<div className={styles.container}>
					<ul className={styles.tasksList}>
						{tasks?.length === 0 && (
							<h1 style={{ textAlign: "center" }}>
								No Tasks Found
							</h1>
						)}
						{tasks?.map((item) => (
							<div key={item.id} className={styles.listItem}>
								<div className={styles.textBox}>
									<h2>{item.title}</h2>
									<p>{item.description}</p>
								</div>
								<div className={styles.actionsBox}>
									<div className={styles.props}>
										<div className={styles.status}>
											<label>Status</label>
											<select
												value={item.status}
												onChange={(e) => {
													e.preventDefault();
													item.status =
														e.target.value;
													handleEditTaskDetail(item);
												}}
											>
												<option>Pending</option>
												<option>Ongoing</option>
												<option>Completed</option>
												<option>Overdue</option>
											</select>
										</div>
										<div className={styles.priority}>
											<label>Priority</label>
											<select
												value={item.priority}
												onChange={(e) => {
													e.preventDefault();
													item.priority =
														e.target.value;
													handleEditTaskDetail(item);
												}}
											>
												<option>High</option>
												<option>Medium</option>
												<option>Low</option>
											</select>
										</div>
										<div className={styles.dueDate}>
											<label>Due Date</label>
											<input
												type="date"
												value={
													new Date(item.dueDate)
														.toISOString()
														.split("T")[0]
												}
												onChange={(e) => {
													e.preventDefault();
													item.dueDate =
														e.target.value;
													handleEditTaskDetail(item);
												}}
											/>
										</div>
									</div>
									<div className={styles.actions}>
										<FontAwesomeIcon
											icon={faPenToSquare}
											className={styles.editIcon}
											onClick={() => {
												handleEditTaskData(item);
												setEditTaskId(item.id);
											}}
										/>
										<FontAwesomeIcon
											icon={faTrash}
											className={styles.deleteIcon}
											onClick={() =>
												setDeleteTaskId(item.id)
											}
										/>
									</div>
								</div>
								{deleteTaskId === item.id && (
									<ReactModal
										isOpen={deleteTaskId === item.id}
										onRequestClose={() => {
											setDeleteTaskId(() => null);
										}}
										style={{
											overlay: {
												backgroundColor:
													"rgba(255, 255, 255, 0.8)",
											},
											content: {
												top: "50%",
												left: "50%",
												right: "auto",
												bottom: "auto",
												marginRight: "-50%",
												transform:
													"translate(-50%, -50%)",
												width: "400px",
												height: "120px",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												borderWidth: "1px",
												borderColor: "#000",
												borderStyle: "solid",
												borderRadius: "10px",
											},
										}}
									>
										<div
											className={modalStyles.modalWrapper}
										>
											<div
												className={
													modalStyles.modalText
												}
											>
												Are you sure you want to Delete?
											</div>
											<div
												className={
													modalStyles.modalButton
												}
											>
												<div
													className={
														modalStyles.confirmDelBtn
													}
													onClick={() => {
														handleDeleteTask(
															item.id
														);
														setDeleteTaskId(
															() => null
														);
													}}
												>
													Delete
												</div>
												<div
													className={
														modalStyles.cancelBtn2
													}
													onClick={() => {
														setDeleteTaskId(
															() => null
														);
													}}
												>
													Cancel
												</div>
											</div>
										</div>
									</ReactModal>
								)}
							</div>
						))}
					</ul>
				</div>
			</section>
			<ReactModal
				isOpen={createTaskModal}
				onRequestClose={() => {
					setCreateTaskModal(false);
					setEditTaskModal(false);
				}}
				style={{
					overlay: {
						backgroundColor: "rgba(255, 255, 255, 0.6)",
					},
					content: {
						top: "50%",
						left: "50%",
						right: "auto",
						bottom: "auto",
						marginRight: "-50%",
						transform: "translate(-50%, -50%)",
						borderWidth: "1px",
						borderColor: "#000",
						borderStyle: "solid",
						borderRadius: "10px",
						width: "800px",
					},
				}}
			>
				<div className={modalStyles.wrapper}>
					{editTaskModal ? <h1>Edit Task</h1> : <h1>Create Task</h1>}
					<form
						className={modalStyles.form}
						onSubmit={(e) =>
							editTaskModal
								? handleEditTask(e)
								: handleCreateTask(e)
						}
					>
						<div className={modalStyles.formItem}>
							<label>
								Task
								<span className={modalStyles.required}> *</span>
							</label>
							<input
								type="text"
								placeholder="Project Presentation"
								name="title"
								value={taskData.title}
								onChange={handleTaskDataChange}
								required
							/>
						</div>
						<div className={modalStyles.formItem}>
							<label>Description</label>
							<textarea
								type="text"
								name="description"
								value={taskData.description}
								onChange={handleTaskDataChange}
								placeholder="Will be presenting the project in front of the team"
							/>
						</div>
						<div className={modalStyles.taskPropsBox}>
							<div className={modalStyles.status}>
								<label>
									Status
									<span className={modalStyles.required}>
										{" "}
										*
									</span>
								</label>
								<select
									name="status"
									value={taskData.status}
									onChange={handleTaskDataChange}
								>
									<option
										value="pending"
										selected={taskData.status === "pending"}
									>
										Pending
									</option>
									<option
										value="ongoing"
										selected={taskData.status === "ongoing"}
									>
										Ongoing
									</option>
									<option
										value="completed"
										selected={
											taskData.status === "completed"
										}
									>
										Completed
									</option>
									<option
										value="overdue"
										selected={taskData.status === "overdue"}
									>
										Overdue
									</option>
								</select>
							</div>
							<div className={modalStyles.priority}>
								<label>
									Priority
									<span className={modalStyles.required}>
										{" "}
										*
									</span>
								</label>
								<select
									name="priority"
									value={taskData.priority}
									onChange={handleTaskDataChange}
								>
									<option
										value="high"
										selected={taskData.priority === "high"}
									>
										High
									</option>
									<option
										value="medium"
										selected={
											taskData.priority === "medium"
										}
									>
										Medium
									</option>
									<option
										value="low"
										selected={taskData.priority === "low"}
									>
										Low
									</option>
								</select>
							</div>
							<div className={modalStyles.dueDate}>
								<label>
									Due Date
									<span className={modalStyles.required}>
										{" "}
										*
									</span>
								</label>
								<input
									type="date"
									name="dueDate"
									value={taskData.dueDate}
									onChange={handleTaskDataChange}
									required
								/>
							</div>
						</div>
						<div className={modalStyles.btns}>
							<button
								type="submit"
								className={modalStyles.createBtn}
							>
								{editTaskModal ? "Edit Task" : "Create Task"}
							</button>
							<button
								className={modalStyles.cancelBtn}
								onClick={() => setCreateTaskModal(false)}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</ReactModal>
		</>
	);
};

export default Tasks;
