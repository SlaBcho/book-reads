// import 'bootstrap/dist/css/bootstrap.min.css';

import React  from 'react';
import { PaginationControl } from 'react-bootstrap-pagination-control';

const Pagination = ({ onChangeHandler, page,totalItems }) => {

    return (<PaginationControl
        page={page}
        between={4}
        total={totalItems}
        limit={12}
        changePage={(page) => onChangeHandler(page)}
        ellipsis={1}
    />);
};


export default Pagination;