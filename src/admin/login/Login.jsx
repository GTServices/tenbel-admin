import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ProgressSpinner } from "primereact/progressspinner";
import "./login.scss";
import { login } from "../login/slices/login";
import { clearMessage } from "../../common/slices/message";
import { Toast } from "primereact/toast";

export const Login = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.login);
  const { message } = useSelector((state) => state.message);
  const toast = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  const schema = Yup.object().shape({
    username: Yup.string().required("Username is a required field"),

    password: Yup.string()
      .required("Password is a required field")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleLogin = (formValue) => {
    const { username, password } = formValue;

    setLoading(true);

    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        navigate("/");
        window.location.reload();
      })
      .catch((e) => {
        setLoading(false);
      });

      toast.current.show({
        severity: "error",
        summary: "Error Message",
        detail: message,
        life: 3000,
      });
  };
  return (
    <>
      {message && <Toast ref={toast} />}
      {/* Wrapping form inside formik tag and passing our schema to validationSchema prop */}
      <Formik
        validationSchema={schema}
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => handleLogin(values)}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className="login">
            <div className="form">
              {/* Passing handleSubmit parameter tohtml form onSubmit property */}
              <form noValidate onSubmit={handleSubmit}>
                <span>Login</span>
                {/* Our input html with passing formik parameters like handleChange, values, handleBlur to input properties */}
                <input
                  type="text"
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  placeholder="Enter email id / username"
                  className="form-control inp_text"
                  id="username"
                />
                {/* If validation is not passed show errors */}
                <p className="error">
                  {errors.username && touched.username && errors.username}
                </p>
                {/* Our input html with passing formik parameters like handleChange, values, handleBlur to input properties */}
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Enter password"
                  className="form-control"
                />
                {/* If validation is not passed show errors */}
                <p className="error">
                  {errors.password && touched.password && errors.password}
                </p>
                {/* Click on submit button to submit the form */}
                {loading && <ProgressSpinner />}

                {!loading && <button type="submit">Login</button>}
              </form>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
};

export default Login;
