import React, {Fragment, useState, useEffect} from "react";
import PackageGroupService from "./packageGroup.service";
import {Button} from "primereact/button";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {TabView, TabPanel} from "primereact/tabview";
import {useSelector} from "react-redux";
import {routeUrl} from "../../common/utils/helpers";
import routes from "./routes";
import {toast} from "../../routes";
import LangTitle from "../../common/components/langTitle/LangTitle";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import {InputSwitch} from "primereact/inputswitch";

const Forms = () => {
    const params = useParams();
    const id = Number(params?.id);
    const isAddMode = !id;
    const [errors, setErrors] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const {langs} = useSelector((state) => state.langs);
    let navigate = useNavigate();
    const [state, setState] = useState({});

    const getData = async () => {
        const response = await PackageGroupService.get(id);
        if (!response) {
            return false;
        }
        setState(response.data);
    };

    useEffect(() => {
        if (!isAddMode) {
            getData(id);
        }
    }, [id, isAddMode]);

    const onFormSubmit = () => {
        let postData = {
            ...state,
            is_active: state.is_active ? 1 : 0
        };
        isAddMode ? store(postData) : update(postData);
    };

    const store = async (postData) => {
        const response = await PackageGroupService.store(postData);
        if (response.success) {
            navigate(routeUrl(routes, 'package-group.index'));
        } else if (response.errors) {
            setErrors(response.errors);
        }
    };

    const update = async (postData) => {
        postData["_method"] = "PUT";
        const response = await PackageGroupService.update(postData, id);
        if (response.success) {
            toast.current.show({
                severity: "success",
                summary: "Success Message",
                detail: "Data updated",
                life: 3000,
            });
            setErrors({});
        } else if (response.errors) {
            setErrors(response.errors);
        }
    };

    const handleChange = (event, lang) => {
        const name = event.target.name;
        const value = event.target.value;

        if (lang) {
            setState({...state, [lang]: {[name]: value}});
        }else{
            setState({...state, [name]: value});
        }
    };

    return (
        <Fragment>
            <Breadcrumb
                items={[
                    {label: "Package groups", url: routeUrl(routes, 'package-group.index')},
                    {
                        label: isAddMode ? "Add" : id,
                    },
                ]}
            />
            <section className="user">
                <div className="card">
                    <div className="grid">
                        <div className="col-8">
                            <TabView
                                activeIndex={activeIndex}
                                onTabChange={(e) => setActiveIndex(e.index)}
                            >
                                {langs &&
                                    langs.map((lang, i) => (
                                        <TabPanel key={i} header={<LangTitle title={lang} error={errors?.[`${lang}.title`]}/>}>
                                            <div className="card">
                                                <div className="formgrid grid">
                                                    <div className="field col">
                                                        <label htmlFor="title">Title</label>
                                                        <input
                                                            id="title"
                                                            type="text"
                                                            name="title"
                                                            value={state?.[lang]?.title ?? ""}
                                                            onChange={(e) => handleChange(e, lang)}
                                                            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                                        />
                                                        {errors?.[`${lang}.title`] && <small className="p-error">{errors?.[`${lang}.title`]}</small>}
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                    ))}
                            </TabView>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-3">
                            <label htmlFor="">Active</label>
                            <br/>
                            <InputSwitch checked={state?.is_active} name={'is_active'} onChange={(e) => handleChange(e)}/>
                            <br/>
                            {errors?.is_active && <small id="username-help" className="p-error">
                                {errors.is_active}
                            </small>}
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={onFormSubmit}
                        label="Save"
                        className="flex-start"
                    />
                </div>
            </section>
        </Fragment>
    );
};

export default Forms;
