import React, {useState, useEffect, Fragment, useRef} from "react";
import {TreeTable} from "primereact/treetable";
import {Column} from "primereact/column";
import Breadcrumb from "./components/breadcrumb/Breadcrumb";
import "./steps.scss";
import stepService from "./step.service";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import {toast} from "../../routes";
import LeftToolbarTemplate from "../../common/templates/TableLeft/left-toolbar-template";
import TableAction from "../../common/components/tableAction/TableAction";

const Index = () => {
    const [nodes, setNodes] = useState([]);
    const modifyData = (steps) => {
        let cKey = 0;
        return steps.map((step, index) => {
            let parent_id = step.parent_id !== null ? step.parent_id : 0;

            if (step.parent_id) {
                cKey = step.parent_id + "-" + index + "-" + step.id;
            } else {
                cKey = step.id + "-" + index;
            }

            return {
                key: cKey,
                data: {
                    title: step.title,
                    gender: step.gender,
                    parent_id: parent_id,
                },
                children: step.children.length === 0 ? [] : modifyData(step.children),
            };
        });
    };

    const getSteps = async () => {
        const steps = await stepService.getSteps();
        if (steps !== false) {
            setNodes(steps.data);
        }
    }

    useEffect(() => {
        getSteps();
    }, []);

    const deleteStep = async (id) => {
        const response = await stepService.deleteStep(id);
        if (!response) {
            return false;
        }
        toast.current.show({
            severity: "success",
            summary: "Succes Message",
            detail: "Data is deleted",
            life: 3000,
        });
        getSteps();
    };

    const actionTemplate = (node, column) => {
        console.log(node);
        const id =
            node.data.parent_id === 0
                ? node.key.split("-")[0]
                : node.key.split("-")[node.key.split("-").length - 1];
        return (
            <div>
                <Link to={`/steps/addedit/` + id}>
                    <Button
                        type="button"
                        icon="pi pi-pencil"
                        className="p-button-warning"
                        style={{marginRight: ".5em"}}
                    ></Button>
                </Link>

                <Button
                    onClick={() => deleteStep(id)}
                    type="button"
                    icon="pi pi-trash"
                    className="p-button-warning"
                ></Button>
            </div>
        );
    };

    return (
        <>
            <Breadcrumb items={[{label: "Steps"}]}/>
            <section className="steps">
                <div className="treetable-responsive-demo">
                    <div className="card">
                        <Toolbar
                            className="mb-4"
                            left={<LeftToolbarTemplate name={'step'}/>}
                        ></Toolbar>
                        <TreeTable value={nodes} header="Responsive">
                            <Column
                                field="id"
                                header="id"
                                body={row => row.id}
                                expander/>
                            <Column
                                field="title"
                                body={row => row.title}
                                header="Title"
                            />
                            <Column
                                field="gender"
                                header="Gender"
                                body={row => row.gender}
                                headerClassName="sm-invisible"
                                bodyClassName="sm-invisible"
                            />
                            <Column
                                field="parent_id"
                                body={row => row.parent_id}
                                header="Parent"
                                headerClassName="sm-invisible"
                                bodyClassName="sm-invisible"
                            />
                            <Column
                                body={data => <TableAction data={data} name={'step'} deleteItem={id => deleteStep(id)}/>}
                                style={{textAlign: "center", width: "10rem"}}
                            />
                        </TreeTable>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Index;
