import { useState } from "react";

const usePagination = (initialParams = { first: 0, rows: 10, page: 1 }) => {
  const [lazyParams, setLazyParams] = useState(initialParams);

  const onPage = (e) => {
    setLazyParams((prevState) => ({
      ...prevState,
      first: e.first,
      rows: e.rows,
      page: e.page + 1,
    }));
  };

  return [lazyParams, setLazyParams, onPage];
};

export default usePagination;
