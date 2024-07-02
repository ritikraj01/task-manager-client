import styles from "./Home.module.css";
import { Link } from "react-router-dom";

const Home = () => {
	return (
		<section className={styles.home}>
			<h1 className={styles.heading}>Task Manager</h1>
			<Link to="/login" className={styles.link}>
				Click here to Login.
			</Link>
		</section>
	);
};

export default Home;
