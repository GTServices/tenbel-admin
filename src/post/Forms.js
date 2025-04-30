import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import PostService from "./post.service";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";
import "./form.scss";
import { toast } from "../routes";
import { boolToInt, routeUrl, typeToValue } from "../common/utils/helpers";
import routes from "./routes";
import { InputSwitch } from "primereact/inputswitch";
import { useSelector } from "react-redux";
import { TabPanel, TabView } from "primereact/tabview";
import LangTitle from "../common/components/langTitle/LangTitle";
import ImageUpload from "../common/components/imageUpload/ImageUpload";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const Forms = () => {
  const params = useParams();
  const id = Number(params?.id);
  const { langs } = useSelector((state) => state.langs);
  const isAddMode = !id;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [item, setItem] = useState({});
  const [image, setImage] = useState(null);
  let navigate = useNavigate();

  const getData = async () => {
    setIsLoading(true);
    const response = await PostService.get(id);
    if (!response) {
      return false;
    }
    setItem(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isAddMode) {
      getData();
    }
  }, [id, isAddMode]);

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

  const handleSave = () => {
    let formData = new FormData();
    formData = mapTranslations(formData);
    formData.append("is_active", boolToInt(item.is_active));
    if (image) {
      formData.append("image", image);
    }
    id ? update(formData) : store(formData);
  };

  const mapTranslations = (formData) => {
    langs.map((lang) => {
      formData.append(`${lang}[title]`, item?.[lang]?.["title"] ?? "");
      formData.append(
        `${lang}[description]`,
        item?.[lang]?.["description"] ?? ""
      );
      formData.append(`${lang}[slug]`, item?.[lang]?.["slug"] ?? "");
    });
    return formData;
  };

  const store = async (formData) => {
    const response = await PostService.store(formData);
    if (response.success) {
      navigate(routeUrl(routes, "post.index"));
    } else if (response.errors) {
      setErrors(response.errors);
    }
  };

  const update = async (formData) => {
    formData.append("_method", "PUT");

    const response = await PostService.update(formData, id);
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

  return (
    <Fragment>
      <Breadcrumb
        items={[
          { label: "Posts", url: routeUrl(routes, "post.index") },
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
                      !isLoading &&
                      langs.map((lang, i) => (
                        <TabPanel
                          key={i}
                          header={
                            <LangTitle
                              title={lang}
                              error={
                                errors?.[`${lang}.title`] ??
                                errors?.[`${lang}.desc`] ??
                                errors?.[`${lang}.slug`]
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
                                <label htmlFor="title">Slug</label>
                                <input
                                  id="slug"
                                  type="text"
                                  name="slug"
                                  value={item?.[lang]?.slug ?? ""}
                                  onChange={(e) => handleChange(e, lang)}
                                  className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                                />
                                {errors?.[`${lang}.slug`] && (
                                  <small className="p-error">
                                    {errors?.[`${lang}.slug`]}
                                  </small>
                                )}
                              </div>
                              <div className="col">
                                <label htmlFor="title">Description</label>
                                <CKEditor
                                  editor={ClassicEditor}
                                  data={item?.[lang]?.description ?? ""}
                                  onChange={(event, editor) => {
                                    const data = editor.getData();
                                    if (data !== item[lang]?.description) {
                                      handleChange(
                                        {
                                          target: {
                                            name: "description",
                                            value: data,
                                          },
                                        },
                                        lang
                                      );
                                    }
                                  }}
                                />
                                {errors?.[`${lang}.description`] && (
                                  <small className="p-error">
                                    {errors?.[`${lang}.description`]}
                                  </small>
                                )}
                              </div>
                            </div>
                          </div>
                        </TabPanel>
                      ))}
                  </TabView>
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
                <label htmlFor="">Image</label>
                <div className="field col-6 md:col-6">
                  <ImageUpload
                    src={image ? URL.createObjectURL(image) : item?.image}
                    onChange={(e) => setImage(e.target.files[0])}
                    error={errors?.image}
                  />
                </div>
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
