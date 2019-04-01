import React, { Component } from 'react';
import './App.css';
import 'echarts/map/js/china';
import DetailsTable from './Component/DetailsTable';
import Bar from './Component/Bar';
import Radar from './Component/Radar';
import Line from './Component/Line';
import Map from './Component/Map';
class App extends Component {
  state = {};
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    fetch('http://122.112.218.148:15666/v_answer')
      .then(resp => {
        return resp.clone().json();
      })
      .then(res => {
        if (res && res instanceof Array) {
          const data = res.map(i => i.wide);
          // this.initMapChart(data);
          this.setState({
            allData: data,
            currentData: data[0]
          });
        } else {
          this.setState({
            noData: true
          });
        }
      });
  };

  initRadarChart = data => {
    this.setState({
      currentData: data
    });
  };
  setTableData = (data, name) => {
    this.setState({
      tableData: data,
      tableName: name
    });
  };
  render() {
    const { tableData, columns, noData, allData = [], currentData = {}, tableName = '' } = this.state;
    return (
      <div className="App" style={{ padding: '20px' }}>
        {noData && <p>没有数据...</p>}
        {!noData && (
          <div>
            <div style={{ display: 'flex' }}>
              <Line data={allData} />
              <Bar data={allData} initRadarChart={this.initRadarChart} />
              <Radar data={currentData} />
            </div>

            <div style={{ display: 'flex' }}>
              <Map data={allData} setTableData={this.setTableData} />
              <div style={{ width: '50%', height: '500px' }}>
                <DetailsTable data={tableData} tableName={tableName}/>
              </div>
            </div>
          </div>
        )}
        <p style={{ margin: '30px 0' }}>
          {' '}
          <a href="https://github.com/zlx362211854/ICU-charts" target="_blank">
            view on github
          </a>
        </p>
      </div>
    );
  }
}

export default App;
