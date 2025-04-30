import React, { Fragment, useEffect, useState } from "react";
import PackageGroupService from "./packageGroup.service";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { toast } from "../../routes";
import LeftToolbarTemplate from "../../common/templates/TableLeft/left-toolbar-template";
import TableAction from "../../common/components/tableAction/TableAction";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
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
      title: { value: "", matchMode: "contains" },
    },
  });
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const getAll = async () => {
    setLoading(true);
    const response = await PackageGroupService.all(lazyParams);
    setItems(response.data);
    setTotalRecords(response.meta.total);
    setLoading(false);
  };

  useEffect(() => {
    getAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams]);
  const deleteItem = async (id) => {
    try {
      await PackageGroupService.delete(id);
      getAll();
      toast.current.show({
        severity: "success",
        summary: "Succes Message",
        detail: "Role is deleted",
        life: 3000,
      });
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Error Message",
        detail: "Category is not deleted",
        life: 3000,
      });
    }
  };

  return (
    <Fragment>
      <Breadcrumb items={[{ label: "Package groups" }]} />
      <section className="users">
        <div className="datatable-doc-demo">
          <div className="card">
            {items && (
              <>
                <Toolbar
                  className="mb-4"
                  left={<LeftToolbarTemplate name={"package-group"} />}
                />
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
                    field="title"
                    header="Title"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="title"
                  />

                  <Column
                    body={(data) => (
                      <TableAction
                        data={data}
                        name={"package-group"}
                        deleteItem={(id) => deleteItem(id)}
                      />
                    )}
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
