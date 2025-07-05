export const clubs = [
  {
    subject: "수학",
    clubs_list: [
      { id: "rootm", name: "루트엠" },
      { id: "naplace", name: "나플라스" },
      { id: "limes", name: "리메스" },
      { id: "laonzena", name: "라온제나" },
    ],
  },
  {
    subject: "물리",
    clubs_list: [
      { id: "andamiro", name: "안다미로" },
      { id: "tips", name: "팁스" },
      { id: "neo", name: "네오" },
    ],
  },
  {
    subject: "화학",
    clubs_list: [
      { id: "chex", name: "첵스" },
      { id: "eq", name: "EQ" },
      { id: "edta", name: "에타" },
    ],
  },
  {
    subject: "생명",
    clubs_list: [
      { id: "dna", name: "DNA" },
      { id: "invitro", name: "인비트로" },
      { id: "globe", name: "글로브" },
    ],
  },
  {
    subject: "지구",
    clubs_list: [
      { id: "archi", name: "아르키" },
      { id: "pulcherrima", name: "풀체리마" },
    ],
  },
  {
    subject: "정보",
    clubs_list: [
      { id: "sada", name: "SADA" },
      { id: "next", name: "NeXT" },
    ],
  },
  {
    subject: "융합과학",
    clubs_list: [{ id: "unrevr", name: "언리버" }],
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
