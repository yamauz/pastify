import React, { useState, useEffect } from "react";
import {
  CardElement,
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  Elements
} from "react-stripe-elements";
import { connect } from "react-redux";

import styled from "@emotion/styled";

const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

const Wrapper = styled.div``;

const Component = props => {
  return (
    <Wrapper>
      <form onSubmit={handleSubmmit}>
        <CardElement className="MyCardElement" style={style} />
        <button>Confirm order</button>
      </form>
    </Wrapper>
  );
};

const handleSubmmit = e => {
  e.preventDefault();
  console.log(e);
};

// export default connect(null, null)(Component);
export default injectStripe(Component);
