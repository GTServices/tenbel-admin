import React, { Fragment, useEffect, useState } from "react";
import "./style.scss";
import TranslationService from "./translation.service";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import TableAction from "../components/tableAction/TableAction";
import LeftToolbarTemplate from "../templates/TableLeft/left-toolbar-template";
import { toast } from "../../routes";
import usePagination from "../hooks/usePagination";

const Index = () => {
  const [lazyParams, setLazyParams, onPage] = usePagination({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      id: { value: "", matchMode: "contains" },
      value: { value: "", matchMode: "contains" },
      key: { value: "", matchMode: "contains" },
    },
  });
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const getAllTranslations = async () => {
    setLoading(true);
    const response = await TranslationService.all(lazyParams);
    if (!response) {
      return false;
    }
    setItems(response.data);
    setTotalRecords(response.meta.total);
    setLoading(false);
  };

  useEffect(() => {
    getAllTranslations();
  }, [lazyParams]);

  const deleteTranslation = async (id) => {
    if (await TranslationService.delete(id)) {
      getAllTranslations();
      toast.current.show({
        severity: "success",
        summary: "Succes Message",
        detail: "Translation was deleted",
        life: 3000,
      });
    }
  };

  return (
    <Fragment>
      <Breadcrumb items={[{ label: "Translations" }]} />
      <section className="merchants">
        <div className="datatable-doc-demo">
          <div className="card">
            {items && (
              <>
                <Toolbar
                  className="mb-4"
                  left={<LeftToolbarTemplate name={"translation"} />}
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
                    field="key"
                    header="Key"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="key"
                  />

                  <Column
                    field="value"
                    header="Value"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="value"
                  />

                  <Column
                    body={(data) => (
                      <TableAction
                        data={data}
                        name={"translation"}
                        deleteItem={(id) => deleteTranslation(id)}
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
