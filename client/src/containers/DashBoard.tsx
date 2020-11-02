import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import MyGoogleMap from '../components/charts/GoogleMap'
import SessionDays from "../components/charts/SessionChartDay";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <div style={{display: 'flex'}}>
    <MyGoogleMap/>
    <SessionDays/>
    </div>
  );
};

export default DashBoard;
