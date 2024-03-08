import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { MoreVertical } from "react-feather";
import dieselFetch from "../../../utils/dieselFetch";

import { VectorMap } from "@react-jvectormap/core";
import usAea from "@react-jvectormap/unitedstates/dist/usAea.json";
import useAuth from "../../../hooks/useAuth";

import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import { spacing } from "@mui/system";

const MapContainer = styled.div`
  height: 344px;
`;

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-top: 0;
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`;

function transformData(input) {
  return input.map((item) => ({
    latLng: [
      parseFloat(item.latMap).toFixed(1),
      parseFloat(item.longMap).toFixed(2),
    ],
    name: `${item.city}`,
  }));
}

function USAMap(props) {
  const context = useAuth();
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    dieselFetch("GET", null, context.id).then((data) => {
      const infoMap = transformData(data);
      setMarkers(infoMap);
    });
  }, [context.id]);

  const mapKey = JSON.stringify(markers); // Chave única com base nos marcadores

  let options = {
    regionStyle: {
      initial: {
        fill:
          props.theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.3)"
            : "#e3eaef",
      },
    },
    backgroundColor: "transparent",
    containerStyle: {
      width: "100%",
      height: "100%",
    },
    markerStyle: {
      initial: {
        r: 9,
        fill: props.theme.palette.secondary.main,
        "fill-opacity": 1,
        stroke: "#fff",
        "stroke-width": 7,
        "stroke-opacity": 0.4,
      },
      hover: {
        stroke: "#fff",
        "fill-opacity": 1,
        "stroke-width": 1.5,
      },
    },
    markers: markers,
  };
  console.log(options.markers);
  return (
    <Card mb={6}>
      <CardHeader
        action={
          <IconButton aria-label="settings" size="large">
            <MoreVertical />
          </IconButton>
        }
        title="Real-Time"
      />
      <CardContent>
        <MapContainer>
          <VectorMap map={usAea} {...options} key={mapKey} />
        </MapContainer>
      </CardContent>
    </Card>
  );
}
export default withTheme(USAMap);
