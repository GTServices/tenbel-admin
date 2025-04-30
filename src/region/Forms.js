import React, {Fragment, useState, useEffect, useRef, useCallback} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import RegionService from "./region.service";
import {Button} from "primereact/button";
import {useParams} from "react-router-dom";
import "./add-edit.scss";
import {Toast} from "primereact/toast";
import {useNavigate} from "react-router-dom";
import {TreeSelect} from "primereact/treeselect";
import {TabView, TabPanel} from "primereact/tabview";
import {useSelector} from "react-redux";
import {Dropdown} from "primereact/dropdown";
import {routeUrl} from "../common/utils/helpers";
import routes from "./routes";
import LangTitle from "../common/components/langTitle/LangTitle";

const Forms = () => {
    const params = useParams();
    const id = Number(params?.id);
    const isAddMode = !id;
    const toast = useRef(null);
    const [errors, setErrors] = useState(null);
    const [regions, setRegions] = useState([]);
    const [selectedRegionKey, setSelectedRegionKey] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const {langs} = useSelector((state) => state.langs);
    let navigate = useNavigate();
    const [state, setState] = useState({});
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);

    const getRegions = async () => {
        try {
            const response = await RegionService.getRegions();
            setRegions([{data: {id: null, title: null}}, ...response.data]);
        } catch (e) {
            console.log(e.message);
        }
    };

    const handleRegions = useCallback((elements) => {
        return (elements || []).map(data => ({...data, label: data.data.title, data: data.data.id, children: handleRegions(data.children)}))
    }, [regions]);

    const getTypes = async () => {
        try {
            const response = await RegionService.getTypes();
            if (!response) {
                return false;
            }

            setTypes(response);
        } catch (e) {
            console.log(e.message,);
        }
    };

    const selectTypeList = useCallback(() => {
        return Object.keys(types).map((id) => {
            return {
                id: id.toString(),
                title: types[id],
            };
        });
    }, [types]);

    useEffect(() => {
        if (id) {
            getRegion();
        }
        getRegions();
        getTypes();
    }, []);

    const getRegion = async () => {
        const response = await RegionService.getRegion(id);
        setState(response.data);
        setSelectedRegionKey(response.data.data.parent_id ?? null);
        setSelectedType(response.data.data.type)
    };

    useEffect(() => {
        if (!isAddMode) {
            getRegions();
        }
    }, [id, isAddMode]); // eslint-disable-line react-hooks/exhaustive-deps


    const onFormSubmit = () => {
        let postData = {
            ...state.data,
            type: selectedType,
            parent_id: "",
        };
        if (selectedRegionKey) {
            postData = {
                ...postData,
                parent_id: selectedRegionKey,
            };
        }
        isAddMode ? store(postData) : update(postData);
    };

    const store = async (postData) => {
        const response = await RegionService.storeRegion(postData);
        if (response.success) {
            navigate(routeUrl(routes, "region.index"));
        } else if (response.errors) {
            setErrors(response.errors);
        }
    };

    const update = async (postData) => {
        postData["_method"] = "PUT";
        const response = await RegionService.updateRegion(postData, id);
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
            setState({
                ...state, data: {
                    ...state.data,
                    [lang]: {[name]: value}
                }
            });
        }

        if (!lang) {
            setState({...state, [name]: value});
        }
    };

    const onTypeChange = (e) => {
        setSelectedType(e.value);
    };


    return (
        <Fragment>
            <Toast ref={toast}/>
            <Breadcrumb
                items={[
                    {label: "Regions", url: routeUrl(routes, 'region.index')},
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
                                                    value={state?.data?.[lang]?.title ?? ""}
                                                    onChange={(e) => handleChange(e, lang)}
                                                    className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                                />
                                                {errors?.[`${lang}.title`] && <small className="p-error">{errors?.[`${lang}.title`]}</small>}
                                            </div>
                                            <div className="field col">
                                                <label htmlFor="lastname2">Regions</label>
                                                <TreeSelect

                                                    value={selectedRegionKey}
                                                    options={handleRegions(regions)}
                                                    onChange={(e) => setSelectedRegionKey(e.value)}
                                                    placeholder="Select Item"
                                                    className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"

                                                ></TreeSelect>
                                            </div>

                                            <div className="field col">
                                                <label htmlFor="man">Type</label>
                                                <br/>
                                                <Dropdown
                                                    value={selectedType?.toString()}
                                                    options={selectTypeList()}
                                                    onChange={onTypeChange}
                                                    optionLabel="title"
                                                    placeholder="Select a Type"
                                                    optionValue="id"
                                                />

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
