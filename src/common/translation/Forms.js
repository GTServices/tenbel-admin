import React, {Fragment, useState, useEffect, useRef} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import TranslationService from "./translation.service";
import {Button} from "primereact/button";
import {useNavigate, useParams} from "react-router-dom";
import "./form.scss";
import {toast} from "../../routes";
import {boolToInt, routeUrl, typeToValue} from "../utils/helpers";
import routes from "./routes";
import {InputSwitch} from "primereact/inputswitch";
import {useSelector} from "react-redux";
import {TabPanel, TabView} from "primereact/tabview";
import LangTitle from "../components/langTitle/LangTitle";
import ImageUpload from "../components/imageUpload/ImageUpload";

const Forms = () => {
    const params = useParams();
    const id = Number(params?.id);
    const {langs} = useSelector((state) => state.langs);
    const isAddMode = !id;
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [item, setItem] = useState({});
    let navigate = useNavigate();

    const getData = async () => {
        setIsLoading(true);
        const response = await TranslationService.get(id);
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
        formData.append("key", item.key);
        id ? update(formData) : store(formData);
    }

    const mapTranslations = (formData) => {
        langs.map(lang => {
            formData.append(`${lang}[value]`, item?.[lang]?.['value'] ?? "");
        });
        return formData;
    }


    const store = async (formData) => {
        const response = await TranslationService.store(formData);
        if (response.success) {
            navigate(routeUrl(routes, 'translation.index'));
        } else if (response.errors) {
            setErrors(response.errors);
        }
    };

    const update = async (formData) => {

        formData.append("_method", "PUT");

        const response = await TranslationService.update(formData, id);
        if (response.success) {
            setErrors({});
            toast.current.show({
                severity: "success",
                summary: "Success Message",
                detail: "Translation updated",
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
                    {label: "Posts", url: routeUrl(routes, 'translation.index')},
                    {
                        label: isAddMode ? "Add" : id,
                    },
                ]}
            />
            <section className="user">
                <div className="card">
                    <div className="grid flex flex-wrap align-items-end">
                        <div className="col-6">
                            <TabView
                                activeIndex={activeIndex}
                                onTabChange={(e) => setActiveIndex(e.index)}
                            >
                                {langs && !isLoading && langs.map((lang, i) => (
                                    <TabPanel key={i} header={<LangTitle title={lang} error={errors?.[`${lang}.value`]}/>}>
                                        <div className="card">
                                            <div className="formgrid grid">
                                                <div className="col">
                                                    <label htmlFor="value">Title</label>
                                                    <input
                                                        id="value"
                                                        type="text"
                                                        name="value"
                                                        value={item?.[lang]?.value ?? ""}
                                                        onChange={(e) => handleChange(e, lang)}
                                                        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                                    />
                                                    {errors?.[`${lang}.value`] && <small className="p-error">{errors?.[`${lang}.value`]}</small>}
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                ))}
                            </TabView>
                        </div>
                        <div className="col">
                            <label htmlFor="key">Key</label>
                            <input
                                id="key"
                                type="text"
                                name="key"
                                value={item?.key ?? ""}
                                onChange={(e) => handleChange(e)}
                                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                            />
                            {errors?.key && <small className="p-error">{errors?.key}</small>}
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
