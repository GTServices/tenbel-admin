import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./currency.scss";
import CurrencyService from "./currency.service";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { InputSwitch } from "primereact/inputswitch";
import { MultiSelect } from "primereact/multiselect";
import regionService from "../region/region.service";
import { routeUrl } from "../common/utils/helpers";
import routes from "./routes";
import { toast } from "../routes";
import IsActiveBodyTemplate from "../common/templates/IsActive/is-active-body-template";
import TableAction from "../common/components/tableAction/TableAction";
import usePagination from "../common/hooks/usePagination";

const Currencies = () => {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currencyDialog, setCurrencyDialog] = useState(false);
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [lazyParams, setLazyParams, onPage] = usePagination({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      id: { value: "", matchMode: "contains" },
      title: { value: "", matchMode: "contains" },
      code: { value: "", matchMode: "contains" },
      symbol: { value: "", matchMode: "contains" },
    },
  });
  const [countries, setCountries] = useState([]);

  let emptyCurrency = {
    id: null,
    title: "",
    code: "",
    symbol: "",
  };

  const [currency, setCurrency] = useState(emptyCurrency);

  const getAllCurrencies = async () => {
    setLoading(true);
    const response = await CurrencyService.getCurrencies(lazyParams);
    if (!response) {
      return false;
    }
    setItems(response.data);
    setTotalRecords(response.meta.total);
    setLoading(false);
  };

  const getAllCountries = async () => {
    const response = await regionService.getCountries();
    if (!response) {
      return false;
    }
    setCountries(response.data);
  };

  useEffect(() => {
    getAllCurrencies();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazyParams]);

  useEffect(() => {
    getAllCountries();
  }, []);

  const openNew = async () => {
    setCurrency({ ...emptyCurrency });
    setCurrencyDialog(true);
  };
  const hideDialog = () => {
    setCurrency({ ...emptyCurrency });
    setSubmitted(false);
    setCurrencyDialog(false);
    setSelectedCountries([]);
  };

  const selectedCountriesTemplate = (optionId) => {
    const _countries = cachedRegions(countries);
    const lastId = selectedCountries[selectedCountries.length - 1];
    const country = _countries.find((c) => c.id === optionId);
    if (optionId) {
      return (
        <span className="country-item country-item-value">
          <span>
            {country.label}
            {lastId !== country.id && ", "}
          </span>
        </span>
      );
    }

    return "Select Countries";
  };
  const saveCurrency = async () => {
    setSubmitted(true);
    // const selectedCountryIds = selectedCountries.map((country) => country.id);

    let newData = {
      title: currency.title,
      code: currency.code,
      symbol: currency.symbol,
      is_active: currency.is_active ? 1 : 0,
      is_default: currency.is_default ? 1 : 0,
      countries: selectedCountries,
    };

    if (currency.id) {
      newData = {
        ...newData,
        _method: "PUT",
      };

      const response = await CurrencyService.updateCurrency(
        newData,
        currency.id
      );
      if (response.success) {
        toast.current.show({
          severity: "success",
          summary: "Success Message",
          detail: "Role Updated",
          life: 3000,
        });
        getAllCurrencies();
        setCurrencyDialog(false);
        setCurrency({ ...emptyCurrency });
      } else if (response.errors) {
        setErrors(response.errors);
      }
    } else {
      const response = await CurrencyService.storeCurrency(newData);

      if (response.success) {
        toast.current.show({
          severity: "success",
          summary: "Success Message",
          detail: "Role Created",
          life: 3000,
        });
        getAllCurrencies();
        hideDialog();
      } else if (response.errors) {
        setErrors(response.errors);
      }
    }
  };
  const editCurrency = async (row) => {
    const response = await CurrencyService.getCurrency(row.id);
    if (!response) {
      return false;
    }
    setSelectedCountries(response.data.countries.map((c) => c.key));

    setCurrency({ ...response.data });
    setCurrencyDialog(true);
    // getAllCurrencies();
  };
  const currencyDialogFooter = (
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
        onClick={saveCurrency}
      />
    </React.Fragment>
  );

  const deleteCurrency = async (id) => {
    const response = await CurrencyService.deleteCurrency(id);
    if (response) {
      getAllCurrencies();
      toast.current.show({
        severity: "success",
        summary: "Succes Message",
        detail: "Admin is deleted",
        life: 3000,
      });
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _formdata = { ...currency };
    _formdata[`${name}`] = val;

    setCurrency(_formdata);
  };

  const panelFooterTemplate = () => {
    const selectedItems = selectedCountries;
    const length = selectedItems ? selectedItems.length : 0;
    return (
      <div className="py-2 px-3">
        <b>{length}</b> item{length > 1 ? "s" : ""} selected.
      </div>
    );
  };

  const cachedRegions = useCallback(
    (elements) => {
      return (elements || []).map((data) => ({
        label: data.data.title,
        id: data.data.id,
        children: cachedRegions(data.children),
      }));
    },
    [countries]
  );

  return (
    <Fragment>
      <Breadcrumb
        items={[
          { label: "Currencies", url: routeUrl(routes, "currency.index") },
        ]}
      />
      <section className="users">
        <div className="datatable-doc-demo">
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

          <div className="card">
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
                onSort={(event) => setLazyParams(event)}
                sortField={lazyParams.sortField}
                sortOrder={lazyParams.sortOrder}
                onFilter={(event) => setLazyParams(event)}
                filters={lazyParams.filters}
                loading={loading}
              >
                <Column field="id" header="Id" sortable />
                <Column
                  field="code"
                  header="Code"
                  sortable
                  filter
                  showClearButton={false}
                  showFilterMenu={false}
                  filterPlaceholder="Code"
                />
                <Column
                  field="title"
                  header="Title"
                  sortable
                  filter
                  showClearButton={false}
                  showFilterMenu={false}
                  filterPlaceholder="Title"
                />
                <Column
                  field="symbol"
                  header="Symbol"
                  sortable
                  filter
                  showClearButton={false}
                  showFilterMenu={false}
                  filterPlaceholder="Symbol"
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
                  field="is_default"
                  header="Default"
                  body={(data) => (
                    <IsActiveBodyTemplate
                      data={data}
                      columnName={"is_default"}
                    />
                  )}
                  sortable
                />

                <Column
                  body={(data) => (
                    <TableAction
                      data={data}
                      name={"currency"}
                      editItem={() => editCurrency(data)}
                      deleteItem={(id) => deleteCurrency(id)}
                    />
                  )}
                  exportable={false}
                  style={{ minWidth: "8rem" }}
                ></Column>
              </DataTable>
            )}
          </div>

          <Dialog
            visible={currencyDialog}
            style={{ width: "950px" }}
            header="Add Currency"
            modal
            className="p-fluid"
            footer={currencyDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="title">Title</label>
              <InputText
                id="title"
                value={currency.title}
                onChange={(e) => onInputChange(e, "title")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !currency.title,
                })}
              />
              {errors?.title && (
                <small className="p-error">{errors?.title}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="code">Code</label>
              <InputText
                id="code"
                value={currency.code}
                onChange={(e) => onInputChange(e, "code")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !currency.code,
                })}
              />
              {errors?.code && (
                <small className="p-error">{errors?.code}</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="code">Symbol</label>
              <InputText
                id="code"
                value={currency.symbol}
                onChange={(e) => onInputChange(e, "symbol")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !currency.symbol,
                })}
              />
              {errors?.symbol && (
                <small className="p-error">{errors?.symbol}</small>
              )}
            </div>
            <div className="field">
              <h5>Countries</h5>
              {countries && (
                <MultiSelect
                  value={selectedCountries}
                  options={cachedRegions(countries)}
                  optionValue={"id"}
                  onChange={(e) => setSelectedCountries(e.value)}
                  placeholder="Select Countries"
                  filter
                  className="multiselect-custom"
                  selectedItemTemplate={selectedCountriesTemplate}
                  panelFooterTemplate={panelFooterTemplate}
                />
              )}

              {errors?.countries && (
                <small className="p-error">{errors?.countries}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="is_active">Status</label>
              <br />
              <InputSwitch
                id={"is_active"}
                checked={currency.is_active}
                onChange={(e) => onInputChange(e, "is_active")}
              />
            </div>
          </Dialog>
        </div>
      </section>
    </Fragment>
  );
};

export default Currencies;
