import React, { Component } from 'react';
import echarts from 'echarts';
import './App.css';
import 'echarts/map/js/china';
import { china } from './china';
const map = { 1: '经常996', 2: '偶尔996', 3: '不996' };
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
        const data = res.map(i => i.wide);
        this.initLineChart(data);
        this.initMapChart(data);
      });
  };
  initLineChart = data => {
    const dom = document.getElementById('icu-line-charts');
    const myChart = echarts.init(dom);

    const option = {
      title: {
        text: '加班情况'
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
  };
  initMapChart = data => {
    const dom = document.getElementById('icu-radar-charts');
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
        text: '区域分布'
      },
      tooltip: {
        trigger: 'item',
        formatter: val => {
          const {
            data: { data = [] },
            name
          } = val;
          const arr = [`${name}区域加班情况：`];
          data.forEach(i => {
            switch (i.Q4[0]) {
              case 1:
                arr.push(`${i.Q1}：<span style='color: #ee7a30'>${map[i.Q4[0]]}</span>`);
                break;
              case 2:
                arr.push(`${i.Q1}：<span style='color: #f8d047'>${map[i.Q4[0]]}</span>`);
                break;
              case 3:
                arr.push(`${i.Q1}：<span style='color: #baddaa'>${map[i.Q4[0]]}</span>`);
                break;
            }
          });
          return arr.join('<br/>');
        },
        extraCssText: 'text-align: left'
      },
      geo: {
        map: 'china',
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
  };
  render() {
    return (
      <div className="App">
        <div id="icu-line-charts" style={{ width: '100%', height: '500px' }} />
        <div id="icu-radar-charts" style={{ width: '100%', height: '500px' }} />
      </div>
    );
  }
}

export default App;
