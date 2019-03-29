import React, { Component } from 'react';
import echarts from 'echarts';
import {mapReverse, salary, rest} from '../lib/opt';
export default class Bar extends Component {
  componentWillReceiveProps(newProps) {
    const {data = []} = newProps;
    const {data: prevData} = this.props;;
    if (prevData.length != data.length) {
      this.initBarchart(data);
    }
  }
  initBarchart = data => {
    const _this = this;
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
          const Q6 = val[2]; // 加班调休
          return `公司名称：${Q4.name}<br/>加班情况：${
            mapReverse[Q4.value]
          }<br/>加班工资：${salary[Q5.value]}<br/>加班调休：${
            rest[Q6.value]
          }<br/>点击查看更多`;
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
            return value.slice(0, 3) + '...';
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
          data: data.map(i => (i.Q4[0] == 1 ? 3 : i.Q4[0] == 3 ? 1 : 2))
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
    myChart.on('click', function(params) {
      const { dataIndex } = params;
      const currentData = data[dataIndex];
      _this.props.initRadarChart(currentData);
    });
  };
  render() {
    return (
      <div id="icu-bar-charts" style={{ width: '40%', height: '500px' }} />
    );
  }
}
