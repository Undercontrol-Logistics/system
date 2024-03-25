import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import dieselFetch from "../../../utils/dieselFetch";
import useAuth from "../../../hooks/useAuth";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { green, red } from "@mui/material/colors";

import Actions from "./Actions";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import USAMap from "./USAMap";
import Stats from "./Stats";
import Table from "./Table";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function SaaS() {
  const { t } = useTranslation();
  const context = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    dieselFetch("GET", null, context.id).then((data) => {
      const transformedData = transformData(data);
      setRows(transformedData);
    });
  }, [context.id]);

  const transformData = (data) => {
    return data.map((obj) => ({
      name: `${obj.city}/${obj.state}`,
      gallons: parseInt(obj.gallons),
      price: parseFloat(obj.price),
      date: new Date(obj.date).toLocaleDateString("en-US"),
      obs: obj.obs,
    }));
  };

  const calculateStats = (data) => {
    const paid = data.reduce((total, obj) => total + obj.price, 0);
    const fuelConsumed = data.reduce((total, obj) => total + obj.gallons, 0);
    const completedFuels = data.length;

    return { paid, fuelConsumed, completedFuels };
  };

  const calculatePercentageChange = (currentValue, previousValue) => {
    if (previousValue === 0) return 0;
    return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
  };

  const currentMonth = new Date().getMonth() + 1;

  const currentMonthData = rows.filter(
    (obj) => new Date(obj.date).getMonth() + 1 === currentMonth
  );

  const previousMonthData = rows.filter(
    (obj) => new Date(obj.date).getMonth() + 1 === currentMonth - 1
  );

  const currentMonthStats = calculateStats(currentMonthData);
  const previousMonthStats = calculateStats(previousMonthData);

  return (
    <React.Fragment>
      <Helmet title="SaaS Dashboard" />
      <Grid justifyContent="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Diesel Dashboard
          </Typography>
        </Grid>

        <Grid item>{/* <Actions /> */}</Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Paid"
            amount={`$${currentMonthStats.paid.toFixed(2)}`}
            chip="Monthly"
            percentagetext={`${calculatePercentageChange(
              currentMonthStats.paid,
              previousMonthStats.paid
            ).toFixed(2)}%`}
            percentagecolor={
              calculatePercentageChange(
                currentMonthStats.paid,
                previousMonthStats.paid
              ) > 0
                ? green[500]
                : red[500]
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Fuel Consumed"
            amount={currentMonthStats.fuelConsumed}
            chip="Monthly"
            percentagetext={`${calculatePercentageChange(
              currentMonthStats.fuelConsumed,
              previousMonthStats.fuelConsumed
            ).toFixed(2)}%`}
            percentagecolor={
              calculatePercentageChange(
                currentMonthStats.fuelConsumed,
                previousMonthStats.fuelConsumed
              ) > 0
                ? green[500]
                : red[500]
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl>
          <Stats
            title="Completed Fuels"
            amount={currentMonthStats.completedFuels}
            chip="Monthly"
            percentagetext={`${calculatePercentageChange(
              currentMonthStats.completedFuels,
              previousMonthStats.completedFuels
            ).toFixed(2)}%`}
            percentagecolor={
              calculatePercentageChange(
                currentMonthStats.completedFuels,
                previousMonthStats.completedFuels
              ) > 0
                ? green[500]
                : red[500]
            }
          />
        </Grid>
      </Grid>

      <Grid container spacing={6}>
        <Grid item xs={12} lg={5}>
          <USAMap />
        </Grid>
        <Grid item xs={12} lg={7}>
          <BarChart />
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={4}>
          <DoughnutChart />
        </Grid>
        <Grid item xs={12} lg={8}>
          <Table />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default SaaS;
