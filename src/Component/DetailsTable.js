import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import {map, salary, rest} from '../lib/opt';
export default class DetailsTable extends Component {
  state = {
    columns: [
      {
        Header: '公司名称',
        accessor: 'Q1',
        Cell: props => <span title={props.value}>{props.value}</span>
      },
      {
        Header: '部门',
        accessor: 'Q2',
        Cell: props => <span title={props.value}>{props.value}</span>
      },
      {
        Header: '职位',
        accessor: 'Q3',
        Cell: props => <span title={props.value}>{props.value}</span>
      },
      {
        Header: '加班情况',
        accessor: 'Q4',
        Cell: props => <span title={map[props.value]}>{map[props.value]}</span>
      },
      {
        Header: '加班工资',
        accessor: 'Q5',
        Cell: props => <span title={salary[props.value]}>{salary[props.value]}</span>
      },
      {
        Header: '加班调休',
        accessor: 'Q6',
        Cell: props => <span title={rest[props.value]}>{rest[props.value]}</span>
      }
    ],
    page: 0
  }
  componentWillReceiveProps(newProps) {
    const {tableName: prevTableName} = this.props;
    const {tableName} = newProps;
    if (prevTableName !== tableName) {
      this.setState({
        page: 0
      })
    }
  }
  onPageChange = (pageIndex) => {
    this.setState({
      page: pageIndex
    })
  }
  render() {
    const {columns, page} = this.state;
    const {data = []} = this.props;
    return (
      <div>
        <ReactTable
          style={{height: '500px'}}
          data={data}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
          page={page}
          onPageChange={this.onPageChange}
        />
      </div>
    )
  }
}