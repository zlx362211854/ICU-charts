import React, { Component } from 'react';
import echarts from 'echarts';
import './App.css';
import 'echarts/map/js/china';
import { china } from './china';
import DetailsTable from './Component/DetailsTable';
const map = { 1: '经常996', 2: '偶尔996', 3: '不996' };
const salary = { 1: '两倍以上', 2: '小于两倍', 3: '没有' };
const rest = { 1: '可以调休', 2: '原则上可以调休', 3: '不可以' };
class App extends Component {
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
  };
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
          this.initLineChart(data);
          this.initMapChart(data);
          this.initBarchart(data);
        } else {
          this.setState({
            noData: true
          });
        }
      });
  };
  initLineChart = data => {
    const dom = document.getElementById('icu-line-charts');
    const myChart = echarts.init(dom);

    const option = {
      title: {
        text: '加班情况统计折线图',
        subtext: '数据来自https://cloudqa.iego.cn/sr/icu996'
      },
      tooltip: {
        trigger: 'item',
        formatter: '公司名称：{b}: <br/>加班情况：{c}',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['不996', '偶尔996', '经常996']
      },
      xAxis: {
        type: 'category',
        data: data.map(i => i.Q1)
      },
      yAxis: {
        type: 'category',
        data: ['不996', '偶尔996', '经常996']
      },
      series: [
        {
          data: data
            .map(i => i.Q4[0])
            .map(i => {
              return map[i];
            }),
          type: 'line'
        }
      ],
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 65,
          end: 85
        }
      ]
    };
    myChart.setOption(option);
    myChart.on('click', function(params) {
      // const {  } = params;
    });
  };
  initMapChart = data => {
    const _this = this;
    const dom = document.getElementById('icu-map-charts');
    const myChart = echarts.init(dom);
    const city = china.map(i => i.children);
    let coordMap = [];
    city.forEach(i => {
      coordMap = coordMap.concat(i);
    });
    // fix data
    const cityArr = [...new Set(data.map(i => i.Q8))];
    const realCity = [];
    cityArr.forEach((i, idx) => {
      coordMap.forEach(l => {
        if (i == l.name) {
          realCity.push(i);
        }
      });
    });
    const realData = [];
    realCity.forEach(i => {
      const currentCityData = [];
      data.forEach(l => {
        if (l.Q8 == i && l.Q4[0]) {
          currentCityData.push(l);
        }
      });
      realData.push({
        name: i,
        data: currentCityData
      });
    });
    const geoCoordMap = {};
    coordMap.forEach(i => {
      geoCoordMap[i.name] = [i.log, i.lat];
    });
    var convertData = function(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord,
            data: data[i].data
          });
        }
      }
      return res;
    };

    const option = {
      title: {
        text: '区域分布',
        subtext: '数据来自https://cloudqa.iego.cn/sr/icu996'
      },
      tooltip: {
        trigger: 'item',
        formatter: val => {
          const {
            data: { data = [] },
            name
          } = val;
          return `${name}区域加班情况：<br/> 共有<span style='color: #f8d047'>${
            data.length
          }</span>家公司，点击查看详情`;
        },
        extraCssText: 'text-align: left'
      },
      geo: {
        map: 'china',
        roam: true,
        label: {
          emphasis: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#323c48',
            borderColor: '#111'
          },
          emphasis: {
            areaColor: '#2a333d'
          }
        }
      },
      series: [
        {
          name: '区域情况',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: convertData(realData),
          symbolSize: 12,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            emphasis: {
              borderColor: '#fff',
              borderWidth: 1
            }
          }
        }
      ]
    };
    myChart.setOption(option);
    myChart.on('click', function(params) {
      const { data: { data } = {} } = params;
      _this.setState({
        tableData: data
      });
    });
    myChart.on('georoam', function(params) {});
  };
  initBarchart = data => {
    const cityArr = data.map(i => i.Q1);
    const dom = document.getElementById('icu-bar-charts');
    const myChart = echarts.init(dom);
    const option = {
      title: {
        text: '加班情况统计条形图',
        subtext: '数据来自https://cloudqa.iego.cn/sr/icu996'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: val => {
          const Q4 = val[0]; // 加班情况
          const Q5 = val[1]; // 加班工资
          const Q6 = val[0]; // 加班调休
          return `公司名称：${Q4.name}<br/>加班情况：${
            map[Q4.value]
          }<br/>加班工资：${salary[Q5.value]}<br/>加班调休：${rest[Q6.value]}`;
        },
        extraCssText: 'text-align: left'
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: cityArr,
        axisLabel: {
          formatter: value => {
            return value.slice(0, 4) + '...';
          }
        }
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          yAxisIndex: [0],
          left: '93%',
          start: 29,
          end: 30
        },
        {
          type: 'inside',
          yAxisIndex: [0],
          start: 29,
          end: 30
        }
      ],
      series: [
        {
          name: '加班情况',
          type: 'bar',
          data: data.map(i => i.Q4[0])
        },
        {
          name: '加班工资',
          type: 'bar',
          data: data.map(i => i.Q5[0])
        },
        {
          name: '加班调休',
          type: 'bar',
          data: data.map(i => i.Q6[0])
        }
      ]
    };
    myChart.setOption(option);
  };
  render() {
    const { tableData, columns, noData } = this.state;
    return (
      <div className="App">
        {noData && <p>没有数据...</p>}
        {!noData && (
          <div>
            <div style={{ display: 'flex' }}>
              <div
                id="icu-line-charts"
                style={{ width: '50%', height: '500px' }}
              />
              <div
                id="icu-bar-charts"
                style={{ width: '50%', height: '500px' }}
              />
            </div>

            <div style={{ display: 'flex' }}>
              <div
                id="icu-map-charts"
                style={{ width: '50%', height: '500px' }}
              />
              <div style={{ width: '50%', height: '500px' }}>
                <DetailsTable data={tableData} columns={columns} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
