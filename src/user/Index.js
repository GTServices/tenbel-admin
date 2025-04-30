import React, { Fragment, useEffect, useState } from "react";
import "./users.scss";
import UserService from "./user.service";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import LeftToolbarTemplate from "../common/templates/TableLeft/left-toolbar-template";
import IsActiveBodyTemplate from "../common/templates/IsActive/is-active-body-template";
import TableAction from "../common/components/tableAction/TableAction";
import { toast } from "../routes";
import usePagination from "../common/hooks/usePagination";

const Index = () => {
  const [lazyParams, setLazyParams, onPage] = usePagination({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      id: { value: "", matchMode: "contains" },
      is_active: { value: "", matchMode: "contains" },
      gender: { value: "", matchMode: "contains" },
      name: { value: "", matchMode: "contains" },
      surname: { value: "", matchMode: "contains" },
      phone: { value: "", matchMode: "contains" },
      email: { value: "", matchMode: "contains" },
      birthday: { value: "", matchMode: "contains" },
    },
  });
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const getAllUsers = async () => {
    setLoading(true);
    const response = await UserService.getAllUsers(lazyParams);
    if (!response) {
      return false;
    }
    setItems(response.data);
    setTotalRecords(response.meta.total);
    setLoading(false);
  };

  useEffect(() => {
    getAllUsers();
  }, [lazyParams]);

  const deleteUser = async (id) => {
    await UserService.deleteUser(id);
    getAllUsers();
    toast.current.show({
      severity: "success",
      summary: "Success Message",
      detail: "User was deleted",
      life: 3000,
    });
  };

  return (
    <Fragment>
      <Breadcrumb items={[{ label: "Users" }]} />
      <section className="users">
        <div className="datatable-doc-demo">
          <div className="card">
            {items && (
              <>
                <Toolbar
                  className="mb-4"
                  left={<LeftToolbarTemplate name={"user"} />}
                ></Toolbar>
                <DataTable
                  value={items}
                  lazy
                  filterDisplay="row"
                  responsiveLayout="scroll"
                  dataKey="id"
                  paginator
                  first={lazyParams.first}
                  rows={lazyParams.rows}
                  totalRecords={totalRecords}
                  onPage={onPage}
                  onSort={(event) => setLazyParams(event)}
                  sortField={lazyParams.sortField}
                  sortOrder={lazyParams.sortOrder}
                  onFilter={(event) => setLazyParams(event)}
                  filters={lazyParams.filters}
                  loading={loading}
                >
                  <Column
                    field="id"
                    header="Id"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="id"
                  />

                  <Column
                    field="name"
                    header="Name"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="name"
                  />

                  <Column
                    field="surname"
                    header="Surname"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="surname"
                  />

                  <Column
                    field="phone"
                    header="Phone"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="phone"
                  />

                  <Column
                    field="birthday"
                    header="Birthday"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="birthday"
                  />
                  <Column
                    field="gender"
                    header="Gender"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="gender"
                  />
                  <Column
                    field="email"
                    header="Email"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="email"
                  />
                  <Column
                    field="is_active"
                    header="Active"
                    body={(data) => (
                      <IsActiveBodyTemplate
                        data={data}
                        columnName={"is_active"}
                      />
                    )}
                    sortable
                  />

                  <Column
                    body={(data) => (
                      <TableAction
                        data={data}
                        name={"user"}
                        deleteItem={(id) => deleteUser(id)}
                      />
                    )}
                    exportable={false}
                  />
                </DataTable>
              </>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Index;
