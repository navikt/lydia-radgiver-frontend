import React from "react";
import ConfettiExplosion, { ConfettiProps } from 'react-confetti-explosion';
import styled from "styled-components";

const StyledKonfettiContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;	
`;

export const Konfetti = (props: ConfettiProps) => {
	return <StyledKonfettiContainer><ConfettiExplosion {...props} force={0.6} particleCount={100} /></StyledKonfettiContainer>;
}
