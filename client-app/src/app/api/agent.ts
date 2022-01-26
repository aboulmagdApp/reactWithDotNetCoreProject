import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Activity } from '../models/activity';


import { useHistory } from 'react-router';


const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
  await sleep(1000);
  return response;

}, (error: AxiosError) => {
  const { data, status } = error.response!;
  switch (status) {
    case 400:
      if (data.errors) {
        const modalStateErrors = [];
        for (const key in data.errors) {
          if (data.errors[key]) {
            modalStateErrors.push(data.errors[key])
          }
        }
        throw modalStateErrors.flat();
      } else {
        toast.error(data);
      }
      break;
    case 401:
      toast.error('unauthorized');
      break;
    case 404:
      //toast.error('not found');
      // history.push('/not-found');
      //history.push("", "", '/not-found') //history.push('/not-found')
      //history.pushState(null, "", '/not-found');
      break;
    case 500:
      toast.error('server error');
  }
  return Promise.reject(error);
})

const responesBody = <T>(respone: AxiosResponse<T>) => respone.data;

const request = {
  get: <T>(url: string) => axios.get<T>(url).then(responesBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responesBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responesBody),
  del: <T>(url: string) => axios.delete<T>(url).then(responesBody)
}

const Activities = {
  list: () => request.get<Activity[]>('/activities'),
  details: (id: string) => request.get<Activity>(`/activities/${id}`),
  create: (activity: Activity) => request.post<void>('/activities', activity),
  update: (activity: Activity) => request.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.del<void>(`/activities/${id}`)
}


const agent = {
  Activities
}

export default agent;