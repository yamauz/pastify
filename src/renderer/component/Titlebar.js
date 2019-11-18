import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
// Components
import { connect } from "react-redux";
import { setIdSelected } from "../actions";

const Wrapper = styled.div``;

const TitleBar = props => {
  return <Wrapper></Wrapper>;
};

export default connect(null, { setIdSelected })(TitleBar);
