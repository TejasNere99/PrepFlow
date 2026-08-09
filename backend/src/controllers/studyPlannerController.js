import StudyPlannerService from '../services/studyPlannerService.js';
import { PLAN_TASK_STATUS, PLAN_TYPES } from '../constants/plannerConstants.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

const parsePlanSettings = (body = {}, query = {}) => ({
  planType: body.planType || query.planType,
  dailyStudyMinutes: body.dailyStudyMinutes || body.availableMinutes || query.dailyStudyMinutes || query.availableMinutes,
  preferredStudyDays: body.preferredStudyDays || query.preferredStudyDays,
  preferredSubjects: body.preferredSubjects || query.preferredSubjects,
  preferredStudyTime: body.preferredStudyTime || query.preferredStudyTime,
  scheduledDate: body.scheduledDate || query.scheduledDate,
  date: body.date || query.date,
});

const normalizeArrayInput = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return value.split(',').map((item) => item.trim());
  return value;
};

const validatePlannerSettings = (settings) => {
  const normalized = {
    ...settings,
    preferredStudyDays: normalizeArrayInput(settings.preferredStudyDays),
    preferredSubjects: normalizeArrayInput(settings.preferredSubjects),
  };

  if (normalized.dailyStudyMinutes !== undefined) {
    const minutes = Number(normalized.dailyStudyMinutes);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      throw new ApiError(400, 'Daily study minutes must be a positive number');
    }
  }

  if (normalized.preferredStudyDays !== undefined) {
    const days = normalized.preferredStudyDays.map(Number);
    if (days.some((day) => !Number.isInteger(day) || day < 0 || day > 6)) {
      throw new ApiError(400, 'Preferred study days must be numbers from 0 to 6');
    }
    normalized.preferredStudyDays = days;
  }

  return normalized;
};

export const getTodayPlan = asyncHandler(async (req, res) => {
  const settings = validatePlannerSettings(parsePlanSettings({}, req.query));
  const plan = await StudyPlannerService.getTodayPlan(req.user.id, settings);

  return sendSuccess(res, 200, 'Daily study plan generated successfully', plan);
});

export const getWeeklyPlan = asyncHandler(async (req, res) => {
  const settings = validatePlannerSettings(parsePlanSettings({}, req.query));
  const plan = await StudyPlannerService.getWeeklyPlan(req.user.id, settings);

  return sendSuccess(res, 200, 'Weekly study plan generated successfully', plan);
});

export const generatePlan = asyncHandler(async (req, res) => {
  const settings = validatePlannerSettings(parsePlanSettings(req.body));
  const plan = await StudyPlannerService.generatePlan(req.user.id, {
    ...settings,
    planType: settings.planType === PLAN_TYPES.WEEKLY ? PLAN_TYPES.WEEKLY : PLAN_TYPES.DAILY,
  });

  return sendSuccess(res, 201, 'Study plan generated successfully', plan);
});

export const regeneratePlan = asyncHandler(async (req, res) => {
  const settings = validatePlannerSettings(parsePlanSettings(req.body));
  const plan = await StudyPlannerService.regeneratePlan(req.user.id, settings);

  return sendSuccess(res, 200, 'Study plan regenerated successfully', plan);
});

export const updatePlannerTask = asyncHandler(async (req, res) => {
  const { status, scheduledDate } = req.body;

  if (!status || !Object.values(PLAN_TASK_STATUS).includes(status)) {
    throw new ApiError(400, 'Valid planner task status is required');
  }

  const plan = await StudyPlannerService.updateTaskStatus(req.user.id, req.params.taskId, status, {
    scheduledDate,
  });

  return sendSuccess(res, 200, 'Planner task updated successfully', plan);
});
