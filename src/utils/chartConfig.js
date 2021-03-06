import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoom'
import dayjs from 'dayjs'

var charts = {}

export const initChart = (option) => {
  charts[option.id] = echarts.init(document.getElementById(option.id), null, {renderer: 'svg'})
  let chartOpention = {
    legend: {
      orient: 'vertical',
      left: '81%',
      right: '1%',
      align: 'left',
      data: option.legendData
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (params) => {
        let sTip = ''
        if (option.id === 'total_chart') {
          sTip = `<b>${params[0].name}</b><br/>`
          for (let i = 0, len = params.length; i < len; i++) {
            if (i < len - 1) {
              sTip += params[i].marker + '<b>' + params[i].seriesName + '</b>：<b>' + params[i].value + '</b><br/>'
            } else {
              sTip += params[i].marker + '<b>' + params[i].seriesName + '</b>：<b>' + params[i].value + '</b>'
            }
          }
        } else {
          switch (option.id) {
            case 'day_chart':
              sTip = params[0].axisValue + '<br/>'
              break
            case 'week_chart':
              if (params[0].dataIndex === 0) {
                sTip = option.queryForm.datetime[0] + ' 至 ' + params[0].axisValue + '<br/>'
              } else {
                sTip = dayjs(params[0].axisValue).startOf('week').format('YYYY-MM-DD') + ' 至 ' + params[0].axisValue + '<br/>'
              }
              break
            case 'month_chart':
              if (params[0].dataIndex === 0) {
                sTip = option.queryForm.datetime[0] + ' 至 ' + params[0].axisValue + '<br/>'
              } else {
                sTip = dayjs(params[0].axisValue).startOf('month').format('YYYY-MM-DD') + ' 至 ' + params[0].axisValue + '<br/>'
              }
              break
            case 'year_chart':
              if (params[0].dataIndex === 0) {
                sTip = option.queryForm.datetime[0] + ' 至 ' + params[0].axisValue + '<br/>'
              } else {
                sTip = dayjs(params[0].axisValue).startOf('year').format('YYYY-MM-DD') + ' 至 ' + params[0].axisValue + '<br/>'
              }
              break
          }
          for (let i = 0, len = params.length; i < len; i++) {
            if (i < len - 1) {
              sTip += params[i].marker + '<b>' + params[i].seriesName + '</b>：<b>' + params[i].value + '</b><br/>'
            } else {
              sTip += params[i].marker + '<b>' + params[i].seriesName + '</b>：<b>' + params[i].value + '</b>'
            }
          }
        }
        return sTip
      }
    },
    dataZoom: [{
      type: 'inside',
      zoomOnMouseWheel: false
    }, {
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }],
    grid: {
      left: '2%',
      right: '20%',
      top: '3%',
      bottom: '50px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#609ee9'
        }
      },
      data: option.xAxisData
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: ['#D4DFF5']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#609ee9'
        }
      },
      axisLabel: {
        formatter: function (val) {
          if (val >= 1000000) {
            val = (val / 1000000) + 'M'
          } else if (val >= 1000) {
            val = (val / 1000) + 'K'
          }
          return val
        }
      }
    },
    series: option.series
  }

  if (option.id === 'total_chart' || option.id === 'year_chart') {
    chartOpention.dataZoom[1].show = false
    chartOpention.grid.bottom = '2%'
  }
  if (option.id === 'total_chart' || option.series.length === 1) {
    chartOpention.grid.right = '4%'
  }
  charts[option.id].setOption(chartOpention, true)
  setTimeout(() => {
    charts[option.id].resize()
  }, 0)
  return charts[option.id]
}

export const totalChartSeries = (seriesData) => {
  let series = [{
    name: '下载数',
    type: 'bar',
    barMaxWidth: '15%',
    barMinWidth: '4%',
    barMinHeight: 1,
    barCategoryGap: '5%',
    data: seriesData,
    label: {
      normal: {
        show: true,
        position: 'top',
        fontSize: '14'
      }
    },
    itemStyle: {
      normal: {
        color: (params) => {
          let colorList = ['rgb(164,205,238)', 'rgb(42,170,227)', 'rgb(25,46,94)', 'rgb(195,229,235)']
          return colorList[params.dataIndex % 4]
        }
      },
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
  return series
}
