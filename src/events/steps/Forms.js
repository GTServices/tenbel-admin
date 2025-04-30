import React, {Fragment, useState, useEffect, useRef, useCallback} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import StepService from "./step.service";
import {Button} from "primereact/button";
import {useParams} from "react-router-dom";
import "./add-edit.scss";
import {Toast} from "primereact/toast";
import {useNavigate} from "react-router-dom";
import {TreeSelect} from "primereact/treeselect";
import stepService from "./step.service";
import {TabView, TabPanel} from "primereact/tabview";
import {useSelector} from "react-redux";
import {routeUrl} from "../../common/utils/helpers";
import routes from "./routes";
import {Dropdown} from "primereact/dropdown";
import {InputSwitch} from "primereact/inputswitch";
import LangTitle from "../../common/components/langTitle/LangTitle";

const Forms = () => {
    const params = useParams();
    const id = Number(params?.id);
    const isAddMode = !id;
    const toast = useRef(null);
    const [errors, setErrors] = useState(null);
    const [nodes, setNodes] = useState(null);
    const [selectedNodeKey, setSelectedNodeKey] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const {langs} = useSelector((state) => state.langs);
    let navigate = useNavigate();
    const [state, setState] = useState({});
    const [showInStatus, setShowInStatus] = useState(false);

    const modifyDatas = (steps) => {
        return steps.map((step) => {
            const parent_id = step.parent_id ? step.parent_id : 0;

            return {
                key: parent_id + "-" + step.id,
                label: step.title,
                data: step.title,
                children: step.children.length === 0 ? [] : modifyDatas(step.children),
            };
        });
    };

    const getSteps = async () => {
        const steps = await stepService.getSteps();
        if (steps !== false) {
            setNodes(steps.data);
        }
    }

    useEffect(() => {
        getSteps();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!isAddMode) {
            getStep();
        }
    }, [id, isAddMode]);

    const getStep = async () => {
        const response = await StepService.getStep(id);
        if (!response) {
            return false;
        }
        setState(response.data);
        setShowInStatus(response.data.show_in_status);
        setSelectedNodeKey(response.data.parent_id);
    }

    const onFormSubmit = () => {
        let parent_id;
        if (selectedNodeKey === null) {
            parent_id = 0;
        } else {
            parent_id = selectedNodeKey
        }

        let postData = state;
        if (parent_id) {
            postData = {
                ...state,
                parent_id,
            };
        }

        postData["show_in_status"] = showInStatus ? 1 : 0;
        isAddMode ? store(postData) : update(postData);
    };

    const store = async (postData) => {
        const response = await StepService.storeStep(postData);
        if (response.success) {
            toast.current.show({
                severity: "success",
                summary: "Succes Message",
                detail: "Data is added",
                life: 3000,
            });
            navigate(routeUrl(routes, "step.index"));
        } else if (response.errors) {
            setErrors(response.errors);
        }
    };

    const update = async (postData) => {
        postData["_method"] = "PUT";
        const response = await StepService.updateStep(postData, id);
        if (response.success) {
            toast.current.show({
                severity: "success",
                summary: "Succes Message",
                detail: "Data is updated",
                life: 3000,
            });
        } else if (response.errors) {
            setErrors(response.errors);
        }
    };

    const handleChange = (event, lang) => {
        const name = event.target.name;
        const value = event.target.value;

        if (lang) {
            setState({...state, [lang]: {[name]: value}});
        }

        if (!lang) {
            setState({...state, [name]: value});
        }
    };

    const handleSteps = useCallback((elements) => {
        return (elements || []).map(data => ({...data, label: data.title, data: data.id, children: handleSteps(data.children)}))
    }, [nodes]);

    return (
        <Fragment>
            <Toast ref={toast}/>
            <Breadcrumb
                items={[
                    {label: "Steps", url: routeUrl(routes, 'step.index')},
                    {
                        label: isAddMode ? "Add" : id,
                    },
                ]}
            />
            <section className="user">
                <div className="card">
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
                                            <div className="field col">
                                                <label htmlFor="lastname2">Parent</label>

                                                <TreeSelect
                                                    value={selectedNodeKey}
                                                    options={handleSteps(nodes)}
                                                    onChange={(e) => setSelectedNodeKey(e.value)}
                                                    placeholder="Select Item"
                                                    className="text-base text-color surface-overlay border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                                ></TreeSelect>
                                            </div>

                                            <div className="field col-2">
                                                <label htmlFor="">Gender</label>
                                                <br/>
                                                <Dropdown
                                                    value={state.gender}
                                                    options={[
                                                        {
                                                            id: "man",
                                                            title: "Man"
                                                        },
                                                        {
                                                            id: "woman",
                                                            title: "Woman"
                                                        },
                                                        {
                                                            id: "all",
                                                            title: "All"
                                                        }
                                                    ]}
                                                    name={'gender'}
                                                    onChange={e => handleChange(e)}
                                                    optionLabel="title"
                                                    placeholder="Select Gender"
                                                    optionValue="id"
                                                />
                                                <br/>
                                                {errors?.gender && <small id="username-help" className="p-error">
                                                    {errors.gender}
                                                </small>}
                                            </div>

                                            <div className="field col">
                                                <label htmlFor="">Show in status</label>
                                                <br/>
                                                <InputSwitch checked={showInStatus} onChange={(e) => setShowInStatus(e.target.value)}/>

                                                {errors?.show_in_status && <small id="username-help" className="p-error">
                                                    {errors.show_in_status}
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
                                </TabPanel>
                            ))}
                    </TabView>
                </div>
            </section>
        </Fragment>
    );
};

export default Forms;
