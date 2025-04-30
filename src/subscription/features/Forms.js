import {InputText} from "primereact/inputtext";
import React, {useEffect, useState} from "react";
import {Calendar} from "primereact/calendar";
import {InputSwitch} from "primereact/inputswitch";
import {boolToInt, stringToDate, typeToValue} from "../../common/utils/helpers";
import FeatureService from './features.service';
import {Loading} from "../../common/components/loading/Loading";
import {Dropdown} from "primereact/dropdown";
import Constants from '../../common/utils/constants';

export default function Forms({id}) {
    const initialData = {
        package_id: id,
        feature_type: "",
        count: "",
        sort_order: 0,
        is_active: 0
    };
    const [loading, setLoading] = useState({
        add: false,
        all: false,
        update: [],
        delete: []
    });
    const [errors, setErrors] = useState({});
    const [errorsUpdate, setErrorsUpdate] = useState([]);
    const [features, setFeatures] = useState([]);
    const [initialFeature, setInitialFeature] = useState({...initialData});

    useEffect(() => {
        getFeatures(id);
    }, []);

    const getFeatures = async (id) => {
        setLoading({
            ...loading,
            all: true
        });
        const response = await FeatureService.getFeatures(id);
        setLoading({
            ...loading,
            all: false
        });
        if (!response) {
            return false;
        }
        setFeatures(response.data);
    }

    const handleChange = (event, type = null) => {
        const val = typeToValue(event.target.value, type);
        setInitialFeature({
            ...initialFeature,
            [event.target.name]: val
        });
    }

    const handleChangeUpdate = (event, index, type = null) => {
        const newData = [...features];
        newData[index][event.target.name] = typeToValue(event.target.value, type);
        setFeatures(newData);
    }
    const addElement = async () => {
        if (loading?.add) {
            return false;
        }

        setLoading({
            ...loading,
            add: true
        });
        const response = await FeatureService.storeFeature({
            ...initialFeature,
            is_active: initialFeature.is_active ? 1 : 0
        });
        if (response.success) {
            getFeatures(id);
            setInitialFeature({...initialData});
            setErrors({});
        } else if (response.errors) {
            setErrors(response.errors);
        }
        setLoading({
            ...loading,
            add: false
        });
    }

    const deleteElement = async (index) => {
        if (loading?.delete?.[index]) {
            return false;
        }
        setLoading({
            ...loading,
            delete: {
                ...loading.delete,
                [index]: true
            }
        });
        await FeatureService.deleteFeature(features[index]?.id);
        getFeatures(id);
        setLoading({
            ...loading,
            delete: {
                ...loading.delete,
                [index]: false
            }
        })
    }

    const updateElement = async (index) => {
        if (loading?.update?.[index]) {
            return false;
        }

        setLoading({
            ...loading,
            update: {
                ...loading.update,
                [index]: true
            }
        });
        const element = {...features[index], "_method": "PUT", is_active: boolToInt(features[index]['is_active'])};
        const response = await FeatureService.updateFeature(element, element.id);
        if (response.success) {
            getFeatures(id);
            setErrorsUpdate({});
        } else if (response.errors) {
            setErrorsUpdate({
                ...errorsUpdate,
                [index]: response.errors
            });
        }
        setLoading({
            ...loading,
            update: {
                ...loading.update,
                [index]: false
            }
        })

    }



    return <>
        <h2>Features</h2>
        <hr/>
        <div className="event-elements small-elements">
            <div className="event-element flex align-items-start my-2">
                <div className="flex align-items-start">
                    <div className="mx-1">
                        <label htmlFor="">
                            Feature type
                        </label>
                        <Dropdown
                            options={Constants.featureTypes}
                            value={initialFeature.feature_type}
                            className="p-input-te"
                            name={'feature_type'}
                            optionValue="id"
                            optionLabel="title"
                            placeholder="Feature type"
                            onChange={handleChange}
                        />
                        {errors?.feature_type && <small className="text-red-500 small-text">
                            {errors.feature_type}
                        </small>}
                    </div>
                    <div className="mx-1">
                        <label htmlFor="">
                            Count
                        </label>
                        <InputText
                            style={{width: "100px"}}
                            value={initialFeature.count}
                            name={'count'}
                            className="p-inputtext-sm block"
                            placeholder="count"
                            onChange={handleChange}
                        />
                        {errors.count && <small className="text-red-500 small-text">{errors.count}</small>}
                    </div>
                    <div className="mx-1">
                        <label htmlFor="">Is active</label>
                        <br/>
                        <InputSwitch
                            className="mx-2"
                            checked={initialFeature.is_active}
                            name="is_active"
                            onChange={event => handleChange(event)}
                        />
                    </div>
                </div>
                <div style={{height: "80px"}} className="flex align-items-center">
                    <button onClick={addElement} className="p-button p-button-sm">{loading?.add ? <Loading/> : <span>add</span>}</button>
                </div>
            </div>
        </div>
        <div className="event-elements small-elements">
            {features.map((item, index) => (
                <div key={item.id} className="item-element flex align-items-start my-2">
                    <div className="flex align-items-center">
                        <div className="mx-1">
                           <label htmlFor="">
                                Feature type
                            </label>
                            <Dropdown
                                options={Constants.featureTypes}
                                value={item.feature_type}
                                className="p-input-te"
                                name={'feature_type'}
                                optionValue="id"
                                optionLabel="title"
                                placeholder="Feature type"
                                onChange={item => handleChangeUpdate(item, index)}
                            />
                            {errorsUpdate?.[index]?.feature_type && <small className="text-red-500 small-text">{errorsUpdate?.[index]?.feature_type}</small>}
                        </div>
                        <div className="mx-1">
                            <label htmlFor="">
                                Count
                            </label>
                            <InputText
                                style={{width: "100px"}}
                                value={item.count}
                                name={'count'}
                                className="p-inputtext-sm block"
                                placeholder="count"
                                onChange={item => handleChangeUpdate(item, index)}
                            />
                            {errorsUpdate?.[index]?.count && <small className="text-red-500 small-text">{errorsUpdate?.[index]?.count}</small>}
                        </div>
                        <div className="mx-1">
                            <label htmlFor="">Is active</label>
                            <br/>
                            <InputSwitch
                                className="mx-2"
                                checked={item.is_active}
                                name="is_active"
                                onChange={item => handleChangeUpdate(item, index)}
                            />
                        </div>
                    </div>
                    <div style={{height: "80px"}} className="flex align-items-center">
                        <button onClick={() => updateElement(index)} className="p-button p-button-sm">{loading?.update?.[index] ? <Loading/> : <span>Update</span>}</button>
                        <button onClick={() => deleteElement(index)} style={{width: "40px"}} className="p-button p-button-sm p-button-danger mx-2 d-flex justify-content-center">{loading?.delete?.[index] ? <Loading/> : <i className="pi pi-delete-left"></i>}</button>
                    </div>
                </div>
            ))}
        </div>
    </>
}