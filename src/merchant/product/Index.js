import React, { Fragment, useEffect, useRef, useState } from "react";
import "./style.scss";
import ProductService from "./product.service";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import IsActiveBodyTemplate from "../../common/templates/IsActive/is-active-body-template";
import TableAction from "../../common/components/tableAction/TableAction";
import LeftToolbarTemplate from "../../common/templates/TableLeft/left-toolbar-template";
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
      title: { value: "", matchMode: "contains" },
      has_delivery: { value: "", matchMode: "contains" },
      desc: { value: "", matchMode: "contains" },
      price: { value: "", matchMode: "contains" },
      product_code: { value: "", matchMode: "contains" },
      merchant_id: { value: "", matchMode: "contains" },
      is_active: { value: "", matchMode: "contains" },
      created_at: { value: "", matchMode: "contains" },
    },
  });
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const getAllProducts = async () => {
    setLoading(true);
    const response = await ProductService.all(lazyParams);
    if (!response) {
      return false;
    }
    setItems(response.data);
    setTotalRecords(response.meta.total);
    setLoading(false);
  };

  useEffect(() => {
    getAllProducts();
  }, [lazyParams]);

  const deleteProduct = async (id) => {
    if (await ProductService.delete(id)) {
      getAllProducts();
      toast.current.show({
        severity: "success",
        summary: "Succes Message",
        detail: "Product was deleted",
        life: 3000,
      });
    }
  };

  return (
    <Fragment>
      <Breadcrumb items={[{ label: "Products" }]} />
      <section className="merchants">
        <div className="datatable-doc-demo">
          <div className="card">
            {items && (
              <>
                <Toolbar
                  className="mb-4"
                  left={<LeftToolbarTemplate name={"product"} />}
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
                    field="price"
                    header="Price"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="price"
                    body={(data) => `${data.price}`}
                  />

                  <Column
                    field="title"
                    header="Title"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="surname"
                  />

                  <Column
                    field="merchant_id"
                    header="Merchant"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="merchant"
                  />

                  <Column
                    field="has_delivery"
                    header="Has delivery"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="has delivery"
                  />
                  <Column
                    field="product_code"
                    header="Product code"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="product code"
                  />
                  <Column
                    field="created_at"
                    header="Created at"
                    sortable
                    filter
                    showFilterMenu={false}
                    showClearButton={false}
                    filterPlaceholder="product code"
                  />
                  <Column
                    field="is_active"
                    header="Status"
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
                        name={"product"}
                        deleteItem={(id) => deleteProduct(id)}
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
