import React, { Fragment, useEffect, useRef, useState } from "react";
import "./admins.scss";
import AdminService from "./admin.service";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import LeftToolbarTemplate from "../../common/templates/TableLeft/left-toolbar-template";
import IsActiveBodyTemplate from "../../common/templates/IsActive/is-active-body-template";
import TableAction from "../../common/components/tableAction/TableAction";
import { toast } from "../../routes";
import usePagination from "../../common/hooks/usePagination";

const Index = () => {
  const [lazyParams, setLazyParams, onPage] = usePagination({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      id: { value: "", matchMode: "contains" },
      username: { value: "", matchMode: "contains" },
      is_active: { value: "", matchMode: "contains" },
      email: { value: "", matchMode: "contains" },
    },
  });
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const getAllAdmins = async () => {
    setLoading(true);
    const response = await AdminService.getAllAdmins(lazyParams);
    setItems(response.data);
    setTotalRecords(response?.meta?.total);
    setLoading(false);
  };

  useEffect(() => {
    getAllAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams]);

  const deleteUser = async (id) => {
    if (await AdminService.deleteAdmin(id)) {
      getAllAdmins();
      toast.current.show({
        severity: "success",
        summary: "Succes Message",
        detail: "Admin was deleted",
        life: 3000,
      });
    }
  };

  return (
    <Fragment>
      <Breadcrumb items={[{ label: "Admins" }]} />
      <section className="users">
        <div className="datatable-doc-demo">
          <div className="card">
            <Toolbar
              className="mb-4"
              left={<LeftToolbarTemplate name={"admin"} />}
            ></Toolbar>
            {items && (
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
                onSort={(e) => setLazyParams(e)}
                sortField={lazyParams.sortField}
                sortOrder={lazyParams.sortOrder}
                onFilter={(e) => setLazyParams(e)}
                filters={lazyParams.filters}
                loading={loading}
              >
                <Column field="id" header="Id" sortable />

                <Column
                  field="username"
                  header="Username"
                  sortable
                  filter
                  showClearButton={false}
                  showFilterMenu={false}
                  filterPlaceholder="username"
                />

                <Column
                  field="email"
                  header="Email"
                  sortable
                  filter
                  showClearButton={false}
                  showFilterMenu={false}
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
                      name={"admin"}
                      deleteItem={(id) => deleteUser(id)}
                    />
                  )}
                  exportable={false}
                  style={{ minWidth: "8rem" }}
                ></Column>
              </DataTable>
            )}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Index;
