import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Elements } from "react-stripe-elements";
import InjectedCheckoutForm from "./CheckoutForm";

import styled from "@emotion/styled";

const Wrapper = styled.div``;

const Component = props => {
  return (
    <Wrapper>
      <Elements>
        <InjectedCheckoutForm />
      </Elements>
    </Wrapper>
  );
};

export default connect(null, null)(Component);
