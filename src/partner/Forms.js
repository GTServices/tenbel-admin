import React, {Fragment, useState, useEffect, useRef} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import PartnerService from "./partner.service";
import {Button} from "primereact/button";
import {useNavigate, useParams} from "react-router-dom";
import "./form.scss";
import {toast} from "../routes";
import {boolToInt, routeUrl, typeToValue} from "../common/utils/helpers";
import routes from "./routes";
import {InputSwitch} from "primereact/inputswitch";
import {useSelector} from "react-redux";
import ImageUpload from "../common/components/imageUpload/ImageUpload";

const Forms = () => {
    const params = useParams();
    const id = Number(params?.id);
    const {langs} = useSelector((state) => state.langs);
    const isAddMode = !id;
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [item, setItem] = useState({});
    const [image, setImage] = useState(null);
    let navigate = useNavigate();

    const getData = async () => {
        setIsLoading(true);
        const response = await PartnerService.get(id);
        if (!response) {
            return false;
        }
        setItem(response.data);
        setIsLoading(false);
    };


    useEffect(() => {
        if (!isAddMode) {
            getData();
        }
    }, [id, isAddMode]);


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setItem({...item, [name]: typeToValue(value)});
    };


    const handleSave = () => {
        let formData = new FormData();
        formData.append("url", item.url ?? "");
        formData.append("is_active", boolToInt(item.is_active));
        if (image) {
            formData.append("image", image);
        }
        id ? update(formData) : store(formData);
    }

    const store = async (formData) => {
        const response = await PartnerService.store(formData);
        if (response.success) {
            navigate(routeUrl(routes, 'partner.index'));
        } else if (response.errors) {
            setErrors(response.errors);
        }
    };

    const update = async (formData) => {

        formData.append("_method", "PUT");

        const response = await PartnerService.update(formData, id);
        if (response.success) {
            setErrors({});
            toast.current.show({
                severity: "success",
                summary: "Success Message",
                detail: "Partner updated",
                life: 3000,
            });
            window.location.reload();
        } else if (response.errors) {
            setErrors(response.errors);
        }

    };


    return (
        <Fragment>
            <Breadcrumb
                items={[
                    {label: "Partners", url: routeUrl(routes, 'partner.index')},
                    {
                        label: isAddMode ? "Add" : id,
                    },
                ]}
            />
            <section className="user">
                <div className="card">
                    <div className="grid">
                        <div className="col-8">
                            <div className="grid flex flex-wrap">

                                <div className="col-4">
                                    <div>
                                        <label htmlFor="">Image</label>
                                        <div className="field col-6 md:col-6">
                                            <ImageUpload
                                                src={image ? URL.createObjectURL(image) : item?.image}
                                                onChange={e => setImage(e.target.files[0])}
                                                error={errors?.image}
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="col-4">
                                    <label htmlFor="title">Url</label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="url"
                                        value={item?.url ?? ""}
                                        onChange={(e) => handleChange(e)}
                                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                    />
                                    {errors?.url && <small className="p-error">{errors?.url}</small>}
                                </div>

                                <div className="col-2">
                                    <label htmlFor="">Active</label>
                                    <br/>
                                    <InputSwitch checked={item?.is_active} name={'is_active'} onChange={(e) => handleChange(e)}/>

                                    {errors?.is_active && <small id="username-help" className="p-error">
                                        {errors.is_active}
                                    </small>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button
                        type="button"
                        label="Save"
                        className="flex-start"
                        onClick={() => handleSave()}
                    />
                </div>
            </section>
        </Fragment>
    );
};

export default Forms;
