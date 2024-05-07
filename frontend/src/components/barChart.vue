<template>
  <div>
    <canvas class="p-10" ref="attendanceChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import { Colors } from 'chart.js';

Chart.register(...registerables)
Chart.register(Colors);

export default {
  props: {
    label: {
      type: Array
    },
    chartData: {
      type: Array
    }
  },
  async mounted() {
    await new Chart(this.$refs.attendanceChart, {
      type: 'bar',
      data: {
        labels: this.label,
        datasets: [
          {
            borderWidth: 1,
            data: this.chartData
          }
        ]
      },
      options: {
        scales: {
          y: {
            ticks: {
              stepSize: 1
            }
          },
          x: {
            gridLines: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Attendance Chart'
          }
        },
        responsive: true,
        maintainAspectRatio: true
      }
    })
  }
}
</script>
