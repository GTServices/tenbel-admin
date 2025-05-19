import React, {Fragment, useState, useEffect, useRef} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import PageService from "./page.service";
import {Button} from "primereact/button";
import {useNavigate, useParams} from "react-router-dom";
import "./form.scss";
import {toast} from "../routes";
import {boolToInt, routeUrl, typeToValue} from "../common/utils/helpers";
import routes from "./routes";
import {InputSwitch} from "primereact/inputswitch";
import {useSelector} from "react-redux";
import {TabPanel, TabView} from "primereact/tabview";
import LangTitle from "../common/components/langTitle/LangTitle";
import ImageUpload from "../common/components/imageUpload/ImageUpload";
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Dropdown} from "primereact/dropdown";
import CategoryService from "../events/category/category.service";

const Forms = () => {
    const params = useParams();
    const id = Number(params?.id);
    const {langs} = useSelector((state) => state.langs);
    const isAddMode = !id;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [item, setItem] = useState({});
    const [parents, setParents] = useState([]);
    const [image, setImage] = useState(null);
    const [selectedParent, setSelectedParent] = useState(null);
    let navigate = useNavigate();

    const getData = async () => {
        setIsLoading(true);
        const response = await PageService.get(id);
        if (!response) {
            return false;
        }
        setItem(response.data);
        setSelectedParent(response.data.parent_id);
        setIsLoading(false);
    };


    useEffect(() => {
        if (!isAddMode) {
            getData();
        }
    }, [id, isAddMode]);

    const getParents = async () => {
        const response = await PageService.parents();
        setParents(response.data.filter(page => page.id !== id));
    };

    useEffect(() => {
        getParents();
    }, []);


    const handleChange = (event, lang) => {
        const name = event.target.name;
        const value = event.target.value;

        if (lang) {
            setItem({...item, [lang]: {...(item?.[lang]), [name]: value}});
        }

        if (!lang) {
            setItem({...item, [name]: typeToValue(value)});
        }
    };


    const handleSave = () => {
        let formData = new FormData();
        formData = mapTranslations(formData);
        if (image) {
            formData.append("image", image);
        }
        formData.append("is_active", boolToInt(item.is_active));
        formData.append("parent_id", selectedParent ?? "");
        id ? update(formData) : store(formData);
    }

    const mapTranslations = (formData) => {
        langs.map(lang => {
            formData.append(`${lang}[title]`, item?.[lang]?.['title'] ?? "");
            formData.append(`${lang}[description]`, item?.[lang]?.['description'] ?? "");
            formData.append(`${lang}[slug]`, item?.[lang]?.['slug'] ?? "");
        });
        return formData;
    }


    const store = async (formData) => {
        const response = await PageService.store(formData);
        if (response.success) {
            navigate(routeUrl(routes, 'page.index'));
        } else if (response.errors) {
            setErrors(response.errors);
        }
    };

    const update = async (formData) => {

        formData.append("_method", "PUT");

        const response = await PageService.update(formData, id);
        if (response.success) {
            setErrors({});
            toast.current.show({
                severity: "success",
                summary: "Success Message",
                detail: "Page updated",
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
                    {label: "Pages", url: routeUrl(routes, 'page.index')},
                    {
                        label: isAddMode ? "Add" : id,
                    },
                ]}
            />
            <section className="user">
                <div className="card">
                    <div className="grid flex flex-wrap">
                        <div className="col-12">
                            <TabView
                                activeIndex={activeIndex}
                                onTabChange={(e) => setActiveIndex(e.index)}
                            >
                                {langs && !isLoading && langs.map((lang, i) => (
                                    <TabPanel key={i} header={<LangTitle title={lang} error={errors?.[`${lang}.title`] ?? errors?.[`${lang}.desc`] ?? errors?.[`${lang}.slug`]}/>}>
                                        <div className="card">
                                            <div className="formgrid grid">
                                                <div className="col">
                                                    <label htmlFor="title">Title</label>
                                                    <input
                                                        id="title"
                                                        type="text"
                                                        name="title"
                                                        value={item?.[lang]?.title ?? ""}
                                                        onChange={(e) => handleChange(e, lang)}
                                                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                                    />
                                                    {errors?.[`${lang}.title`] && <small className="p-error">{errors?.[`${lang}.title`]}</small>}
                                                </div>
                                                <div className="col">
                                                    <label htmlFor="title">Slug</label>
                                                    <input
                                                        id="slug"
                                                        type="text"
                                                        name="slug"
                                                        value={item?.[lang]?.slug ?? ""}
                                                        onChange={(e) => handleChange(e, lang)}
                                                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                                    />
                                                    {errors?.[`${lang}.slug`] && <small className="p-error">{errors?.[`${lang}.slug`]}</small>}
                                                </div>
                                                <div className="col-12 xl:col-7">
                                                    <label htmlFor="title">Description</label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={item?.[lang]?.description ?? ""}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            if (data !== item[lang]?.description) {
                                                                handleChange({
                                                                    target: {
                                                                        name: "description",
                                                                        value: data
                                                                    }
                                                                }, lang);
                                                            }
                                                        }}
                                                    />
                                                    {errors?.[`${lang}.description`] && <small className="p-error">{errors?.[`${lang}.description`]}</small>}
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                ))}
                            </TabView>
                        </div>

                        <div className="field col-2">
                                    <span className="p-float-label">
                                      <Dropdown
                                          value={selectedParent}
                                          options={parents}
                                          onChange={(e) => setSelectedParent(e.value)}
                                          optionLabel="title"
                                          placeholder="Select parent"
                                          optionValue="id"
                                          showClear
                                      />

                                      <label htmlFor="inputtext">Parent</label>
                                    </span>
                            {errors?.parent_id && <small id="username-help" className="p-error">
                                {errors.parent_id}
                            </small>}
                        </div>

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

                        <div className="col-2">
                            <label htmlFor="">Active</label>
                            <br/>
                            <InputSwitch checked={item?.is_active == 1 || item?.is_active === true || item?.is_active === "1"} name={'is_active'} onChange={(e) => handleChange(e)}/>

                            {errors?.is_active && <small id="username-help" className="p-error">
                                {errors.is_active}
                            </small>}
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
