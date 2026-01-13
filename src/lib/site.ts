export const site = {
  couple: { a: "Ana", b: "Bruno" },
  tagline: "Um encontro simples, elegante e cheio de significado.",
  dateLong: "Sábado, 18 de julho de 2026",
  dateShort: "18.07.2026",
  city: "São Paulo — SP",
  dressCode: "Traje social leve (opcional)",
  rsvpDeadlineCopy: "Confirme até 01 de julho de 2026.",
  ceremonyTime: "16:30",
  receptionTime: "18:00",
  locationPublic:
    process.env.EVENT_ADDRESS_PUBLIC ??
    "Região dos Jardins, São Paulo — SP (endereço completo para convidados)",
  locationFull: process.env.EVENT_ADDRESS_FULL ?? "",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Jardins%20S%C3%A3o%20Paulo",
  pixCopy:
    "Os presentes são simbólicos; o presente real será via Pix pelo nosso checkout.",
  gifts: [
    { title: "Jantar a dois", value: 15000, note: "Uma noite especial." },
    { title: "Café da manhã especial", value: 8000, note: "Começo doce." },
    { title: "Noite de hotel", value: 35000, note: "Um respiro a dois." },
    { title: "Passeio cultural", value: 12000, note: "Museu, café e tempo." },
    { title: "Translado da lua de mel", value: 20000, note: "Do aeroporto ao descanso." },
    { title: "Experiência gastronômica", value: 25000, note: "Sabores marcantes." },
    { title: "Dia de spa", value: 22000, note: "Calma e cuidado." },
    { title: "Ajuda na lua de mel", value: 50000, note: "Um capítulo novo." },
    { title: "Pôr do sol inesquecível", value: 10000, note: "Um brinde ao fim do dia." },
    { title: "Surpresa no quarto", value: 6000, note: "Detalhes que contam." },
    { title: "Aventura a dois", value: 18000, note: "Uma história pra lembrar." },
    { title: "Álbum de fotos", value: 30000, note: "Memórias impressas." }
  ],
  faq: [
    {
      q: "Posso levar acompanhante?",
      a: "Apenas se estiver indicado no seu convite/RSVP. O sistema mostra exatamente os nomes autorizados."
    },
    {
      q: "Há restrição de horário para confirmar presença?",
      a: "Sim. O RSVP fica aberto até a data limite do seu grupo. Depois disso, as edições são bloqueadas."
    },
    {
      q: "O endereço é público?",
      a: "Mostramos a região. O endereço completo aparece apenas para convidados (via token)."
    },
    {
      q: "Presentes são obrigatórios?",
      a: "Não. Sua presença é o mais importante. Se desejar presentear, usamos Pix pelo checkout."
    }
  ]
} as const;

export const suggestedAmounts = [
  { label: "R$ 50", valueCents: 5000 },
  { label: "R$ 100", valueCents: 10000 },
  { label: "R$ 200", valueCents: 20000 },
  { label: "R$ 500", valueCents: 50000 },
  { label: "R$ 1.000", valueCents: 100000 }
] as const;

export const brand = {
  title: `${site.couple.a} & ${site.couple.b} — Casamento`,
  description:
    "Site do casamento: informações essenciais, RSVP fechado e presentes via Pix."
} as const;
