

export const endpoints = {

  auth: {
    login: 'auth/login',
    register: 'auth/register',
  },
  
  goal: {
    create: 'goal',
    listByUser: 'goal', // Use query param: ?userId=ID
    updateMilestone: (id: number | string) => `goal/milestone/${id}`,
    delete: (id: number | string) => `goal/${id}`,
  },

  task: {
    base: 'task',
    byFrequency: 'task/by-frequency',
    updateStatus: (id: number | string) => `task/${id}/status`,
    delete: (id: number | string) => `task/${id}`,
  }


};
