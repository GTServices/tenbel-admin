import React, {Fragment, useState, useEffect, useRef} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import {InputText} from "primereact/inputtext";
import {Password} from "primereact/password";
import AdminService from "./admin.service";
import {Button} from "primereact/button";
import {useParams} from "react-router-dom";
import {Formik, Form} from "formik";
import "./add-edit.scss";
import {useNavigate} from "react-router-dom";
import {Checkbox} from "primereact/checkbox";
import routes from "./routes";
import {routeUrl} from "../../common/utils/helpers";
import {InputSwitch} from "primereact/inputswitch";
import {toast} from "../../routes";
import RoleService from "../roles/role.service";
import ImageUpload from "../../common/components/imageUpload/ImageUpload";

const UserEdit = () => {
    const params = useParams();
    const id = Number(params?.id);
    const isAddMode = !id;
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [roleLists, setRoleLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState(null);
    const [initialValues, setInitialValues] = useState({
        username: "",
        email: "",
        is_active: false,
        profile_image: "",
        password: "",
    });
    let navigate = useNavigate();

    const onRoleChange = (e) => {
        let selectedRoles = [...roles];

        if (e.checked) {
            selectedRoles.push(e.value);
        } else {
            selectedRoles.splice(selectedRoles.indexOf(e.value), 1);
        }

        setRoles(selectedRoles);
    };

    const getData = async () => {
        setIsLoading(true);
        const response = await AdminService.getAdmin(id);
        if (!response) {
            return false;
        }
        setUser(response.data);
        setRoles(response.data?.roles?.map((role) => role.id));
        setInitialValues({
            username: response.data.username,
            email: response.data.email,
            is_active: response.data.is_active,
            profile_image: response.data.profile_image
        })
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isAddMode) {
            getData();
        }
    }, [id, isAddMode]);

    const getRoles = async () => {
        try {
            const response = await RoleService.getRoles();
            setRoleLists(response.data);
        } catch (e) {
        }
    };

    useEffect(() => {
        getRoles();
    }, []);

    const store = async (values) => {
        let formData = new FormData();
        formData.append("username", values.username);
        formData.append("password", values.password);
        formData.append("email", values.email);
        formData.append("is_active", values.is_active ? 1 : 0);
        roles.forEach((role) => formData.append("roles[]", role));
        if (profileImage !== null) {
            formData.append("profile_image", profileImage);
        }
        const response = await AdminService.storeAdmin(formData, user)
        if (response?.errors) {
            setErrors(response.errors)
        } else if (response?.success) {
            navigate(routeUrl(routes, 'admin.index'));
        }

    };

    const update = async (values) => {
        let formData = new FormData();
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("is_active", values.is_active ? 1 : 0);
        roles.forEach((role) => formData.append("roles[]", role));
        formData.append("_method", "PUT");

        if (values.password?.toString().trim() !== "") {
            formData.append("password", values.password);
        }
        if (profileImage !== null) {
            formData.append("profile_image", profileImage);
        }

        const response = await AdminService.updateAdmin(formData, id);
        if (response.errors) {
            setErrors(response.errors);
        } else if (response.success) {
            getData();
            toast.current.show({
                severity: "success",
                summary: "Success Message",
                detail: "Data updated",
                life: 3000,
            });
        }
    };

    const rolesRender = roleLists?.map((role) => (
        <div className="field-checkbox" key={role.id}>
            <Checkbox
                id={role.id}
                name="role"
                value={role.id}
                onChange={onRoleChange}
                checked={roles.indexOf(role.id) !== -1}
            />
            <label htmlFor={role.id}>{role.name}</label>
        </div>
    ));

    return (
        <Fragment>
            <Breadcrumb
                items={[
                    {label: "Admins", url: routeUrl(routes, 'admin.index')},
                    {label: isAddMode ? "Add" : id},
                ]}
            />
            <section className="user">
                <div className="card">
                    {!isLoading && (
                        <Formik
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
                                                  placeholder="Last Name"
                                                  name="username"
                                                  onChange={props.handleChange("username")}
                                                  value={props.values.username}
                                              />
                                              <label htmlFor="inputtext">Username</label>
                                            </span>
                                            {errors?.username ? (
                                                <small id="username-help" className="p-error">
                                                    {errors.username}
                                                </small>
                                            ) : null}
                                        </div>

                                        <div className="field col-6 md:col-6">
                                            <span className="p-float-label">
                                              <Password
                                                  inputId="password"
                                                  type="password"
                                                  placeholder="Password"
                                                  name="password"
                                                  onChange={props.handleChange("password")}
                                                  value={props.values.password ?? ''}
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
                                            <ImageUpload
                                                src={profileImage ? URL.createObjectURL(profileImage) : props.values.profile_image}
                                                onChange={e => setProfileImage(e.target.files[0])}
                                                error={errors?.profile_image}
                                            />
                                        </div>

                                        <div className="field col-2 md:col-2">
                                            <InputSwitch checked={props.values.is_active} onChange={(e) => props.setFieldValue('is_active', e.value)}/>

                                            {errors?.is_active ? (
                                                <small id="username-help" className="p-error">
                                                    {errors.is_active}
                                                </small>
                                            ) : null}
                                        </div>

                                        <div style={{display: "flex", gap: "1rem", flexWrap: "wrap"}}>
                                            {rolesRender}
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

export default UserEdit;
