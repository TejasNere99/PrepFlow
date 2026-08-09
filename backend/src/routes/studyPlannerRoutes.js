import { Router } from 'express';
import {
  generatePlan,
  getTodayPlan,
  getWeeklyPlan,
  regeneratePlan,
  updatePlannerTask,
} from '../controllers/studyPlannerController.js';

export const studyPlannerRouter = Router();

studyPlannerRouter.get('/today', getTodayPlan);
studyPlannerRouter.get('/week', getWeeklyPlan);
studyPlannerRouter.post('/generate', generatePlan);
studyPlannerRouter.post('/regenerate', regeneratePlan);
studyPlannerRouter.patch('/tasks/:taskId', updatePlannerTask);
