import React, { Fragment, useState, useEffect, useRef } from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import ProductService from "./product.service";
import MerchantService from "../user/merchant.service";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";
import "./form.scss";
import { toast } from "../../routes";
import { boolToInt, routeUrl, typeToValue } from "../../common/utils/helpers";
import routes from "./routes";
import { InputSwitch } from "primereact/inputswitch";
import { useSelector } from "react-redux";
import { TabPanel, TabView } from "primereact/tabview";
import LangTitle from "../../common/components/langTitle/LangTitle";
import { AutoComplete } from "primereact/autocomplete";
import { FileUpload } from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { arrayMoveImmutable } from "array-move";
import SortableList, { SortableItem } from "react-easy-sort";
import { ProductImage } from "./components/ProductImage/ProductImage";
import { Dropdown } from "primereact/dropdown";
import CategoryService from "../../events/category/category.service";

const Forms = () => {
  const params = useParams();
  const id = Number(params?.id);
  const { langs } = useSelector((state) => state.langs);
  const isAddMode = !id;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [filteredMerchants, setFilteredMerchants] = useState([]);
  const [item, setItem] = useState({});
  const [formImages, setFormImages] = useState([]);
  const [sortableImages, setSortableImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  let navigate = useNavigate();

  const getData = async () => {
    setIsLoading(true);
    const response = await ProductService.get(id);
    if (!response) {
      return false;
    }
    setSortableImages(response.data.images);
    setSelectedCategory(response.data.category_id);
    setSelectedMerchant(
      filteredMerchants.find((mer) => (mer.id = response.data.merchant_id))
    );
    setItem(response.data);
    setIsLoading(false);
    getMerchants(null, response.data.merchant_id);
  };

  const getCategories = async () => {
    const response = await CategoryService.getCategories();
    setCategories(response.data);
  };

  useEffect(() => {
    if (!isAddMode) {
      getData();
    }
  }, [id, isAddMode]);

  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (event, lang) => {
    const name = event.target.name;
    const value = event.target.value;

    if (lang) {
      setItem({ ...item, [lang]: { ...item?.[lang], [name]: value } });
    }

    if (!lang) {
      setItem({ ...item, [name]: typeToValue(value) });
    }
  };

  const getMerchants = (event = null, merchant_id = null) => {
    MerchantService.getAllMerchants({
      filters: {
        name: { value: event?.query ?? "" },
      },
    }).then((response) => {
      setFilteredMerchants(response.data);
      const id = merchant_id || item?.merchant_id;
      if (id) {
        selectMerchant(id, response.data);
      }
    });
  };

  const selectMerchant = (id, data = null) => {
    const element = [...(data ? data : filteredMerchants)].find((user) => {
      return user.id.toString() === id.toString();
    });
    setSelectedMerchant(element);
  };

  const handleSave = () => {
    let formData = new FormData();
    formData = mapTranslations(formData);
    formData.append("merchant_id", selectedMerchant?.id ?? "");
    formData.append("price", item.price);
    formData.append("url", item.url);
    formData.append("product_code", item.product_code);
    formData.append("category_id", selectedCategory ?? "");
    formData.append("has_delivery", boolToInt(item.has_delivery));
    formData.append("is_active", boolToInt(item.is_active));
    formImages.forEach((file, index) => {
      formData.append(`images[${index}][file]`, file);
      formData.append(`images[${index}][sort_order]`, index);
    });
    id ? update(formData) : store(formData);
  };

  const mapTranslations = (formData) => {
    langs.map((lang) => {
      formData.append(`${lang}[title]`, item?.[lang]?.["title"] ?? "");
      formData.append(`${lang}[desc]`, item?.[lang]?.["desc"] ?? "");
    });
    return formData;
  };

  const store = async (formData) => {
    const response = await ProductService.store(formData);
    if (response.success) {
      navigate(routeUrl(routes, "product.index"));
    } else if (response.errors) {
      setErrors(response.errors);
    }
  };

  const update = async (formData) => {
    formData.append("_method", "PUT");

    const response = await ProductService.update(formData, id);
    if (response.success) {
      setErrors({});
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: "Merchant updated",
        life: 3000,
      });
      window.location.reload();
    } else if (response.errors) {
      setErrors(response.errors);
    }
  };

  const fileUploadItemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          onClick={() => {
            setFormImages(
              formImages.filter(
                (fileItem) => fileItem.objectURL !== file.objectURL
              )
            );
            props.onRemove();
          }}
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
        />
      </div>
    );
  };

  const onSortEnd = async (oldIndex, newIndex) => {
    let newData = arrayMoveImmutable(sortableImages, oldIndex, newIndex);
    setSortableImages(newData);

    newData = newData.map((item, index) => {
      item["sort_order"] = index;
      return item;
    });

    await ProductService.sortImages(newData);
  };

  return (
    <Fragment>
      <Breadcrumb
        items={[
          { label: "Products", url: routeUrl(routes, "product.index") },
          {
            label: isAddMode ? "Add" : id,
          },
        ]}
      />
      <section className="user">
        <div className="card">
          <div className="grid">
            <div className="col-8">
              <div className="grid flex flex-wrap">
                <div className="col-12">
                  <TabView
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                  >
                    {langs &&
                      langs.map((lang, i) => (
                        <TabPanel
                          key={i}
                          header={
                            <LangTitle
                              title={lang}
                              error={
                                errors?.[`${lang}.title`] ??
                                errors?.[`${lang}.desc`]
                              }
                            />
                          }
                        >
                          <div className="card">
                            <div className="formgrid grid">
                              <div className="col">
                                <label htmlFor="title">Title</label>
                                <input
                                  id="title"
                                  type="text"
                                  name="title"
                                  value={item?.[lang]?.title ?? ""}
                                  onChange={(e) => handleChange(e, lang)}
                                  className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                />
                                {errors?.[`${lang}.title`] && (
                                  <small className="p-error">
                                    {errors?.[`${lang}.title`]}
                                  </small>
                                )}
                              </div>
                              <div className="col">
                                <label htmlFor="title">Description</label>
                                <textarea
                                  id="desc"
                                  rows={1}
                                  className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                  name="desc"
                                  onChange={(e) => handleChange(e, lang)}
                                  value={item?.[lang]?.desc ?? ""}
                                />
                                {errors?.[`${lang}.desc`] && (
                                  <small className="p-error">
                                    {errors?.[`${lang}.desc`]}
                                  </small>
                                )}
                              </div>
                            </div>
                          </div>
                        </TabPanel>
                      ))}
                  </TabView>
                </div>
                <div className="col-4">
                  <label htmlFor="name">Merchant</label>
                  <br />
                  <AutoComplete
                    style={{ width: "100%" }}
                    value={selectedMerchant}
                    suggestions={filteredMerchants}
                    completeMethod={(event) => getMerchants(event)}
                    virtualScrollerOptions={{ itemSize: 31 }}
                    field={(data) => `${data.name} ${data.surname}`}
                    dropdown
                    onChange={(e) => setSelectedMerchant(e.target.value)}
                  />
                  {errors?.merchant_id && (
                    <small id="username-help" className="p-error">
                      {errors.merchant_id}
                    </small>
                  )}
                </div>
                <div className="col-2">
                  <label htmlFor="title">Price</label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={item?.price ?? ""}
                    onChange={(e) => handleChange(e)}
                    className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                  />
                  {errors?.["price"] && (
                    <small className="p-error">{errors?.["price"]}</small>
                  )}
                </div>
                <div className="col-2">
                  <label htmlFor="title">Product code</label>
                  <input
                    id="product_code"
                    type="text"
                    name="product_code"
                    value={item?.product_code ?? ""}
                    onChange={(e) => handleChange(e)}
                    className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                  />
                  {errors?.["product_code"] && (
                    <small className="p-error">
                      {errors?.["product_code"]}
                    </small>
                  )}
                </div>
                <div className="col-2">
                  <label htmlFor="title">Product url</label>
                  <input
                    id="url"
                    type="text"
                    name="url"
                    value={item?.url ?? ""}
                    onChange={(e) => handleChange(e)}
                    className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                  />
                  {errors?.["url"] && (
                    <small className="p-error">{errors?.["url"]}</small>
                  )}
                </div>
                <div className="field col-6 md:col-6">
                  <span className="p-float-label">
                    <Dropdown
                      value={selectedCategory}
                      options={categories}
                      onChange={(e) => setSelectedCategory(e.value)}
                      optionLabel="title"
                      placeholder="Select a category"
                      optionValue="id"
                    />

                    <label htmlFor="inputtext">Category</label>
                  </span>
                  {errors?.category_id && (
                    <small id="username-help" className="p-error">
                      {errors.category_id}
                    </small>
                  )}
                </div>
                <div className="col-2">
                  <label htmlFor="">Has delivery</label>
                  <br />
                  <InputSwitch
                    checked={item?.has_delivery}
                    name={"has_delivery"}
                    onChange={(e) => handleChange(e)}
                  />

                  {errors?.has_delivery && (
                    <small id="username-help" className="p-error">
                      {errors.has_delivery}
                    </small>
                  )}
                </div>
                <div className="col-2">
                  <label htmlFor="">Active</label>
                  <br />
                  <InputSwitch
                    checked={item?.is_active}
                    name={"is_active"}
                    onChange={(e) => handleChange(e)}
                  />

                  {errors?.is_active && (
                    <small id="username-help" className="p-error">
                      {errors.is_active}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <div className="col-4">
              <div>
                <label htmlFor="">Images</label>
                <br />
                {errors?.images && (
                  <small id="username-help" className="p-error">
                    {errors.images}
                  </small>
                )}
                <FileUpload
                  customUpload={true}
                  name="images[]"
                  chooseOptions={{ iconOnly: true }}
                  uploadOptions={{ iconOnly: true, style: { display: "none" } }}
                  itemTemplate={fileUploadItemTemplate}
                  onSelect={(e) => setFormImages([...e.files])}
                  onClear={() => setFormImages([])}
                  multiple
                  accept="image/*"
                />
              </div>
              <div>
                <SortableList
                  onSortEnd={onSortEnd}
                  className="sortable-image-list"
                  draggedItemClassName="dragged"
                >
                  {sortableImages.map((item) => (
                    <ProductImage
                      callback={() => getData()}
                      key={item.id}
                      item={item}
                    />
                  ))}
                </SortableList>
              </div>
            </div>
          </div>
          <Button
            type="button"
            label="Save"
            className="flex-start"
            onClick={() => handleSave()}
          />
        </div>
      </section>
    </Fragment>
  );
};

export default Forms;
