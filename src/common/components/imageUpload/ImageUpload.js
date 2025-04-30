import {Image} from "primereact/image";
import React from "react";

const ImageUpload = ({src, onChange, error}) => {
    return <>
        {src && <Image src={src} width={100} preview/>}

        <div>
            <input
                className={"btn"}
                type="file"
                onChange={(e) => onChange(e)}
            />
        </div>

        {error && <small id="username-help" className="p-error">
            {error}
        </small>}
    </>
}

export default ImageUpload;