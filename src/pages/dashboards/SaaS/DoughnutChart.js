import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { Doughnut } from "react-chartjs-2";
import { MoreVertical } from "react-feather";
import dieselFetch from "../../../utils/dieselFetch";
import useAuth from "../../../hooks/useAuth";

import { orange, green, red } from "@mui/material/colors";
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow as MuiTableRow,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 168px;
  position: relative;
`;

const DoughnutInner = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -22px;
  text-align: center;
  z-index: 0;
`;

const TableRow = styled(MuiTableRow)`
  height: 42px;
`;

const TableCell = styled(MuiTableCell)`
  padding-top: 0;
  padding-bottom: 0;
`;

const GreenText = styled.span`
  color: ${() => green[400]};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const RedText = styled.span`
  color: ${() => red[400]};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const DoughnutChart = ({ theme }) => {
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
      state: obj.state,
      gallons: parseInt(obj.gallons),
      date: new Date(obj.date),
    }));
  };

  const currentMonthData = rows.filter((row) => {
    const currentDate = new Date();
    return (
      row.date.getMonth() === currentDate.getMonth() &&
      row.date.getFullYear() === currentDate.getFullYear()
    );
  });

  const stateGallons = currentMonthData.reduce((accumulator, currentValue) => {
    accumulator[currentValue.state] =
      (accumulator[currentValue.state] || 0) + currentValue.gallons;
    return accumulator;
  }, {});

  const sortedStates = Object.entries(stateGallons)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalGallons = sortedStates.reduce(
    (acc, [_, gallons]) => acc + gallons,
    0
  );

  const data = {
    labels: sortedStates.map((entry) => entry[0]),
    datasets: [
      {
        data: sortedStates.map((entry) => entry[1]),
        backgroundColor: [
          theme.palette.secondary.main,
          red[500],
          orange[500],
          theme.palette.grey[200],
          theme.palette.primary.main,
        ],
        borderWidth: 5,
        borderColor: theme.palette.background.paper,
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
    cutout: "80%",
  };

  return (
    <Card mb={6}>
      <CardHeader
        action={
          <IconButton aria-label="settings" size="large">
            <MoreVertical />
          </IconButton>
        }
        title="Weekly sales"
      />

      <CardContent>
        <ChartWrapper>
          <DoughnutInner>
            <Typography variant="h4">{totalGallons} Gal's</Typography>
            <Typography variant="caption">total</Typography>
          </DoughnutInner>
          <Doughnut data={data} options={options} />
        </ChartWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>State</TableCell>
              <TableCell align="right">Gallons</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStates.map((entry, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {entry[0]}
                </TableCell>
                <TableCell align="right">{entry[1]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default withTheme(DoughnutChart);
