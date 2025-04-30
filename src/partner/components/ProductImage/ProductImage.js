import {confirmPopup, ConfirmPopup} from "primereact/confirmpopup";
import React, {useRef} from "react";
import {SortableItem} from "react-easy-sort";
import ProductService from "../../partner.service";

export const ProductImage = ({item,callback}) => {
    const deleteRef = useRef(null);
    const confirm = (event) => {
        const confirmModal = confirmPopup({
            target: deleteRef.current,
            message: 'Are your sure?',
            icon: 'pi pi-exclamation-triangle\n',
            accept: async () => {
                await ProductService.deleteProductImage(item.id);
                callback();
            },
            rejectLabel: ""
        });
    }
    return <SortableItem>
        <div className="item">
            <i
                ref={deleteRef}
                onClick={() => confirm()}
                className="delete-image pi pi-delete-left"></i>
            <img src={item.url}/>
            <ConfirmPopup/>
        </div>
    </SortableItem>
}