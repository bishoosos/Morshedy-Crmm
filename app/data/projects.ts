export interface Project {
  id: string;
  name: string;
  defaultPrice: number;
  monthlyRatio: number;
  yearlyRatio: number;
}

export const PROJECTS_DATA: Project[] = [
  { id: 'zahra', name: 'Zahra North Coast (زهرة)', defaultPrice: 111000, monthlyRatio: 25, yearlyRatio: 75 },
  { id: 'one_katameya', name: 'One Katameya (وان قطامية)', defaultPrice: 72700, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'degla_landmarks', name: 'Degla Landmarks (دجلة لاند مارك)', defaultPrice: 52800, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'katameya_gate', name: 'Katameya Gate (قطامية جيت)', defaultPrice: 57800, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'sky_line', name: 'Sky Line (سكاي لاين)', defaultPrice: 57800, monthlyRatio: 20, yearlyRatio: 80 },
  { id: 'degla_towers', name: 'Degla Towers (دجلة تاورز)', defaultPrice: 58000, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'grand_gate', name: 'Grand Gate (جراند جيت)', defaultPrice: 67400, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'bavaria_town', name: 'Bavaria Town (بافاريا تاون)', defaultPrice: 50500, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'rayhana_plaza', name: 'Rayhana Plaza (ريحانة بلازا)', defaultPrice: 70800, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'rayhana_avenue', name: 'Rayhana Avenue (ريحانة أفينيو)', defaultPrice: 76000, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'rayhana_residence', name: 'Rayhana Residence (ريحانة ريزيدنس)', defaultPrice: 73700, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'degla_view', name: 'Degla View (دجلة فيو)', defaultPrice: 48600, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'crystal_plaza', name: 'Crystal Plaza (كريستال بلازا)', defaultPrice: 56800, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'grand_city', name: 'Grand City (جراند سيتي)', defaultPrice: 51100, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'lake_front', name: 'Lake Front (ليك فرونت)', defaultPrice: 48400, monthlyRatio: 30, yearlyRatio: 70 },
  { id: 'degla_palms', name: 'Degla Palms / Gardens (دجلة بالمز / جاردنز)', defaultPrice: 14100, monthlyRatio: 20, yearlyRatio: 80 },
  { id: 'west_courts', name: 'West Courts (وست كورتس)', defaultPrice: 44000, monthlyRatio: 30, yearlyRatio: 70 },
];