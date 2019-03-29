import React, { Component } from 'react';
import echarts from 'echarts';
import { china } from '../lib/china';
export default class Map extends Component {
  componentWillReceiveProps(newProps) {
    const {data = []} = newProps;
    const {data: prevData} = this.props;;
    if (prevData.length != data.length) {
      this.initMapChart(data);
    }
  }
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
      const {data: {data} = {}} = params;
      _this.props.setTableData(data);
    });
    myChart.on('georoam', function(params) {});
  };
  render() {
    return (
      <div id="icu-map-charts" style={{ width: '50%', height: '500px' }} />
    );
  }
}
