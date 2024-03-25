import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { Bar } from "react-chartjs-2";
import { MoreVertical } from "react-feather";
import { rgba } from "polished";
import dieselFetch from "../../../utils/dieselFetch";
import useAuth from "../../../hooks/useAuth";

import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 320px;
  width: 100%;
`;

const transformData = (data) => {
  const monthData = Array.from({ length: 12 }, () => ({
    prices: 0,
    gallons: 0,
  }));

  data.forEach((obj) => {
    const date = new Date(obj.date);
    const month = date.getMonth(); // Obtém o mês (0 a 11)

    monthData[month].prices += parseFloat(obj.price);
    monthData[month].gallons += parseInt(obj.gallons);
  });

  return monthData;
};

const BarChart = ({ theme }) => {
  const context = useAuth();
  const [monthData, setMonthData] = useState(
    Array.from({ length: 12 }, () => ({ prices: 0, gallons: 0 }))
  );

  useEffect(() => {
    dieselFetch("GET", null, context.id).then((data) => {
      const transformedData = transformData(data);
      setMonthData(transformedData);
    });
  }, [context.id]);

  const firstDatasetColor = theme.palette.secondary.main;
  const secondDatasetColor = rgba(theme.palette.secondary.main, 0.33);

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Price",
        backgroundColor: firstDatasetColor,
        borderColor: firstDatasetColor,
        hoverBackgroundColor: firstDatasetColor,
        hoverBorderColor: firstDatasetColor,
        data: monthData.map((item) => item.prices),
        barPercentage: 0.4,
        categoryPercentage: 0.5,
      },
      {
        label: "Gallons",
        backgroundColor: secondDatasetColor,
        borderColor: secondDatasetColor,
        hoverBackgroundColor: secondDatasetColor,
        hoverBorderColor: secondDatasetColor,
        data: monthData.map((item) => item.gallons),
        barPercentage: 0.4,
        categoryPercentage: 0.5,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        stacked: true,
      },
      x: {
        stacked: true,
        grid: {
          color: "transparent",
        },
      },
    },
  };

  return (
    <Card mb={6}>
      <CardHeader
        action={
          <IconButton aria-label="settings" size="large">
            <MoreVertical />
          </IconButton>
        }
        title="Gallons & Prices"
        subheader="Total gallons and price Usage by Month"
      />

      <CardContent>
        <ChartWrapper>
          <Bar data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};

export default withTheme(BarChart);
