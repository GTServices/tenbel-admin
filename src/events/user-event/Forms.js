import {InputText} from "primereact/inputtext";
import {useEffect, useState} from "react";
import {Calendar} from "primereact/calendar";
import {InputSwitch} from "primereact/inputswitch";
import {boolToInt, stringToDate, typeToValue} from "../../common/utils/helpers";
import userEventService from './userEvent.service';
import {Loading} from "../../common/components/loading/Loading";

export default function Forms({id}) {
    const initialData = {
        relation_id: id,
        title: "",
        start_date: "",
        min_amount: "",
        max_amount: "",
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
    const [events, setEvents] = useState([]);
    const [initialEvent, setInitialEvent] = useState({...initialData});

    useEffect(() => {
        getUserEvents(id);
    }, []);

    const getUserEvents = async (id) => {
        setLoading({
            ...loading,
            all: true
        });
        const response = await userEventService.getUserEvents(id);
        setLoading({
            ...loading,
            all: false
        });
        if (!response) {
            return false;
        }
        setEvents(response.data);
    }

    const handleChange = (event, type = null) => {
        const val = typeToValue(event.target.value, type);
        setInitialEvent({
            ...initialEvent,
            [event.target.name]: val
        });
    }

    const handleChangeUpdate = (event, index, type = null) => {
        const newEvents = [...events];
        newEvents[index][event.target.name] = typeToValue(event.target.value, type);
        setEvents(newEvents);
    }
    const addElement = async () => {
        if (loading?.add) {
            return false;
        }

        setLoading({
            ...loading,
            add: true
        });
        const response = await userEventService.storeUserEvent({
            ...initialEvent,
            is_active: initialEvent.is_active ? 1 : 0
        });
        if (response.success) {
            getUserEvents(id);
            setInitialEvent({...initialData});
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
        await userEventService.deleteUserEvent(events[index]?.id);
        getUserEvents(id);
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
        const element = {...events[index], "_method": "PUT", is_active: boolToInt(events[index]['is_active'])};
        const response = await userEventService.updateUserEvent(element, element.id);
        if (response.success) {
            getUserEvents(id);
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
        <h2>Events</h2>
        <hr/>
        <div className="event-elements small-elements">
            <div className="event-element flex align-items-start my-2">
                <div className="flex align-items-start">
                    <div className="mx-1">
                        <label htmlFor="">Title</label>
                        <InputText
                            style={{maxWidth: "200px"}}
                            name={'title'}
                            onChange={handleChange}
                            value={initialEvent.title}
                            className="p-inputtext-sm block"
                            placeholder="title"
                        />
                        {errors.title && <small className="text-red-500 small-text">{errors.title}</small>}
                    </div>
                    <div className="mx-1">
                        <label htmlFor="">Start date</label>
                        <Calendar
                            value={stringToDate(initialEvent.start_date)}
                            style={{minWidth: '150px'}}
                            placeholder="start date"
                            name="start_date"
                            onChange={(event) => handleChange(event, "date")}
                        />
                        {errors.start_date && <small className="text-red-500 small-text">{errors.start_date}</small>}
                    </div>
                    <div className="mx-1">
                        <label htmlFor="">
                            Min amount
                        </label>
                        <InputText
                            style={{width: "100px"}}
                            value={initialEvent.min_amount}
                            name={'min_amount'}
                            className="p-inputtext-sm block"
                            placeholder="min amount"
                            onChange={handleChange}
                        />
                        {errors.min_amount && <small className="text-red-500 small-text">{errors.min_amount}</small>}
                    </div>
                    <div className="mx-1">
                        <label htmlFor="">
                            Max amount
                        </label>
                        <InputText
                            style={{width: "100px"}}
                            value={initialEvent.max_amount}
                            name={'max_amount'}
                            className="p-inputtext-sm block"
                            placeholder="max amount"
                            onChange={handleChange}
                        />
                        {errors.max_amount && <small className="text-red-500 small-text">{errors.max_amount}</small>}
                    </div>
                    <div className="mx-1">
                        <label htmlFor="">Is active</label>
                        <br/>
                        <InputSwitch
                            className="mx-2"
                            checked={initialEvent.is_active}
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
            {events.map((event, index) => (
                <div key={event.id} className="event-element flex align-items-start my-2">
                    <div className="flex align-items-center">
                        <div className="mx-1">
                            <label htmlFor="">Title</label>
                            <InputText
                                style={{maxWidth: "200px"}}
                                name={'title'}
                                onChange={event => handleChangeUpdate(event, index)}
                                value={event.title}
                                className="p-inputtext-sm block"
                                placeholder="title"
                            />
                            {errorsUpdate?.[index]?.title && <small className="text-red-500 small-text">{errorsUpdate?.[index]?.title}</small>}
                        </div>
                        <div className="mx-1">
                            <label htmlFor="">Start date</label>
                            <Calendar
                                value={stringToDate(event.start_date)}
                                style={{minWidth: '150px'}}
                                placeholder="start date"
                                name="start_date"
                                onChange={event => handleChangeUpdate(event, index, "date")}
                            />
                            {errorsUpdate?.[index]?.start_date && <small className="text-red-500 small-text">{errorsUpdate?.[index]?.start_date}</small>}
                        </div>
                        <div className="mx-1">
                            <label htmlFor="">
                                Min amount
                            </label>
                            <InputText
                                style={{width: "100px"}}
                                value={event.min_amount ?? ""}
                                name={'min_amount'}
                                className="p-inputtext-sm block"
                                placeholder="min amount"
                                onChange={event => handleChangeUpdate(event, index)}
                            />
                            {errorsUpdate?.[index]?.min_amount && <small className="text-red-500 small-text">{errorsUpdate?.[index]?.min_amount}</small>}
                        </div>
                        <div className="mx-1">
                            <label htmlFor="">
                                Max amount
                            </label>
                            <InputText
                                style={{width: "100px"}}
                                value={event.max_amount ?? ""}
                                name={'max_amount'}
                                className="p-inputtext-sm block"
                                placeholder="max amount"
                                onChange={event => handleChangeUpdate(event, index)}
                            />
                            {errorsUpdate?.[index]?.max_amount && <small className="text-red-500 small-text">{errorsUpdate?.[index]?.max_amount}</small>}
                        </div>
                        <div className="mx-1">
                            <label htmlFor="">Is active</label>
                            <br/>
                            <InputSwitch
                                className="mx-2"
                                checked={event.is_active}
                                name="is_active"
                                onChange={event => handleChangeUpdate(event, index)}
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