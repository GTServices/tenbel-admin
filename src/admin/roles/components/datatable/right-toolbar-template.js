import React from "react";
import { Button } from "primereact/button";

const RightToolbarTemplate = ({ dt }) => {
  
  return (
    <React.Fragment>
      <Button
        label="Export"
        icon="pi pi-upload"
        onClick={() => dt.current.exportCSV()}
        className="p-button-help"
      />
    </React.Fragment>
  );
};


export default React.memo(RightToolbarTemplate);
