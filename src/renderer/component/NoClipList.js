import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const MessageWrapper = styled.div``;

const Message = styled.div`
  text-align: center;
  font-family: sans-serif;
  color: #969494;
`;

const Component = props => {
  return (
    <Wrapper>
      <MessageWrapper>
        <Message>No recent Clips.</Message>
        <Message>New Clips will appear here.</Message>
      </MessageWrapper>
    </Wrapper>
  );
};

export default Component;
