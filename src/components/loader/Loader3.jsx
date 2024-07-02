import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loader3 = () => {
	return (
		<>
			<div
				style={{
					zIndex: 9999,
				}}
			>
				<ThreeDots
					visible={true}
					ariaLabel="loading-indicator"
					height={30}
					width={60}
					radius="9"
					color="black"
				/>
			</div>
		</>
	);
};

export default Loader3;
