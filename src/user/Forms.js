import React, {
  Fragment,
  useState,
  useEffect,
  //   useRef,
  useCallback,
} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import UserService from "./user.service";
import { Button } from "primereact/button";
// import {RadioButton} from "primereact/radiobutton";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import "./add-edit.scss";
import { Calendar } from "primereact/calendar";
import RegionService from "../region/region.service";
import routes from "./routes";
import { formattedDate, routeUrl } from "../common/utils/helpers";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import ImageUpload from "../common/components/imageUpload/ImageUpload";
import { toast } from "../routes";

const Forms = () => {
  const params = useParams();
  const id = Number(params?.id);
  const isAddMode = !id;
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState(null);
  const [date, setDate] = useState(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    birthday: "",
    is_active: "",
    gender: "",
    profile_image: "",
    country_id: "",
    city_id: "",
    password: "",
  });
  const [regions, setRegions] = useState([]);
  let navigate = useNavigate();
  const getData = async () => {
    setIsLoading(true);
    const response = await UserService.getUser(id);
    setUser(response.data);
    setDate(new Date(Date.parse(response.data.birthday)));
    setInitialValues({
      name: response.data.name,
      surname: response.data.surname,
      email: response.data.email,
      phone: response.data.phone,
      birthday: response.data.birthday,
      is_active: response.data.is_active,
      gender: response.data.gender,
      profile_image: response.data.profile_image,
      password: "",
      country_id: response.data.country_id,
      city_id: response.data.city_id,
    });
    setIsLoading(false);
  };

  const cachedRegions = useCallback((elements) => {
    return (elements || []).map((data) => ({
      ...data,
      label: data.data.title,
      id: data.data.id,
      children: cachedRegions(data.children),
    }));
  }, []);

  useEffect(() => {
    if (!isAddMode) {
      getData();
    }
  }, [id, isAddMode]);

  useEffect(() => {
    getRegions();
  }, []);

  const onFormSubmit = (values) => {
    isAddMode ? store(values) : update(values);
  };

  const store = async (values) => {
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("surname", values.surname);
    formData.append("phone", values.phone);
    formData.append("password", values.password);
    formData.append("email", values.email);
    formData.append("gender", values.gender);
    formData.append("country_id", values.country_id);
    formData.append("city_id", values.city_id);
    formData.append("is_active", values.is_active ? 1 : 0);
    formData.append("profile_image", profileImage);
    if (date) {
      formData.append("birthday", formattedDate(date));
    }

    const response = await UserService.storeUser(formData, user);
    if (response.success) {
      navigate(routeUrl(routes, "user.index"));
    } else if (response.errors) {
      setErrors(response.errors);
    }
  };

  const getRegions = async () => {
    const response = await RegionService.getRegions();
    if (!response) {
      return false;
    }

    setRegions(response.data);
  };

  const update = async (values) => {
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("surname", values.surname);
    if (values.password !== "") {
      formData.append("password", values.password);
    }
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("gender", values.gender);
    formData.append("country_id", values.country_id);
    formData.append("city_id", values.city_id);
    formData.append("is_active", values.is_active ? 1 : 0);
    if (date) {
      formData.append("birthday", formattedDate(date));
    }
    if (profileImage !== null) {
      formData.append("profile_image", profileImage);
    }

    formData.append("_method", "PUT");

    const response = await UserService.updateUser(formData, id);
    if (response.success) {
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: "Data updated",
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
          { label: "Users", url: routeUrl(routes, "user.index") },
          {
            label: isAddMode ? "Add" : id,
          },
        ]}
      />
      <section className="user">
        <div className="card">
          {!isLoading && (
            <Formik
              initialValues={initialValues}
              onSubmit={onFormSubmit}
              className="p-fluid grid"
            >
              {(props) => (
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
                      <Calendar
                        id="basic"
                        value={date}
                        onChange={(e) => setDate(e.value)}
                      />

                      <label htmlFor="inputtext">Birthday</label>
                    </span>
                    {errors?.birthday && (
                      <small id="username-help" className="p-error">
                        {errors.birthday}
                      </small>
                    )}
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
                  <div className="field col-3 md:col-3">
                    <Dropdown
                      value={props.values.country_id}
                      options={cachedRegions(regions)}
                      onChange={(e) => {
                        props.setFieldValue("city_id", "");
                        props.setFieldValue("country_id", e.value);
                      }}
                      optionLabel="label"
                      placeholder="Select Country"
                      optionValue="id"
                    />
                    {errors?.country_id && (
                      <small id="username-help" className="p-error">
                        {errors.country_id}
                      </small>
                    )}
                  </div>

                  <div className="field col-3 md:col-3">
                    {props.values.country_id && (
                      <>
                        <Dropdown
                          value={props.values.city_id}
                          options={
                            cachedRegions(regions).find(
                              (r) => r.id === props.values.country_id
                            )?.children ?? []
                          }
                          onChange={(e) =>
                            props.setFieldValue("city_id", e.value)
                          }
                          optionLabel="label"
                          placeholder="Select City"
                          optionValue="id"
                        />
                        {errors?.city_id && (
                          <small id="username-help" className="p-error">
                            {errors.city_id}
                          </small>
                        )}
                      </>
                    )}
                  </div>

                  <div className="field col-2 md:col-2">
                    <Dropdown
                      value={props.values.gender}
                      options={[
                        {
                          id: "man",
                          title: "man",
                        },
                        {
                          id: "woman",
                          title: "Woman",
                        },
                      ]}
                      onChange={(e) => props.setFieldValue("gender", e.value)}
                      optionLabel="title"
                      placeholder="Select Gender"
                      optionValue="id"
                    />
                    {errors?.gender && (
                      <small id="username-help" className="p-error">
                        {errors.gender}
                      </small>
                    )}
                  </div>

                  <div className="field col-2 md:col-2">
                    <ImageUpload
                      src={
                        profileImage
                          ? URL.createObjectURL(profileImage)
                          : props.values.profile_image
                      }
                      onChange={(e) => setProfileImage(e.target.files[0])}
                      error={errors?.profile_image}
                    />
                  </div>

                  <div className="field col-2 md:col-2">
                    <label htmlFor="">Is Active</label>
                    <br />
                    <InputSwitch
                      checked={props.values.is_active}
                      onChange={(e) =>
                        props.setFieldValue("is_active", e.value)
                      }
                    />

                    {errors?.is_active && (
                      <small id="username-help" className="p-error">
                        {errors.is_active}
                      </small>
                    )}
                  </div>

                  <Button type="submit" label="Save" className="flex-start" />
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
