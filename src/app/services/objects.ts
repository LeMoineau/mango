
export interface DataObject {
  [key: string]: any
}

export const MangaStructure: DataObject = {
  parsedTitle: "",
  title: "",
  image: "",
  infos: {
    iter: []
  },
  chapters: {
    downloadedChapters: [],
    onlineChapters: {}
  }
}

export const InitialSettings: DataObject = {
  darkMode: false,
  lowConnectionMode: true,
  autoSaveMangas: false,
  proxyNewChapter: "scantrad",
  proxyDownloadChapter: "scanvfNet",
  proxySearch: "all"
}

export const RandomColors = [
  "#1abc9c", "#16a085", "#2ecc71", "#27ae60", "#3498db", "#2980b9",
  "#9b59b6", "#8e44ad", "#f1c40f", "#f39c12", "#e67e22", "#d35400",
  "#e74c3c", "#c0392b"
]

const NotFoundMessages = [
  {
    icon: "fish",
    message: "Des poissons ont peut-être mangé tous les chapitres...",
    timesUse: 0
  },
  {
    icon: "flame",
    message: "Du moment que les chapitres originaux n'ont pas brulé, pas de soucis",
    timesUse: 0
  },
  {
    icon: "game-controller",
    message: "Mais à quoi jouent ces chapitres !",
    timesUse: 0
  },
  {
    icon: "headset",
    message: "Les chapitres n'ont pas du entendre notre appel...",
    timesUse: 0
  },
  {
    icon: "heart-dislike",
    message: "Les chapitres sont probablement mort.",
    timesUse: 0
  },
  {
    icon: "megaphone",
    message: "ALLO ! LES CHAPITRES SONT DEMANDES !",
    timesUse: 0
  }
]

export function getRandomNotFoundMessage() {
  let random: number = Math.floor(Math.random() * NotFoundMessages.length)
  return NotFoundMessages[random];
}
