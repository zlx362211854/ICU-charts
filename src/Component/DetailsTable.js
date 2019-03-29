import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
export default class DetailsTable extends Component {
  render() {
    const {data = [], columns = []} = this.props;
    return (
      <div>
        <ReactTable
          style={{height: '500px'}}
          data={data}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
        />
      </div>
    )
  }
}