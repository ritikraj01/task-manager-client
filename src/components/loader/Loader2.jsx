import React from "react";
import { Oval } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="position-absolute top-50 end-0 translate-middle-y">
      <Oval
        ariaLabel="loading-indicator"
        height={23}
        width={23}
        strokeWidth={5}
        strokeWidthSecondary={4}
        color="white"
        secondaryColor="white"
      />
    </div>
  );
};

export default Loader;
