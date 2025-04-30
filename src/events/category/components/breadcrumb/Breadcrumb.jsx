import React from "react";
import { BreadCrumb } from "primereact/breadcrumb";

const Breadcrumb = ({items}) => {
  

  const home = {
    icon: "pi pi-home",
    url: "/",
  };
  
  return (
    <div className="breadcrumb">
      <div className="card">
        <BreadCrumb model={items} home={home} />
      </div>
    </div>
  );
};

export default Breadcrumb;
