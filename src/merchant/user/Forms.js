import React, {Fragment, useState, useEffect, useRef, useCallback} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import MerchantService from "./merchant.service";
import {Button} from "primereact/button";
import {useNavigate, useParams} from "react-router-dom";
import {Formik, Form} from "formik";
import "./add-edit.scss";
import {InputTextarea} from "primereact/inputtextarea";
import {MultiSelect} from "primereact/multiselect";
import CategoryService from "../../events/category/category.service";
import {toast} from "../../routes";
import {routeUrl} from "../../common/utils/helpers";
import routes from "./routes";
import {InputSwitch} from "primereact/inputswitch";
import ImageUpload from "../../common/components/imageUpload/ImageUpload";
import RegionService from "../../region/region.service";
import {Dropdown} from "primereact/dropdown";

const Forms = () => {
    const params = useParams();
    const id = Number(params?.id);
    const isAddMode = !id;
    const [merchant, setMerchant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);
    const [initialValues, setInitialValues] = useState({
        name: "",
        surname:"",
        email: "",
        phone: "",
        website: "",
        address: "",
        category_id: "",
        is_active: "",
        profile_image: "",
        password: "",
        country_id: "",
        city_id: ""
    });
    let navigate = useNavigate();

    const getData = async () => {
        setIsLoading(true);
        const response = await MerchantService.getMerchant(id);
        if (!response) {
            return false;
        }
        setSelectedCategories(response.data.categories.map((cat) => cat.id));
        setMerchant(response.data);
        setIsLoading(false);
        setInitialValues({
            name: response.data?.name,
            surname: response.data?.surname,
            email: response.data?.email,
            phone: response.data?.phone,
            website: response.data?.website,
            address: response.data?.address,
            category_id: response.data?.category_id,
            is_active: response.data?.is_active,
            profile_image: response.data?.profile_image,
            password: "",
            country_id: response.data?.country_id,
            city_id: response.data?.city_id
        });
    };

    const getRegions = async () => {
        const response = await RegionService.getRegions();
        if (!response) {
            return false;
        }

        setRegions(response.data);
    };

    const getCategories = async () => {
        const response = await CategoryService.getCategories();
        setCategories(response.data);
    };

    const cachedRegions = useCallback((elements) => {
        return (elements || []).map(data => ({...data, label: data.data.title, id: data.data.id, children: cachedRegions(data.children)}))
    }, [regions]);

    useEffect(() => {
        if (!isAddMode) {
            getData();
        }
    }, [id, isAddMode]);

    useEffect(() => {
        getCategories();
        getRegions();
    }, []);


    const store = async (values) => {
        let formData = new FormData();
        formData.append("name", values.name);
        formData.append("surname", values.surname);
        formData.append("website", values.website);
        formData.append("address", values.address);
        formData.append("phone", values.phone);
        formData.append("password", values.password);
        formData.append("email", values.email);
        formData.append("is_active", values.is_active ? 1 : 0);
        formData.append("country_id", values.country_id);
        formData.append("city_id", values.city_id);

        if (profileImage !== null) {
            formData.append("profile_image", profileImage);
        }
        selectedCategories?.forEach((cat) => formData.append("categories[]", cat));

        const response = await MerchantService.storeMerchant(formData, merchant);
        if (response.success) {
            navigate(routeUrl(routes, 'merchant.index'));
        } else if (response.errors) {
            setErrors(response.errors);
        }
    };

    const update = async (values) => {
        let formData = new FormData();
        formData.append("name", values.name);
        formData.append("surname", values.surname);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("website", values.website);
        formData.append("address", values.address);
        formData.append("country_id", values.country_id);
        formData.append("city_id", values.city_id);
        formData.append("is_active", values.is_active ? 1 : 0);
        if (values.password !== "") {
            formData.append("password", values.password);
        }
        if (profileImage !== null) {
            formData.append("profile_image", profileImage);
        }
        selectedCategories.forEach((cat) => formData.append("categories[]", cat));
        formData.append("_method", "PUT");

        const response = await MerchantService.updateMerchant(formData, id);
        if (response.success) {
            setErrors({});
            toast.current.show({
                severity: "success",
                summary: "Success Message",
                detail: "Merchant updated",
                life: 3000,
            });
        } else if (response.errors) {
            setErrors(response.errors);
        }

    };


    return (
        <Fragment>
            <Breadcrumb
                items={[
                    {label: "Merchants", url: routeUrl(routes, 'merchant.index')},
                    {
                        label: isAddMode ? "Add" : id,
                    },
                ]}
            />
            <section className="user">
                <div className="card">
                    {!isLoading && (
                        <Formik
                            // validationSchema={Schema}
                            initialValues={initialValues}
                            onSubmit={values => isAddMode ? store(values) : update(values)}
                            className="p-fluid grid"
                        >
                            {(props) =>
                                (
                                    <Form className="p-fluid grid">
                                        <div className="field col-6 md:col-6">
                                        <span className="p-float-label">
                                          <InputText
                                              type="text"
                                              placeholder="Name"
                                              name="name"
                                              onChange={props.handleChange("name")}
                                              value={props.values.name}
                                          />
                                          <label htmlFor="inputtext">Name</label>
                                        </span>
                                            {errors?.name ? (
                                                <small id="username-help" className="p-error">
                                                    {errors.name}
                                                </small>
                                            ) : null}
                                        </div>
                                        <div className="field col-6 md:col-6">
                                        <span className="p-float-label">
                                          <InputText
                                              type="text"
                                              placeholder="Surname"
                                              name="surname"
                                              onChange={props.handleChange("surname")}
                                              value={props.values.surname}
                                          />
                                          <label htmlFor="inputtext">Surname</label>
                                        </span>
                                            {errors?.surname ? (
                                                <small id="username-help" className="p-error">
                                                    {errors.surname}
                                                </small>
                                            ) : null}
                                        </div>

                                        <div className="field col-6 md:col-6">
                                        <span className="p-float-label">
                                          <InputText
                                              type="text"
                                              placeholder="Website"
                                              name="website"
                                              onChange={props.handleChange("website")}
                                              value={props.values.website}
                                          />
                                          <label htmlFor="inputtext">Website</label>
                                        </span>
                                            {errors?.website ? (
                                                <small id="username-help" className="p-error">
                                                    {errors.website}
                                                </small>
                                            ) : null}
                                        </div>

                                        <div className="field col-6 md:col-6">
                                    <span className="p-float-label">
                                      <MultiSelect
                                          value={selectedCategories}
                                          options={categories}
                                          onChange={(e) => setSelectedCategories(e.value)}
                                          optionLabel="title"
                                          placeholder="Select a Index"
                                          maxSelectedLabels={3}
                                          optionValue="id"
                                      />

                                      <label htmlFor="inputtext">Index</label>
                                    </span>
                                        </div>

                                        <div className="field col-6 md:col-6">
                                        <span className="p-float-label">
                                          <InputText
                                              type="text"
                                              placeholder="Phone"
                                              name="phone"
                                              onChange={props.handleChange("phone")}
                                              value={props.values.phone}
                                          />
                                          <label htmlFor="inputtext">Phone</label>
                                        </span>
                                            {errors?.phone ? (
                                                <small id="username-help" className="p-error">
                                                    {errors.phone}
                                                </small>
                                            ) : null}
                                        </div>

                                        <div className="field col-6 md:col-6">
                                        <span className="p-float-label">
                                          <Password
                                              inputId="password"
                                              type="passwors"
                                              placeholder="Password"
                                              name="password"
                                              onChange={props.handleChange("password")}
                                              value={props.values.password}
                                          />
                                          <label htmlFor="password">Password</label>
                                        </span>
                                            {errors?.password ? (
                                                <small id="username-help" className="p-error">
                                                    {errors.password}
                                                </small>
                                            ) : null}
                                        </div>

                                        <div className="field col-6 md:col-6">
                                        <span className="p-float-label">
                                          <InputText
                                              type="email"
                                              placeholder="Email"
                                              name="email"
                                              onChange={props.handleChange("email")}
                                              value={props.values.email}
                                          />
                                          <label htmlFor="inputtext">Email</label>
                                        </span>
                                            {errors?.email ? (
                                                <small id="username-help" className="p-error">
                                                    {errors.email}
                                                </small>
                                            ) : null}
                                        </div>

                                        <div className="field col-6 md:col-6">
                                            <Dropdown
                                                value={props.values.country_id}
                                                options={cachedRegions(regions)}
                                                onChange={e => {
                                                    props.setFieldValue('city_id', "")
                                                    props.setFieldValue('country_id', e.value)
                                                }}
                                                optionLabel="label"
                                                placeholder="Select Country"
                                                optionValue="id"
                                            />
                                            {errors?.country_id && <small id="username-help" className="p-error">
                                                {errors.country_id}
                                            </small>}
                                        </div>

                                        {props.values.country_id && <div className="field col-6 md:col-6">
                                            <Dropdown
                                                value={props.values.city_id}
                                                options={cachedRegions(regions).find(r => r.id == props.values.country_id)?.children ?? []}
                                                onChange={e => props.setFieldValue('city_id', e.value)}
                                                optionLabel="label"
                                                placeholder="Select City"
                                                optionValue="id"
                                            />
                                            {errors?.city_id && <small id="username-help" className="p-error">
                                                {errors.city_id}
                                            </small>}
                                        </div>}

                                        <div className="field col-6 md:col-6">
                                        <span className="p-float-label">
                                          <InputTextarea
                                              rows={5}
                                              cols={30}
                                              autoResize
                                              onChange={props.handleChange("address")}
                                              value={props.values.address}
                                          />

                                          <label htmlFor="inputtext">Address</label>
                                        </span>
                                            {errors?.address ? (
                                                <small id="username-help" className="p-error">
                                                    {errors.address}
                                                </small>
                                            ) : null}
                                        </div>

                                        <div className="field col-6 md:col-6">
                                            <ImageUpload
                                                src={profileImage ? URL.createObjectURL(profileImage) : props.values.profile_image}
                                                onChange={e => setProfileImage(e.target.files[0])}
                                                error={errors?.profile_image}
                                            />
                                        </div>

                                        <div className="field col-2 md:col-2">
                                            <label htmlFor="">Is Active</label>
                                            <br/>
                                            <InputSwitch checked={props.values.is_active} onChange={(e) => props.setFieldValue('is_active', e.value)}/>

                                            {errors?.is_active && <small id="username-help" className="p-error">
                                                {errors.is_active}
                                            </small>}
                                        </div>

                                        <Button type="submit" label="Save" className="flex-start"/>
                                    </Form>
                                )}
                        </Formik>
                    )}

                    {isLoading && <h1>Loading...</h1>}
                </div>
            </section>
        </Fragment>
    );
};

export default Forms;
