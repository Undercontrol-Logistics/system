import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { MoreVertical } from "react-feather";
import dieselFetch from "../../../utils/dieselFetch";
import useAuth from "../../../hooks/useAuth";

import {
  Card as MuiCard,
  CardHeader,
  IconButton,
  Chip as MuiChip,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
`;

const Paper = styled(MuiPaper)(spacing);

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)});
`;

const DashboardTable = () => {
  const context = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    dieselFetch("GET", null, context.id).then((data) => {
      const transformedData = transformData(data);
      setRows(transformedData.slice(0, 7));
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

  return (
    <Card mb={6}>
      <CardHeader
        action={
          <IconButton aria-label="settings" size="large">
            <MoreVertical />
          </IconButton>
        }
        title="Latest Fuels"
      />
      <Paper>
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>City/State</TableCell>
                <TableCell>Gallons</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Obs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.gallons}</TableCell>
                  <TableCell>${row.price}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.obs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </Paper>
    </Card>
  );
};

export default DashboardTable;
