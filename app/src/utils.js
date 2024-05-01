export const task_categories = [
  "3D",
  "DIRECTION_ARTISTIQUE",
  "ASSISTANAT",
  "ETALONNAGE",
  "MONTAGE",
  "GRAPHISME",
  "GESTION",
  "MOTION",
  "CONFO_POST_ETALO",
  "CONFO_PRE_ETALO",
  "PREPA_PROJET",
  "RECHERCHE",
  "SOUND_DESIGN",
  "VFX",
  "ECRITURE",
  "OTHER",
];

export const task_category_colors = {
  "3D": { text: "text-red-600", bg: "bg-red-600" },
  "DIRECTION_ARTISTIQUE": { text: "text-green-500", bg: "bg-green-500" },
  "ASSISTANAT": { text: "text-green-400", bg: "bg-green-400" },
  "ETALONNAGE": { text: "text-pink-500", bg: "bg-pink-500" },
  "MONTAGE": { text: "text-cyan-500", bg: "bg-cyan-500" },
  "GRAPHISME": { text: "text-green-300", bg: "bg-green-300" },
  "GESTION": { text: "text-yellow-300", bg: "bg-yellow-300" },
  "MOTION": { text: "text-blue-400", bg: "bg-blue-400" },
  "CONFO_POST_ETALO": { text: "text-blue-300", bg: "bg-blue-300" },
  "CONFO_PRE_ETALO": { text: "text-purple-500", bg: "bg-purple-500" },
  "PREPA_PROJET": { text: "text-red-600", bg: "bg-red-600" },
  "RECHERCHE": { text: "text-blue-600", bg: "bg-blue-600" },
  "SOUND_DESIGN": { text: "text-rose-600", bg: "bg-rose-600" },
  "VFX": { text: "text-red-500", bg: "bg-red-500" },
  "ECRITURE": { text: "text-yellow-500", bg: "bg-yellow-500" },
};




export const project_categories = [
  "CLIP_VIDEO",
  "COURT_METRAGE",
  "PUBLICITE",
  "DOCUMENTAIRE",
  "REPORTAGE",
  "SERIE",
  "INTERVIEW",
  "FILM_CORPORATE",
  "MISSION_EXPLORER",
  "LONG_METRAGE",
  "OTHER",
];
export const project_category_colors = {
  "CLIP_VIDEO": { bg: "bg-red-900", border: "border-red-500" },
  "COURT_METRAGE": { bg: "bg-green-900", border: "border-green-600" },
  "PUBLICITE": { bg: "bg-blue-900", border: "border-blue-700" },
  "DOCUMENTAIRE": { bg: "bg-purple-900", border: "border-purple-500" },
  "REPORTAGE": { bg: "bg-yellow-900", border: "border-yellow-500" },
  "SERIE": { bg: "bg-orange-900", border: "border-orange-400" },
  "INTERVIEW": { bg: "bg-blue-600", border: "border-blue-500" },
  "FILM_CORPORATE": { bg: "bg-rose-700", border: "border-rose-500" },
  "MISSION_EXPLORER": { bg: "bg-pink-500", border: "border-pink-600" },
  "LONG_METRAGE": { bg: "bg-green-600", border: "border-green-500" },
  "OTHER": { bg: "bg-gray-400", border: "border-gray-500" },
};


export function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
