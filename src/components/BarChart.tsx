import { Component, onMount } from "solid-js";
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
} from "chart.js";

type Props = {
  data: ChartData;
};

const BarChart: Component<Props> = (props) => {
  let canvas: HTMLCanvasElement;
  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    Chart.register([BarElement, BarController, CategoryScale, LinearScale]);
    // Chart.defaults.color = "black";
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(props.data),
        datasets: [
          {
            label: "Votes",

            data: Object.values(props.data),
            indexAxis: "y",
            backgroundColor: "#FF6B7F",
            borderColor: "black",
          },
        ],
      },
      options: {
        indexAxis: "y",
        scales: {
          y: {
            ticks: {
              color: "black",
              font: {},
            },
          },
          x: {
            ticks: {
              color: "black",
              font: {},
            },
          },
        },
        color: "black",
        font: {
          size: 14,
          family: "Lato",
        },
        backgroundColor: "#FF6B7F",
        borderColor: "black",
      },
    });

    // massPopChart.draw();
  });

  return (
    <div class="bg-ghost border border-black drop-shadow-small">
      <canvas ref={canvas!}></canvas>
    </div>
  );
};

export default BarChart;
