import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import MyGoogleMap from '../components/charts/GoogleMap'
import SessionDays from "../components/charts/SessionChartDay";
import SessionHours from "../components/charts/SessionHours";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <div style={{display: 'flex', flexFlow:'wrap'}}>
    <MyGoogleMap/>
    <SessionDays/>
    <SessionHours/>
    </div>
  );
};

export default DashBoard;
