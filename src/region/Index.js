import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import RegionService from "./region.service";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { Toolbar } from "primereact/toolbar";
import TableAction from "../common/components/tableAction/TableAction";
import LeftToolbarTemplate from "../common/templates/TableLeft/left-toolbar-template";
import routes from "./routes";
import { routeUrl } from "../common/utils/helpers";
import usePagination from "../common/hooks/usePagination"; // Import the usePagination hook

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

  const [regions, setRegions] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  const getRegions = async () => {
    const response = await RegionService.getRegions(lazyParams);
    if (!response) {
      return false;
    }
    setRegions(response.data);
    setTotalRecords(response.meta.total);
  };

  useEffect(() => {
    getRegions();
    setLoading(false);
  }, [lazyParams]);

  const deleteRegion = async (id) => {
    await RegionService.deleteRegion(id);
    getRegions();
  };

  const handleTableAction = (data) => {
    return (
      <TableAction
        data={data}
        name={"region"}
        deleteItem={(id) => deleteRegion(id)}
        handleKey={"key"}
      />
    );
  };

  return (
    <>
      <Breadcrumb
        items={[{ label: "Regions", url: routeUrl(routes, "region.index") }]}
      />
      <section className="steps">
        <div className="treetable-responsive-demo">
          <div className="card">
            <Toolbar
              className="mb-4"
              left={<LeftToolbarTemplate name={"region"} />}
            ></Toolbar>
            <TreeTable
              value={regions}
              lazy
              paginator
              totalRecords={totalRecords}
              first={lazyParams.first}
              rows={lazyParams.rows}
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
                expander
                filter
                filterPlaceholder="Filter by id"
              />
              <Column
                field="title"
                header="Title"
                filter
                filterPlaceholder="Filter by title"
              />
              <Column
                body={(data) => handleTableAction(data)}
                style={{ textAlign: "center", width: "10rem" }}
              />
            </TreeTable>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
