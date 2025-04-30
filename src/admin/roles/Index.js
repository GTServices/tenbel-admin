import React, { Fragment, useEffect, useRef, useState } from "react";
import Breadcrumb from "../user/components/breadcrumb/Breadcrumb";
import "./roles.scss";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import RoleService from "./role.service";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { Checkbox } from "primereact/checkbox";
import TableAction from "../../common/components/tableAction/TableAction";
import { routeUrl } from "../../common/utils/helpers";
import routes from "../user/routes";
import usePagination from "../../common/hooks/usePagination";

const Roles = () => {
  const [lazyParams, setLazyParams, onPage] = usePagination({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      id: { value: "", matchMode: "contains" },
      name: { value: "", matchMode: "contains" },
    },
  });
  const [roles, setRoles] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [roleDialog, setRoleDialog] = useState(false);
  const toast = useRef(null);
  const [permissions, setPermissions] = useState([]);
  const [permissionLists, setPermissionLists] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const onPermissionChange = (e) => {
    let selectedPermissions = [...permissions];

    if (e.checked) selectedPermissions.push(e.value);
    else selectedPermissions.splice(selectedPermissions.indexOf(e.value), 1);

    setPermissions(selectedPermissions);
  };

  let emptyRole = {
    id: null,
    name: "",
  };

  const [role, setRole] = useState(emptyRole);

  const deleteRole = async (id) => {
    if (await RoleService.deleteRole(id)) {
      getRoles();
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: "Role is deleted",
        life: 3000,
      });
    }
  };

  const getRoles = async () => {
    setLoading(true);
    const response = await RoleService.getRoles(lazyParams);
    if (response) {
      setRoles(response.data);
    }
    setLoading(false);
  };

  const editRole = async (role) => {
    const response = await RoleService.getRole(role.id);
    const roleItem = await response.data;
    getPermissions();

    setPermissions(roleItem.data.permissions.map((per) => per.id));

    setRole({ ...roleItem.data });
    setRoleDialog(true);
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    getRoles();
  }, [lazyParams]);

  const getPermissions = async () => {
    try {
      const response = await RoleService.getPermissions();
      const permissions = await response.data;
      setPermissionLists(permissions.data);
    } catch (e) {
      console.log(e);
    }
  };

  const openNew = async () => {
    getPermissions();

    setRole(emptyRole);
    setSubmitted(false);
    setRoleDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setRoleDialog(false);
  };

  const saveRole = async () => {
    setSubmitted(true);

    if (role.id) {
      const newData = {
        permissions,
        _method: "PUT",
        name: role.name,
      };
      const response = await RoleService.updateRole(newData, role.id);
      if (response.success) {
        toast.current.show({
          severity: "success",
          summary: "Success Message",
          detail: "Role Updated",
          life: 3000,
        });

        resetForm();
      } else if (response.errors) {
        setErrors(response.errors);
      }
    } else {
      const newData = {
        name: role.name,
        permissions,
      };

      const response = await RoleService.storeRole(newData);
      if (response.success) {
        toast.current.show({
          severity: "success",
          summary: "Success Message",
          detail: "Role Created",
          life: 3000,
        });
        resetForm();
      } else if (response.errors) {
        setErrors(response.errors);
      }
    }
  };

  const resetForm = () => {
    getRoles();
    setRoleDialog(false);
    setRole(emptyRole);
    setPermissions([]);
    setPermissionLists([]);
    setErrors({});
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
        onClick={saveRole}
      />
    </React.Fragment>
  );

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _role = { ...role };
    _role[`${name}`] = val;

    setRole(_role);
  };

  return (
    <Fragment>
      <Toast ref={toast} />
      <Breadcrumb
        items={[
          { label: "Admins", url: routeUrl(routes, "admin.index") },
          { label: "Roles" },
        ]}
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
              value={roles}
              lazy
              filterDisplay="row"
              responsiveLayout="scroll"
              dataKey="id"
              paginator
              first={lazyParams.first}
              rows={lazyParams.rows}
              totalRecords={totalRecords}
              onPage={onPage}
              onSort={(e) => setLazyParams(e)}
              sortField={lazyParams.sortField}
              sortOrder={lazyParams.sortOrder}
              onFilter={(e) => setLazyParams(e)}
              filters={lazyParams.filters}
              loading={loading}
            >
              <Column
                field="id"
                header="Id"
                style={{ width: "20%" }}
                sortable
                filter
                showClearButton={false}
                showFilterMenu={false}
              ></Column>

              <Column
                field="name"
                header="Name"
                sortable
                filter
                showClearButton={false}
                showFilterMenu={false}
                style={{ width: "20%" }}
              ></Column>

              <Column
                body={(data) => (
                  <TableAction
                    data={data}
                    name={"role"}
                    deleteItem={(id) => deleteRole(id)}
                    editItem={() => editRole(data)}
                  />
                )}
                exportable={false}
                style={{ minWidth: "8rem" }}
              ></Column>
            </DataTable>
          </div>

          {permissions && (
            <Dialog
              visible={roleDialog}
              style={{ width: "950px" }}
              header="Role details"
              modal
              className="p-fluid"
              footer={roleDialogFooter}
              onHide={hideDialog}
            >
              <div className="field">
                <label htmlFor="name">Name</label>
                <InputText
                  id="name"
                  value={role.name}
                  onChange={(e) => onInputChange(e, "name")}
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !role.name,
                  })}
                />
                {errors.name && (
                  <small id="username-help" className="p-error">
                    {errors.name}
                  </small>
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {permissionLists.map((per) => (
                  <div className="field-checkbox" key={per.id}>
                    <Checkbox
                      name="permission"
                      value={per.id}
                      onChange={onPermissionChange}
                      checked={permissions.indexOf(per.id) !== -1}
                    />
                    <label htmlFor="city1">{per.name}</label>
                  </div>
                ))}
              </div>
            </Dialog>
          )}
        </div>
      </section>
    </Fragment>
  );
};

export default Roles;
