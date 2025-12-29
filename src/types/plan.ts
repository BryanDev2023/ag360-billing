export type PlanStatus = "active" | "inactive";

export enum PlanDuration {
  MONTHLY = "monthly",
  ANNUAL = "annual",
  QUARTER = "quarter",
  SEMESTER = "semester"
}

export interface DeletePlanResponse {
  success: boolean;
  message: string | string[];
  deletedCount: number;
}
