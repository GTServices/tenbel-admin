import React from "react";

const IsActiveBodyTemplate = ({data,columnName}) => {

    return (
        <React.Fragment>
            <span className="image-text">{data[columnName] ? "true" : "false"}</span>
        </React.Fragment>
    );
};

export default React.memo(IsActiveBodyTemplate);
