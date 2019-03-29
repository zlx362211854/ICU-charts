import React, { Component } from 'react';
import echarts from 'echarts';
import { mapReverse, salary, rest } from '../lib/opt';
export default class Radar extends Component {
  componentWillReceiveProps(newProps) {
    const {data = {}} = newProps;
    const {data: prevData} = this.props;
    if (prevData.Q1 != data.Q1) {
      this.initRadarChart(data);
    }
  }
  initRadarChart = data => {
    const dom = document.getElementById('icu-radar-charts');
    const myChart = echarts.init(dom);
    const option = {
      title: {
        text: data.Q1 || '基础雷达图',
        subtext: '数据来自https://cloudqa.iego.cn/sr/icu996'
      },
      tooltip: {
        formatter: val => {
          const Q4 = val.data.value[0]; // 加班情况
          const Q5 = val.data.value[1]; // 加班工资
          const Q6 = val.data.value[2]; // 加班调休
          return `加班情况：<br/>${mapReverse[Q4]}<br/>加班工资：${
            salary[Q5]
          }<br/>加班调休：${rest[Q6]}`;
        },
        extraCssText: 'text-align: left'
      },
      radar: {
        shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: '加班情况', max: 3 },
          { name: '加班工资', max: 3 },
          { name: '加班调休', max: 3 }
        ],
        radius: 80,
        center: ['50%', '60%']
      },
      series: [
        {
          name: '公司情况',
          type: 'radar',
          data: [
            {
              value: [
                data.Q4 == 1 ? 3 : data.Q4 == 3 ? 1 : 2,
                data.Q5,
                data.Q6
              ],
              name: '公司情况'
            }
          ],
          itemStyle: { normal: { areaStyle: { type: 'default' } } }
        }
      ]
    };
    myChart.setOption(option);
  };
  render() {
    return (
      <div id="icu-radar-charts" style={{ width: '20%', height: '500px' }} />
    );
  }
}
