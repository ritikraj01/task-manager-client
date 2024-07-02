import { login } from "../redux/slices/userSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import App from "../App";
import axios from "axios";

const Root = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("jwt_token");
		const verifyToken = async () => {
			try {
				setLoading(true);
				const res = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-token`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				dispatch(login(res.data.user));
			} catch (error) {
				setLoading(false);
			} finally {
				setLoading(false);
			}
		};
		if (token) {
			verifyToken();
		} else {
			setLoading(false);
		}
	}, []);

	return <>{!loading && <App />}</>;
};

export default Root;
