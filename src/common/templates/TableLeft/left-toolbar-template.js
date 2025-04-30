import React from "react";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";

const LeftToolbarTemplate = ({name}) => {
    return (
        <React.Fragment>
            <Link to={`/${name}/store`}>
                <Button label="New" icon="pi pi-plus" className="mr-2"/>
            </Link>
        </React.Fragment>
    )
        ;
};

export default React.memo(LeftToolbarTemplate);
