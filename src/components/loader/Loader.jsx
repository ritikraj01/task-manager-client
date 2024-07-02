import { Oval } from "react-loader-spinner";

const Loader = () => {
	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "90vh",
					width: "100vw",
					position: "fixed",
					top: "10vh",
					left: 0,
					backgroundColor: "rgba(255, 255, 255, 0.9)",
					zIndex: 9999,
				}}
			>
				<Oval
					ariaLabel="loading-indicator"
					height={200}
					width={200}
					strokeWidth={10}
					strokeWidthSecondary={3}
					color="orange"
					secondaryColor="white"
				/>
			</div>
		</>
	);
};

export default Loader;
