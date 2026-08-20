// src/data/projectsData.ts

export interface UnitModel {
  id: string;
  name: string;
  area: number;
  layoutImage?: string;
  roofArea?: number;
  gardenArea?: number;
}

export interface Building {
  id: string;
  name: string;
  models: UnitModel[];
}

export interface Zone {
  id: string;
  name: string;
  masterPlan?: string;
  buildings: Building[];
}

export interface DetailedProject {
  id: string;
  name: string;
  defaultPrice: number;
  monthlyRatio: number;
  yearlyRatio: number;
  masterPlan?: string;
  zones?: Zone[];
}