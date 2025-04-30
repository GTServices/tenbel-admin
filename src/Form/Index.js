import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import service from "./forms.service";
import { toast } from "../routes";
import TableAction from "../common/components/tableAction/TableAction";
const Index = () => {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
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
    setLoading(true);
    const response = await service.all(lazyParams);
    setLoading(false);
    if (!response) {
      return false;
    }
    setItems(response.data);
    setTotalRecords(response?.meta?.total);
  };

  const onPage = (e) => {
    setLazyParams((prevState) => ({
      ...prevState,
      first: e.first,
      rows: e.rows,
      page: e.page + 1,
    }));
  };

  useEffect(() => {
    getAll();
  }, [lazyParams]);

  const formTemplate = (form) => {
    return Object.entries(form.data).map((formData) => {
      return (
        <div>
          <span>
            <b>{formData[0]}</b> : {formData[1]}
          </span>{" "}
          <br />
        </div>
      );
    });
  };

  return (
    <Fragment>
      <Breadcrumb items={[{ label: "Forms" }]} />
      <section className="roles">
        <div className="datatable-editing-demo">
          <div className="card p-fluid">
            <DataTable
              value={items}
              lazy
              editMode="row"
              dataKey="id"
              filterDisplay="row"
              paginator
              first={lazyParams.first}
              rows={10}
              totalRecords={totalRecords}
              onPage={onPage}
              onSort={(e) => setLazyParams(e)}
              sortField={lazyParams.sortField}
              sortOrder={lazyParams.sortOrder}
              onFilter={(e) => setLazyParams(e)}
              filters={lazyParams.filters}
              loading={loading}
              responsiveLayout="scroll"
            >
              <Column field="id" header="Id" style={{ width: "20px" }}></Column>

              <Column
                header="Name"
                field={"name"}
                sortable
                filter
                showClearButton={false}
                showFilterMenu={false}
              ></Column>

              <Column header="Form data" body={formTemplate}></Column>

              <Column header="Date" field={"created_at"} sortable></Column>

              <Column
                body={(data) => (
                  <TableAction
                    data={data}
                    editable={false}
                    deleteItem={(id) => deleteItem(id)}
                  />
                )}
                exportable={false}
                style={{ minWidth: "8rem" }}
              ></Column>
            </DataTable>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Index;
