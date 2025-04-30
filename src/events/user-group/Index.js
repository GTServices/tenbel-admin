import React, {Fragment, useEffect, useRef, useState} from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import "./groups.scss";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import GroupService from "./group.service";
import {Button} from "primereact/button";
import {Toolbar} from "primereact/toolbar";
import {Dialog} from "primereact/dialog";
import {toast} from "../../routes";
import {AutoComplete} from "primereact/autocomplete";
import UserService from "../../user/user.service";
import ImageUpload from "../../common/components/imageUpload/ImageUpload";
import {InputSwitch} from "primereact/inputswitch";
import TableAction from "../../common/components/tableAction/TableAction";
import GroupEventForm from "../group-event/Forms";

const Index = () => {
    const [groups, setGroups] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [groupDialog, setGroupDialog] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [groupImage, setGroupImage] = useState(null);
    const [errors, setErrors] = useState({});
    let emptyGroup = {
        id: null,
        title: "",
        user_id: "",
        image: "",
        is_active: false,
    };

    const [group, setGroup] = useState(emptyGroup);

    const deleteGroup = async (id) => {
        try {
            await GroupService.deleteGroup(id);
            getGroups();
            toast.current.show({
                severity: "success",
                summary: "Success Message",
                detail: "Group is deleted",
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

    const getGroups = async () => {
        const response = await GroupService.getGroups();
        if (!response) {
            return false;
        }
        setGroups(response.data);
    };

    const selectUser = (id, data = null) => {
        const element = [...(data ? data : filteredUsers)].find(user => {
            return user.id.toString() === id.toString();
        })
        setSelectedUser(element);
    }

    const editGroup = async (group) => {
        const response = await GroupService.getGroup(group.id);
        setGroup({...response.data});
        selectUser(response.data.user_id);
        getUsers(null, response.data.user_id);
        setGroupDialog(true);
    };


    useEffect(() => {
        getGroups();
    }, []);

    const getUsers = (event = null, user_id = null) => {
        UserService.getAllUsers({
            filters: {
                name: {value: event?.query ?? ""}
            }
        }).then(response => {
            setFilteredUsers(response.data);
            const id = user_id || group.user_id;
            if (id) {
                selectUser(id, response.data);
            }
        });
    };

    const openNew = async () => {
        setGroup({...emptyGroup});
        setSubmitted(false);
        setGroupDialog(true);
    };

    const hideDialog = () => {
        setErrors({});
        setGroup({...emptyGroup});
        setSubmitted(false);
        setGroupDialog(false);
        setFilteredUsers([]);
        setSelectedUser(null);
    };

    const saveGroup = async () => {
        setSubmitted(true);

        if (group.id) {
            const formData = new FormData();
            formData.append("title", group.title);
            if (selectedUser) {
                formData.append("user_id", selectedUser.id);
            }
            formData.append("is_active", group.is_active);
            if (groupImage) {
                formData.append("image", groupImage);
            }
            formData.append('_method', "PUT")

            const response = await GroupService.updateGroup(formData, group.id);
            if (response.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: "Group Updated",
                    life: 3000,
                });
                getGroups();
            } else if (response.errors) {
                setErrors(response.errors)
            }

        } else {
            const formData = new FormData();
            formData.append("title", group.title);
            formData.append("image", groupImage);
            if (selectedUser) {
                formData.append("user_id", selectedUser.id);
            }
            formData.append("is_active", group.is_active);

            const response = await GroupService.storeGroup(formData);
            if (response.success) {
                toast.current.show({
                    severity: "success",
                    summary: "Success Message",
                    detail: "Group Created",
                    life: 3000,
                });
                getGroups();
                setGroup({...emptyGroup});
                hideDialog();
            } else if (response.errors) {
                setErrors(response.errors)
            }


        }
    };

    const roleDialogFooter = (
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
                onClick={saveGroup}
            />
        </React.Fragment>
    );

    const onInputChange = (e, name, key) => {
        const val = (e.target && (key ? e.target.value[key] : e.target.value)) || "";
        const _group = {
            ...group,
            [name]: val
        };
        setGroup(_group);
    };

    return (
        <Fragment>
            <Breadcrumb
                items={[{label: "User Groups"}]}
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
                            value={groups}
                            editMode="row"
                            dataKey="id"
                            responsiveLayout="scroll"
                        >
                            <Column field="id" header="Id" style={{width: "20%"}}></Column>

                            <Column
                                field="title"
                                header="Title"
                                style={{width: "20%"}}
                            ></Column>


                            <Column
                                body={data => <TableAction data={data} name={'group'} deleteItem={id => deleteGroup(id)} editItem={() => editGroup(data)}/>}
                                exportable={false}
                                style={{minWidth: "8rem"}}
                            ></Column>
                        </DataTable>
                    </div>

                    {groupDialog && (
                        <Dialog
                            visible={groupDialog}
                            style={{width: "1200px"}}
                            header="User Group details"
                            modal
                            className="p-fluid"
                            footer={roleDialogFooter}
                            onHide={hideDialog}
                        >
                            <div className="formgrid grid">
                                <div className="field lg:col-6">
                                    <label htmlFor="name">Name</label>
                                    <InputText
                                        id="name"
                                        value={group.title}
                                        onChange={(e) => onInputChange(e, "title")}
                                        required
                                        autoFocus
                                    />
                                    {errors?.title && <small id="username-help" className="p-error">
                                        {errors.title}
                                    </small>}
                                </div>

                                <div className="field lg:col-6">

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

                                <div className="field lg:col-6">
                                    <label htmlFor="">Image</label>
                                    <br/>
                                    <ImageUpload
                                        src={groupImage ? URL.createObjectURL(groupImage) : group?.image}
                                        onChange={e => setGroupImage(e.target.files[0])}
                                        error={errors?.image}
                                    />
                                </div>

                                <div className="field lg:col-6">
                                    <label htmlFor="">Is Active</label>
                                    <br/>
                                    <InputSwitch checked={group?.is_active} onChange={(e) => onInputChange(e, 'is_active')}/>

                                    {errors?.is_active && <small id="username-help" className="p-error">
                                        {errors.is_active}
                                    </small>}
                                </div>

                            </div>
                            {group?.id && <div>
                                <GroupEventForm id={group.id}/>
                            </div>}

                        </Dialog>
                    )}
                </div>
            </section>
        </Fragment>
    );
};

export default Index;
