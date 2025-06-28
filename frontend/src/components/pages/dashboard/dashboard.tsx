import { useEffect, useRef, useState } from "react";
import { setPageTitle } from "../../../utils/titleUtils";
import { Card, Col, Row } from "antd";
import "./dashboard.css";

import ReactDOM from "react-dom";
import useDashboard from "./hooks/useDashboard";
import { Chart } from "chart.js/auto";
// import { Column } from "@ant-design/plots";

function DashboardPage() {
  const [data, setData] = useState([]);
  const { totalCustomer, totalCredit, totalDebit } = useDashboard();

  const chartRef: any = useRef(null);
  const chartRef2: any = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    // Check if there is an existing Chart instance
    if (ctx && chartRef.current.chart) {
      // Destroy the existing Chart instance
      chartRef.current.chart.destroy();
    }

    chartRef.current.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const ctx2 = chartRef2.current?.getContext("2d");
    if (ctx2 && chartRef2.current.chart) {
      // Destroy the existing Chart instance
      chartRef2.current.chart.destroy();
    }
    if (ctx2) {
      chartRef2.current.chart = new Chart(ctx2, {
        type: "pie",
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, []);

  return (
    <>
      <h1>Dashboard Page</h1>
      <Row gutter={24}>
        <Col span={6}>
          <Card title="Total Customers" bordered={false} style={{ width: 250 }}>
            <p
              style={{
                fontSize: "50px",
                fontWeight: "bolder",
                marginBottom: "10px",
                marginLeft: "25px",
                opacity: "0.5",
              }}
            >
              {totalCustomer}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Credits" bordered={false} style={{ width: 250 }}>
            <p
              style={{
                fontSize: "50px",
                fontWeight: "bolder",
                marginBottom: "10px",
                marginLeft: "25px",
                opacity: "0.5",
              }}
            >
              {totalCredit}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Debits" bordered={false} style={{ width: 250 }}>
            <p
              style={{
                fontSize: "50px",
                fontWeight: "bolder",
                marginBottom: "10px",
                marginLeft: "25px",
                opacity: "0.5",
              }}
            >
              {totalDebit}
            </p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Expense" bordered={false} style={{ width: 250 }}>
            <p
              style={{
                fontSize: "50px",
                fontWeight: "bolder",
                marginBottom: "10px",
                marginLeft: "25px",
                opacity: "0.5",
              }}
            >
              10
            </p>
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <canvas ref={chartRef} width="100" height="100"></canvas>
        </Col>
        <Col span={2}></Col>
        <Col span={8}>
          <canvas ref={chartRef2} width="100" height="100" />
        </Col>
      </Row>

      <div></div>
    </>
  );
}

export default DashboardPage;
