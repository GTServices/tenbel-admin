import React, {Fragment, useCallback, useEffect, useRef, useState} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import "./relation.scss";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import service from "./userRelation.service";
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {Dialog} from "primereact/dialog";
import {toast} from "../../routes";
import {AutoComplete} from "primereact/autocomplete";
import UserService from "../../user/user.service";
import {InputSwitch} from "primereact/inputswitch";
import TableAction from "../../common/components/tableAction/TableAction";
import {Dropdown} from "primereact/dropdown";
import constants from "../../common/utils/constants";
import {Calendar} from "primereact/calendar";
import {boolToInt, stringToDate, typeToValue} from "../../common/utils/helpers";
import {TreeSelect} from "primereact/treeselect";
import stepService from "../steps/step.service";
import groupService from "../user-group/group.service";
import RegionService from "../../region/region.service";
import {InputTextarea} from "primereact/inputtextarea";
import UserEvents from '../user-event/Forms';

const Index = () => {
    let emptyData = {
        id: null,
        name: "",
        surname: "",
        gender: "",
        birthday: "",
        user_id: "",
        step_id: "",
        group_id: "",
        countr_id: "",
        city_id: "",
        interestings: "",
        description: "",
        is_active: 0,
    };
    const [items, setItems] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [steps, setSteps] = useState(null);
    const [groups, setGroups] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedStep, setSelectedStep] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [regions, setRegions] = useState([]);
    const [errors, setErrors] = useState({});
    const [item, setItem] = useState({...emptyData});

    const deleteGroup = async (id) => {
        try {
            await service.delete(id);
            getAll();
            toast.current.show({
                severity: "success",
                summary: "Success Message",
                detail: "Item is deleted",
                life: 3000,
            });
        } catch (e) {
            toast.current.show({
                severity: "error",
                summary: "Error Message",
                detail: "Data is not deleted",
                life: 3000,
            });
        }
    };

    const getAll = async () => {
        const response = await service.all();
        if (!response) {
            return false;
        }
        setItems(response.data);
    };

    const selectUser = (id, data = null) => {
        const element = [...(data ? data : filteredUsers)].find(user => {
            return user.id.toString() === id.toString();
        })
        setSelectedUser(element);
    }

    const editGroup = async (item) => {
        const response = await service.get(item.id);
        setItem({...response.data});
        selectUser(response.data.user_id);
        getUsers(null, response.data.user_id);
        getExtraData();
        setSelectedStep(response.data.step_id);
        setSelectedGroup(response.data.group_id);
        setDialog(true);
    };


    useEffect(() => {
        getAll();
    }, []);

    const getSteps = async () => {
        const steps = await stepService.getSteps();
        if (steps !== false) {
            setSteps(steps.data);
        }
    }

    const getRegions = async () => {
        const response = await RegionService.getRegions();
        if (!response) {
            return false;
        }

        setRegions(response.data);
    };

    const getGroups = async () => {
        if (!selectedUser?.id) {
            return false;
        }
        const groups = await groupService.getGroupsByUser(selectedUser?.id);
        if (groups !== false) {
            setGroups(groups.data);
        }
    }

    useEffect(() => {
        getGroups();
        setItem({
            ...item,
            user_id: selectedUser?.id,
            group_id: ""
        })
    }, [selectedUser]);

    useEffect(() => {
        setItem({
            ...item,
            step_id: selectedStep,
        })
    }, [selectedStep]);


    useEffect(() => {
        setItem({
            ...item,
            group_id: selectedGroup,
        })
    }, [selectedGroup]);

    const getUsers = (event = null, user_id = null) => {
        UserService.getAllUsers({
            filters: {
                name: {value: event?.query ?? ""}
            },
            rows:1000
        }).then(response => {
            setFilteredUsers(response.data);
            const id = user_id || item.user_id;
            if (id) {
                selectUser(id, response.data);
            }
        });
    };

    const getExtraData = () => {
        getSteps();
        getRegions();
    }

    const openNew = async () => {
        getExtraData();
        setItem({...emptyData});
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setErrors({});
        setItem({...emptyData});
        setSubmitted(false);
        setDialog(false);
        setFilteredUsers([]);
        setSelectedUser(null);
        setSelectedStep(null);
        setSelectedGroup(null);
    };

    const saveItem = async () => {
        setSubmitted(true);

        if (item.id) {
            const response = await service.update({
                ...item,
                is_active: boolToInt(item.is_active)
            }, item.id);
            if (response.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: "Item Updated",
                    life: 3000,
                });
                getAll();
            } else if (response.errors) {
                setErrors(response.errors)
            }

        } else {
            const response = await service.store(item);
            if (response.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: "Item Created",
                    life: 3000,
                });
                getAll();
                setItem({...emptyData});
                hideDialog();
            } else if (response.errors) {
                setErrors(response.errors)
            }


        }
    };

    const dialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDialog}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={saveItem}
            />
        </React.Fragment>
    );

    const onInputChange = (e, name, type = null) => {
        const val = typeToValue(e.target.value, type);
        const _item = {
            ...item,
            [name]: val
        };
        if (type == "country") {
            _item['city_id'] = "";
        }
        setItem(_item);
    };

    const handleSteps = useCallback((elements) => {
        return (elements || []).map(data => ({...data, label: data.title, data: data.id, children: handleSteps(data.children)}))
    }, [steps]);

    const cachedRegions = useCallback((elements) => {
        return (elements || []).map(data => ({...data, label: data.data.title, id: data.data.id, children: cachedRegions(data.children)}))
    }, [regions])

    return (
        <Fragment>
            <Breadcrumb
                items={[{label: "User Relation"}]}
            />
            <section className="roles">
                <div className="datatable-editing-demo">
                    <div className="card p-fluid">
                        <Toolbar
                            className="mb-4"
                            left={
                                <Button
                                    label="New"
                                    icon="pi pi-plus"
                                    className="mr-2"
                                    onClick={openNew}
                                />
                            }
                        ></Toolbar>

                        <DataTable
                            value={items}
                            editMode="row"
                            dataKey="id"
                            responsiveLayout="scroll"
                        >
                            <Column field="id" header="Id" style={{width: "20px"}}></Column>

                            <Column
                                header="Full name"
                                body={row => `${row.name} ${row.surname}`}
                            ></Column>

                            <Column
                                field="step.title"
                                header="Step"
                            ></Column>

                            <Column
                                field="gender"
                                header="Gender"
                            ></Column>

                            <Column
                                field="birthday"
                                header="Birhtday"
                            ></Column>

                            <Column
                                field="is_active"
                                header="Active"
                            ></Column>


                            <Column
                                body={data => <TableAction data={data} name={'item'} deleteItem={id => deleteGroup(id)} editItem={() => editGroup(data)}/>}
                                exportable={false}
                                style={{minWidth: "8rem"}}
                            ></Column>
                        </DataTable>
                    </div>

                    {dialog && (
                        <Dialog
                            visible={dialog}
                            style={{width: "1200px"}}
                            header="User relation details"
                            modal
                            className="p-fluid"
                            footer={dialogFooter}
                            onHide={hideDialog}
                        >
                            <div className="formgrid grid">
                                <div className="field lg:col-3">
                                    <label htmlFor="name">Name</label>
                                    <InputText
                                        id="name"
                                        value={item.name}
                                        onChange={(e) => onInputChange(e, "name")}
                                        required
                                        autoFocus
                                    />
                                    {errors?.name && <small id="username-help" className="p-error">
                                        {errors.name}
                                    </small>}
                                </div>


                                <div className="field lg:col-3">
                                    <label htmlFor="name">Surname</label>
                                    <InputText
                                        id="name"
                                        value={item.surname}
                                        onChange={(e) => onInputChange(e, "surname")}
                                        required
                                        autoFocus
                                    />
                                    {errors?.surname && <small id="username-help" className="p-error">
                                        {errors.surname}
                                    </small>}
                                </div>

                                <div className="field lg:col-3">
                                    <label htmlFor="">Select gender</label>
                                    <Dropdown
                                        options={constants.genders.filter(g => g.id != 'all')}
                                        value={item.gender}
                                        className="p-input-te"
                                        name={'gender'}
                                        optionLabel="title"
                                        placeholder="gender"
                                        optionValue="id"
                                        onChange={(e) => onInputChange(e, "gender")}
                                    />
                                    {errors.gender && <small className="text-red-500 small-text">{errors.gender}</small>}
                                </div>

                                <div className="field lg:col-3">
                                    <label htmlFor="">Birthday</label>
                                    <Calendar
                                        value={stringToDate(item.birthday)}
                                        // style={{minWidth: '150px'}}
                                        placeholder="start date"
                                        name="birthday"
                                        onChange={(event) => onInputChange(event, "birthday", 'date')}
                                    />
                                    {errors.birthday && <small className="text-red-500 small-text">{errors.birthday}</small>}
                                </div>

                                <div className="field lg:col-3">

                                    <label htmlFor="name">User</label>
                                    <AutoComplete
                                        value={selectedUser}
                                        suggestions={filteredUsers}
                                        completeMethod={event => getUsers(event)}
                                        virtualScrollerOptions={{itemSize: 31}}
                                        field={data => `${data.name} ${data.surname}`}
                                        dropdown
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                    />
                                    {errors?.user_id && <small id="username-help" className="p-error">
                                        {errors.user_id}
                                    </small>}
                                </div>

                                <div className="field lg:col-3">
                                    <label htmlFor="">Select group {item.group_id}</label>
                                    <Dropdown
                                        options={groups}
                                        value={selectedGroup}
                                        className="p-input-te"
                                        name="group_id"
                                        optionLabel="title"
                                        placeholder="group"
                                        optionValue="id"
                                        onChange={(e) => setSelectedGroup(e.target.value)}
                                    />
                                    {errors.group_id && <small className="text-red-500 small-text">{errors.group_id}</small>}
                                </div>

                                <div className="field lg:col-3">
                                    <label htmlFor="lastname2">Step</label>

                                    <TreeSelect
                                        value={selectedStep}
                                        name={'step_id'}
                                        options={handleSteps(steps)}
                                        onChange={(e) => setSelectedStep(e.value)}
                                        placeholder="Select Item"
                                        className="text-base text-color surface-overlay border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                    ></TreeSelect>
                                    {errors?.step_id && <small id="username-help" className="p-error">
                                        {errors.step_id}
                                    </small>}
                                </div>

                                <div className="field lg:col-3">
                                    <label htmlFor="lastname2">Country</label>
                                    <Dropdown
                                        value={item.country_id}
                                        options={cachedRegions(regions)}
                                        onChange={e => {
                                            onInputChange(e, 'country_id', "country");
                                        }}
                                        optionLabel="label"
                                        placeholder="Select Country"
                                        optionValue="id"
                                    />
                                    {errors?.country_id && <small id="username-help" className="p-error">
                                        {errors.country_id}
                                    </small>}
                                </div>


                                {item.country_id && <div className="field lg:col-2">
                                    <label htmlFor="lastname2">City</label>
                                    <Dropdown
                                        value={item.city_id}
                                        options={cachedRegions(regions).find(r => r.id == item.country_id)?.children ?? []}
                                        onChange={e => onInputChange(e, 'city_id')}
                                        optionLabel="label"
                                        placeholder="Select City"
                                        optionValue="id"
                                    />
                                    {errors?.city_id && <small id="username-help" className="p-error">
                                        {errors.city_id}
                                    </small>}
                                </div>}

                                <div className="field lg:col-4">
                                    <label htmlFor="">Interestings</label>
                                    <InputTextarea rows={5} cols={30} value={item.interestings ?? ""} onChange={(e) => onInputChange(e, "interestings")}/>
                                </div>

                                <div className="field lg:col-4">
                                    <label htmlFor="">Description</label>
                                    <InputTextarea rows={5} cols={30} value={item.description ?? ""} onChange={(e) => onInputChange(e, "description")}/>
                                </div>


                                <div className="field lg:col-2">
                                    <label htmlFor="">Is Active</label>
                                    <br/>
                                    <InputSwitch checked={item?.is_active == 1} onChange={(e) => onInputChange(e, 'is_active', 'bool')}/>

                                    {errors?.is_active && <small id="username-help" className="p-error">
                                        {errors.is_active}
                                    </small>}
                                </div>

                            </div>
                            {item?.id && <UserEvents id={item.id}/>}
                        </Dialog>
                    )}
                </div>
            </section>
        </Fragment>
    );
};

export default Index;
