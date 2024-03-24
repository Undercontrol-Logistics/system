import React from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Avatar, Paper, Typography, Button } from "@mui/material";

import { ReactComponent as Logo } from "../../vendor/logo.svg";
import SignInComponent from "../../components/auth/SignIn";
import eldLogo from "../../vendor/logo_eld.png";

const Brand = styled(Logo)`
  fill: ${(props) => props.theme.palette.primary.main};
  width: 64px;
  height: 64px;
  margin-bottom: 32px;
`;

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

const BigAvatar = styled(Avatar)`
  width: 102px;
  height: 102px;
  text-align: center;
  margin: 0 auto ${(props) => props.theme.spacing(5)};
`;

function SignIn() {
  return (
    <React.Fragment>
      <Brand />
      <Wrapper>
        <Helmet title="Sign In" />
        <BigAvatar alt="Logo" src={eldLogo} />

        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Welcome back!
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Sign in to your account to continue. Don't have an account?
          <Button component={Link} to="/auth/sign-up" fullWidth color="primary">
            Sign Up
          </Button>
        </Typography>

        <SignInComponent />
      </Wrapper>
    </React.Fragment>
  );
}

export default SignIn;
