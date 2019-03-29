import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {map, salary, rest} from '../lib/opt';
export default class DetailsTable extends Component {
  state = {
    columns: [
      {
        Header: '公司名称',
        accessor: 'Q1'
      },
      {
        Header: '部门',
        accessor: 'Q2'
      },
      {
        Header: '职位',
        accessor: 'Q3'
      },
      {
        Header: '加班情况',
        accessor: 'Q4',
        Cell: props => <span>{map[props.value]}</span>
      },
      {
        Header: '加班工资',
        accessor: 'Q5',
        Cell: props => <span>{salary[props.value]}</span>
      },
      {
        Header: '加班调休',
        accessor: 'Q6',
        Cell: props => <span>{rest[props.value]}</span>
      }
    ]
  }
  render() {
    const {columns} = this.state;
    const {data = []} = this.props;
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