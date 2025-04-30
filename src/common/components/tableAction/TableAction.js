import React, {useRef} from "react";
import {Link} from "react-router-dom";
import {Button} from "primereact/button";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";

const TableAction = ({data, name, deleteItem, editItem, handleKey = "id",editable = true}) => {
    const deleteRef = useRef(null);
    const confirm = (event) => {
        const confirmModal = confirmPopup({
            target: deleteRef.current,
            message: 'Are your sure?',
            icon: 'pi pi-exclamation-triangle\n',
            accept: () => deleteItem(data[handleKey]),
            rejectLabel: ""
        });
    }
    return (
        <div style={{display: "flex"}}>
            {editable && (editItem ?
                <Button
                    onClick={() => editItem()}
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                /> :
                <Link to={`/${name}/${data[handleKey]}`}>
                    <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-success mr-2"
                    />
                </Link>)}

            <Button
                ref={deleteRef}
                onClick={() => confirm()}
                icon="pi pi-trash"
                className="p-button-rounded p-button-warning"
            />
            <ConfirmPopup/>
        </div>
    );
};

export default TableAction;