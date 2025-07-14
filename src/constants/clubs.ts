export const clubs = [
  {
    subject: "수학",
    clubs_list: [
      { id: "rootm", name: "RootM" },
      { id: "naplace", name: "NA'PLACE" },
      { id: "limes", name: "Limes" },
      { id: "laonzena", name: "LAONZENA" },
    ],
  },
  {
    subject: "물리",
    clubs_list: [
      { id: "andamiro", name: "Andamiro" },
      { id: "tips", name: "TIPS" },
      { id: "neo", name: "NEO" },
    ],
  },
  {
    subject: "화학",
    clubs_list: [
      { id: "chex", name: "CHEX" },
      { id: "eq", name: "EQ" },
      { id: "edta", name: "EDTA" },
    ],
  },
  {
    subject: "생명",
    clubs_list: [
      { id: "dna", name: "DNA" },
      { id: "invitro", name: "In vitro" },
      { id: "globe", name: "GLOBE" },
    ],
  },
  {
    subject: "지구",
    clubs_list: [
      { id: "archi", name: "Archi" },
      { id: "pulcherrima", name: "Pullcherima" },
    ],
  },
  {
    subject: "정보",
    clubs_list: [
      { id: "sada", name: "SADA" },
      { id: "next", name: "NEXT" },
    ],
  },
  {
    subject: "융합과학",
    clubs_list: [{ id: "unrevr", name: "UNREVR" }],
  },
];

export const getClubNameById = (id: string): string => {
  for (const subject of clubs) {
    const club = subject.clubs_list.find((c) => c.id === id);
    if (club) {
      return club.name;
    }
  }
  return "";
};
