import React, { lazy, Suspense } from "react";
import ErrorBoundary from '../components/Charts/ErrorBoundary';
import Loading from '../components/Charts/Loading';
import { makeStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';

const MyGoogleMap = lazy(() => import("../components/Charts/MyGoogleMap"));
const SessionsDays = lazy(() => import("../components/Charts/SessionsDays"));
const SessionsHours = lazy(() => import("../components/Charts/SessionsHours"));
const ViewsPerPage = lazy(() => import("../components/Charts/ViewsPerPage"));
const UsersByOs = lazy(() => import("../components/Charts/UsersByOs"));
const RetentionCohortWeek = lazy(() => import("../components/Charts/RetentionCohortWeek"));
const LogOfAllEvents = lazy(() => import("../components/Charts/LogOfAllEvents"));

const useStyles = makeStyles(() => ({
  MyDashBoard: {
    display: "flex",
    flexWrap: 'wrap',
    padding: '10px',
    width: '100%',
    border: '2px solid black',
    borderRadius: '10px'
  },
}));

const DashBoard: React.FC = () => {

  const classes = useStyles();

  return (
    <>
      <h1>My DashBoard</h1>
    <div className={classes.MyDashBoard} >
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <Card>
            <RetentionCohortWeek />
          </Card>
        </ErrorBoundary>
        <ErrorBoundary>
          <Card>
            <MyGoogleMap />
          </Card>
        </ErrorBoundary>
        <ErrorBoundary>
          <Card>
            <SessionsDays />
          </Card>
        </ErrorBoundary>
        <ErrorBoundary>
          <Card>
            <SessionsHours />
          </Card>
        </ErrorBoundary>
        <ErrorBoundary>
          <Card>
            <ViewsPerPage />
          </Card>
        </ErrorBoundary>
        <ErrorBoundary>
          <Card>
            <UsersByOs />
          </Card>
        </ErrorBoundary>
        <ErrorBoundary>
          <Card>
            <LogOfAllEvents />
          </Card>
        </ErrorBoundary>
      </Suspense>
    </div>
    </>
  );
};

export default DashBoard;
