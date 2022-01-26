import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";


export default class ActivityStore {
  activityRegister = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;

  constructor() {
    makeAutoObservable(this)
  }

  get activitiesByDate() {
    return Array.from(this.activityRegister.values()).sort((a, b) =>
      Date.parse(b.date) - Date.parse(a.date)
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activites, activity) => {
        const date = activity.date;
        activites[date] = activites[date] ? [...activites[date], activity] : [activity];
        return activites;
      }, {} as { [key: string]: Activity[] })
    )
  };

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        this.setActivity(activity);
        //this.activities.push(activity);

      })
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.selectedActivity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        this.selectedActivity = activity;
        this.setLoadingInitial(false);
        return activity;
      } catch (error) {
        console.log('error');
        this.setLoadingInitial(false);
      }
    }
  }

  private setActivity = (activity: Activity) => {
    activity.date = activity.date.split('T')[0];
    this.activityRegister.set(activity.id, activity);
  }
  private getActivity = (id: string) => {
    return this.activityRegister.get(id);
  }

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  }

  // selectActivity = (id: string) => {
  //   this.selectedActivity = this.activityRegister.get(id); //this.activities.find(a => a.id === id);
  //   this.editMode = false;
  // }

  // cancelSelectedActivity = () => {
  //   this.selectedActivity = undefined;
  // }

  // openForm = (id?: string) => {
  //   id ? this.selectActivity(id) : this.cancelSelectedActivity();
  //   this.editMode = true;
  // }

  // closeForm = () => {
  //   this.editMode = false;
  // }

  createActivity = async (activity: Activity) => {
    this.loading = true;
    // activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegister.set(activity.id, activity);  //this.activities.push(activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      })
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegister.set(activity.id, activity)  //this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
        this.selectedActivity = activity;
        this.editMode = false;
        this.loading = false;
      })
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      })
    }
  }

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegister.delete(id);//this.activities = [...this.activities.filter(a => a.id !== id)];
        //if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
        this.loading = false;
      })
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      })
    }
  }
}