import React, { Component } from 'react';
import echarts from 'echarts';
import {map} from '../lib/opt';
export default class Line extends Component {
  componentWillReceiveProps(newProps) {
    const {data = []} = newProps;
    const {data: prevData} = this.props;;
    if (prevData.length != data.length) {
      this.initLineChart(data);
    }
  }
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
  render() {
    return (
      <div id="icu-line-charts" style={{ width: '40%', height: '500px' }} />
    );
  }
}
