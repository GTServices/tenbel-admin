import React, {Fragment, useCallback, useEffect, useRef, useState} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import service from "./package.service";
import {Button} from "primereact/button";
import {Dropdown} from "primereact/dropdown";
import {Toolbar} from "primereact/toolbar";
import {Dialog} from "primereact/dialog";
import {toast} from "../../routes";
import {AutoComplete} from "primereact/autocomplete";
import PackageGroupService from "../package-group/packageGroup.service";
import {InputSwitch} from "primereact/inputswitch";
import TableAction from "../../common/components/tableAction/TableAction";
import {boolToInt, typeToValue} from "../../common/utils/helpers";
import {TabPanel, TabView} from "primereact/tabview";
import LangTitle from "../../common/components/langTitle/LangTitle";
import {useSelector} from "react-redux";
import Features from '../features/Forms';

const Index = () => {
    let emptyData = {
        id: null,
        admin_title: "",
        az:{
            title:""
        },
        en:{
            title:""
        },
        ru:{
            title:""
        },
        price: "",
        period_type: "",
        period: "",
        sort_order: 0,
        group_id: "",
        is_active: 0,
    };
    const [activeIndex, setActiveIndex] = useState(0);
    const {langs} = useSelector((state) => state.langs);
    const [items, setItems] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [periodTypes, setPeriodTypes] = useState([]);
    const [errors, setErrors] = useState({});
    const [item, setItem] = useState({...emptyData});

    const deleteItem = async (id) => {
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

    const selectGroup = (id, data = null) => {
        const element = [...(data ? data : filteredGroups)].find(user => {
            return user.id.toString() === id.toString();
        })
        setSelectedGroup(element);
    }

    const editItem = async (item) => {
        const response = await service.get(item.id);
        setItem({...response.data});
        selectGroup(response.data.group_id);
        getAllGroups(null, response.data.group_id);
        setDialog(true);
    };


    useEffect(() => {
        getAll();
        getPeriodTypes();
    }, []);

    useEffect(() => {
        if(selectedGroup && typeof selectedGroup == "object" && selectedGroup?.id){
            setItem({
                ...item,
                group_id: selectedGroup?.id,
            })
        }
    }, [selectedGroup]);

    const getAllGroups = (event = null, group_id = null) => {
        PackageGroupService.all({
            filters: {
                title: {value: event?.query ?? ""}
            },
            rows:1000
        }).then(response => {
            setFilteredGroups(response.data);
            const id = group_id || item.group_id;
            if (id) {
                selectGroup(id, response.data);
            }
        });
    };

    const getPeriodTypes = () => {
        service.periodTypes().then(response => {
            if(typeof response.data == "object" && !Array.isArray(response.data)){
                const newOptions = [];
                Object.keys(response.data).forEach(id => {
                    newOptions.push({
                        id,
                        title:response.data[id]
                    });
                });
                setPeriodTypes(newOptions);
            }
        });
    }

    const openNew = async () => {
        setItem({...emptyData});
        setSubmitted(false);
        setDialog(true);
    };

    const hideDialog = () => {
        setErrors({});
        setItem({...emptyData});
        setSubmitted(false);
        setDialog(false);
        setFilteredGroups([]);
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

    const onInputChange = (e, name, type = null,lang) => {
        const val = typeToValue(e.target.value, type);
        if(lang){
            setItem({
                ...item,
                [lang]:{
                    ...(item[lang] ?? {}),
                    [name]: val
                }
            })
        }else{
            setItem({
                ...item,
                [name]: val
            })
        }
    };

    return (
        <Fragment>
            <Breadcrumb
                items={[{label: "Packages"}]}
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
                                header="Title"
                                body={row => `${row.admin_title} - ${row.title}`}
                            ></Column>


                            <Column
                                header="Price"
                                body={row => `${row.price} azn`}
                            ></Column>

                            <Column
                                header="Period"
                                body={data => `${data.period} - ${data.period_type_name}`}
                            ></Column>

                            <Column
                                field="is_active"
                                header="Active"
                            ></Column>


                            <Column
                                body={data => <TableAction data={data} name={'item'} deleteItem={id => deleteItem(id)} editItem={() => editItem(data)}/>}
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
                                                                    value={item?.[lang]?.title ?? ""}
                                                                    onChange={(e) => onInputChange(e,'title', null,lang)}
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

                                <div className="field lg:col-3">
                                    <label htmlFor="name">Admin title</label>
                                    <InputText
                                        id="name"
                                        value={item.admin_title}
                                        onChange={(e) => onInputChange(e, "admin_title")}
                                        required
                                        autoFocus
                                    />
                                    {errors?.admin_title && <small id="username-help" className="p-error">
                                        {errors.admin_title}
                                    </small>}
                                </div>

                                <div className="field lg:col-3">
                                    <label htmlFor="price">Price</label>
                                    <InputText
                                        id="price"
                                        type={'number'}
                                        value={item.price}
                                        onChange={(e) => onInputChange(e, "price")}
                                        required
                                        autoFocus
                                    />
                                    {errors?.price && <small id="username-help" className="p-error">
                                        {errors.price}
                                    </small>}
                                </div>

                                <div className="field lg:col-3">

                                    <label htmlFor="name">Package group</label>
                                    <AutoComplete
                                        value={selectedGroup}
                                        suggestions={filteredGroups}
                                        completeMethod={event => getAllGroups(event)}
                                        virtualScrollerOptions={{itemSize: 31}}
                                        field={data => `${data.title}`}
                                        dropdown
                                        onChange={(e) => setSelectedGroup(e.target.value)}
                                    />
                                    {errors?.group_id && <small id="username-help" className="p-error">
                                        {errors.group_id}
                                    </small>}
                                </div>

                                <div className="field lg:col-3">

                                    <label htmlFor="name">Package group</label>
                                    <Dropdown
                                        options={periodTypes}
                                        value={item.period_type.toString()}
                                        className="p-input-te"
                                        name={'period_type'}
                                        optionValue="id"
                                        optionLabel="title"
                                        placeholder="Period type"
                                        onChange={(e) => onInputChange(e, "period_type")}
                                    />
                                    {errors?.group_id && <small id="username-help" className="p-error">
                                        {errors.group_id}
                                    </small>}
                                </div>

                                <div className="field lg:col-2">
                                    <label htmlFor="period">Period</label>
                                    <InputText
                                        type={"number"}
                                        id="period"
                                        value={item.period}
                                        onChange={(e) => onInputChange(e, "period")}
                                        required
                                        autoFocus
                                    />
                                    {errors?.price && <small id="username-help" className="p-error">
                                        {errors.price}
                                    </small>}
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
                            {item?.id && <Features id={item.id}/>}
                        </Dialog>
                    )}
                </div>
            </section>
        </Fragment>
    );
};

export default Index;
