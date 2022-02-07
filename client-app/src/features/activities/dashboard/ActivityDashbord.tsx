import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';

import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';

export default observer(function ActivityDashbord() {
  const { activityStore } = useStore();
  const { loadActivities, activityRegister } = activityStore;

  useEffect(() => {
    if (activityRegister.size <= 1) loadActivities();
  }, [activityRegister.size, loadActivities]);

  if (activityStore.loadingInitial)
    return <Loading content="Loading activities.." />;

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList />
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  );
});
