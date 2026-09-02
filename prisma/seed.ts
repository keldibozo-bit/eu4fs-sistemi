/**
 * Skedari i mbjelljes (seeding) me të dhëna fillestare/shembull, i njëjti
 * përmbajtje si versioni Excel origjinal. Ekzekuto me: npx prisma db seed
 *
 * Ky skript pastron tabelat përpara se t'i rimbushë, kështu që mund të
 * rindiqet (re-run) në mënyrë të sigurt gjatë zhvillimit.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Duke pastruar tabelat ekzistuese...");
  await prisma.versionHistory.deleteMany();
  await prisma.timesheet.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.deliverableCatalogItem.deleteMany();
  await prisma.issueLog.deleteMany();
  await prisma.qcCriterion.deleteMany();
  await prisma.raciEntry.deleteMany();
  await prisma.expert.deleteMany();
  await prisma.lot.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log("Duke krijuar përdoruesit e ekipit PM...");
  const tempPasswordHash = await bcrypt.hash("eu4fs2026", 10);
  await prisma.user.createMany({
    data: [
      {
        name: "Keldi Bozo",
        email: "keldibozo@gmail.com",
        passwordHash: tempPasswordHash,
        role: "PM",
      },
      {
        name: "PM Kolegë 1",
        email: "pm1@example.com",
        passwordHash: tempPasswordHash,
        role: "PM",
      },
      {
        name: "PM Kolegë 2",
        email: "pm2@example.com",
        passwordHash: tempPasswordHash,
        role: "PM",
      },
    ],
  });

  console.log("Duke krijuar konfigurimin e projektit...");
  await prisma.project.create({
    data: {
      name: "EU4Food Safety — Sistemi i Menaxhimit",
      funder: "EU4Food Safety / GIZ",
      torReference: "7000016213",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-12-31"),
      pmName: "Keldi Bozo",
    },
  });

  console.log("Duke krijuar lotet...");
  const lot1 = await prisma.lot.create({
    data: {
      code: "LOT1",
      name: "Food Safety",
      focus: "siguria ushqimore",
      budgetDaysExpert: 150,
      budgetEUR: null,
      pmResponsible: "Keldi Bozo",
    },
  });
  const lot2 = await prisma.lot.create({
    data: {
      code: "LOT2",
      name: "Veterinary",
      focus: "mjekësia veterinare",
      budgetDaysExpert: 200,
      budgetEUR: null,
      pmResponsible: "Keldi Bozo",
    },
  });
  const lot3 = await prisma.lot.create({
    data: {
      code: "LOT3",
      name: "Phytosanitary",
      focus: "fitosanitare",
      budgetDaysExpert: 150,
      budgetEUR: null,
      pmResponsible: "Keldi Bozo",
    },
  });

  console.log("Duke krijuar ekspertin shembull...");
  const elira = await prisma.expert.create({
    data: {
      name: "Elira Krasniqi",
      role: "LIGJOR",
      lotId: lot1.id,
      expertiseArea: "Legjislacioni i sigurisë ushqimore / përafrimi me acquis-në e BE-së",
      contractedDays: 20,
      dailyRateEUR: 300, // shembull ilustrues — ndrysho me tarifën reale kontraktuale
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-12-31"),
      email: "elira.krasniqi@example.com",
      phone: null,
      status: "AKTIV",
      pmNotes: "Ekspert shembull (illustrative) i vendosur gjatë ndërtimit të sistemit.",
    },
  });

  console.log("Duke krijuar rreshtat RACI...");
  await prisma.raciEntry.createMany({
    data: [
      {
        activity: "Hartimi i draft-deliverable-it",
        responsible: "Eksperti i Lotit",
        accountable: "Keldi Bozo",
        consulted: "PM Kolegë",
        informed: "Institucioni Përfitues",
      },
      {
        activity: "Rishikimi i parë QC",
        responsible: "PM Kryesor",
        accountable: "Keldi Bozo",
        consulted: "Eksperti i Lotit",
        informed: "PM Kolegë",
      },
      {
        activity: "Rishikimi dytësor (4-eyes)",
        responsible: "PM Kolegë",
        accountable: "Keldi Bozo",
        consulted: "Eksperti i Lotit",
        informed: "-",
      },
      {
        activity: "Dorëzimi te institucioni",
        responsible: "Keldi Bozo",
        accountable: "Keldi Bozo",
        consulted: "Eksperti i Lotit",
        informed: "Institucioni Përfitues",
      },
      {
        activity: "Zgjidhja e problematikave",
        responsible: "PM Kryesor",
        accountable: "Keldi Bozo",
        consulted: "Eksperti i Lotit, PM Kolegë",
        informed: "Institucioni Përfitues",
      },
      {
        activity: "Raportimi periodik",
        responsible: "Keldi Bozo",
        accountable: "Keldi Bozo",
        consulted: "PM Kolegë",
        informed: "Donatori (GIZ)",
      },
      {
        activity: "Përditësimi i katalogut",
        responsible: "PM Kolegë",
        accountable: "Keldi Bozo",
        consulted: "-",
        informed: "Ekipi i Projektit",
      },
    ],
  });

  console.log("Duke krijuar rubrikën QC (Ligjor & Teknik)...");
  await prisma.qcCriterion.createMany({
    data: [
      {
        type: "LIGJOR",
        code: "K1",
        title: "Saktësia Ligjore & Përputhshmëria me Acquis",
        description:
          "Citimi korrekt i direktivës/rregullores BE, niveli i përputhshmërisë saktësisht i identifikuar (i plotë/i pjesshëm/mungon), pa gabime interpretimi.",
        weightPercent: 30,
      },
      {
        type: "LIGJOR",
        code: "K2",
        title: "Përputhshmëria me Kuadrin Ligjor Shqiptar",
        description:
          "Nuk bie ndesh me legjislacionin ekzistues; respekton hierarkinë e akteve dhe metodologjinë e Udhëzimit nr. 6/2022 të Ministrit të Drejtësisë.",
        weightPercent: 20,
      },
      {
        type: "LIGJOR",
        code: "K3",
        title: "Qartësia & Teknika Legjislative",
        description:
          "Gjuhë e qartë, precize, strukturë korrekte nenesh/paragrafësh, pa paqartësi apo pasazhe të dykuptimta.",
        weightPercent: 15,
      },
      {
        type: "LIGJOR",
        code: "K4",
        title: "Konsistenca e Terminologjisë",
        description:
          "Terminologji e njëjtë me deliverablet e tjera të lotit dhe me legjislacionin ekzistues; pa kontradikta të brendshme.",
        weightPercent: 15,
      },
      {
        type: "LIGJOR",
        code: "K5",
        title: "Plotësia",
        description:
          "Mbulon çdo element të ToR-it/aneksit përkatës (p.sh. tabela e përputhshmërisë e plotë).",
        weightPercent: 15,
      },
      {
        type: "LIGJOR",
        code: "K6",
        title: "Zbatueshmëria",
        description:
          "Afatet, kostot dhe kapacitetet administrative të zbatimit janë marrë realisht parasysh.",
        weightPercent: 5,
      },
      {
        type: "TEKNIK",
        code: "K1",
        title: "Saktësia Teknike",
        description:
          "Informacioni korrekt dhe i verifikuar kundrejt rregulloreve/standardeve përkatëse të BE-së (p.sh. Rregullorja (BE) 2016/2031, acquis veterinar).",
        weightPercent: 30,
      },
      {
        type: "TEKNIK",
        code: "K2",
        title: "Bazueshmëria Metodologjike",
        description:
          "Metodologjia e përdorur është e shëndoshë; të dhënat dhe burimet citohen saktë dhe janë të verifikueshme.",
        weightPercent: 20,
      },
      {
        type: "TEKNIK",
        code: "K3",
        title: "Qartësia & Përdorshmëria",
        description:
          "I strukturuar, i kuptueshëm për audiencën (institucion/donator), me rekomandime konkrete e të zbatueshme (jo vetëm përshkruese).",
        weightPercent: 15,
      },
      {
        type: "TEKNIK",
        code: "K4",
        title: "Koherenca me Deliverablet e Lidhura",
        description:
          "Në linjë me objektivat e projektit dhe koherent me deliverablet ligjore paralele të të njëjtit lot (pa kundërthënie).",
        weightPercent: 15,
      },
      {
        type: "TEKNIK",
        code: "K5",
        title: "Plotësia",
        description:
          "Mbulon të gjitha kërkesat e ToR-it/output indicator-it përkatës; pa boshllëqe të dhënash.",
        weightPercent: 15,
      },
      {
        type: "TEKNIK",
        code: "K6",
        title: "Zbatueshmëria",
        description:
          "Rekomandimet janë realiste brenda afateve dhe kapaciteteve institucionale të MBZHR.",
        weightPercent: 5,
      },
    ],
  });

  console.log("Duke krijuar katalogun e deliverables...");
  const ref = "Output Indicator 1.1 (ToR 7000016213)";
  const catalogItems = await Promise.all([
    prisma.deliverableCatalogItem.create({
      data: {
        contractualId: "C001",
        lotId: lot1.id,
        title: "Ligji për OMGJ (organizmat e modifikuar gjenetikisht)",
        reference: ref,
      },
    }),
    prisma.deliverableCatalogItem.create({
      data: {
        contractualId: "C002",
        lotId: lot2.id,
        title: "Ligji për Kultivimin e Bagëtive",
        reference: ref,
      },
    }),
    prisma.deliverableCatalogItem.create({
      data: {
        contractualId: "C003",
        lotId: lot2.id,
        title: "Ligji për Mirëqenien e Kafshëve",
        reference: ref,
      },
    }),
    prisma.deliverableCatalogItem.create({
      data: {
        contractualId: "C004",
        lotId: lot2.id,
        title: "Amendimi i Ligjit të Veterinarisë",
        reference: ref,
      },
    }),
    prisma.deliverableCatalogItem.create({
      data: {
        contractualId: "C005",
        lotId: lot3.id,
        title: "Ligji për Produktet e Mbrojtjes së Bimëve",
        reference: ref,
      },
    }),
    prisma.deliverableCatalogItem.create({
      data: {
        contractualId: "C006",
        lotId: lot3.id,
        title: "Ligji për Materialin Mbjellës",
        reference: ref,
      },
    }),
    prisma.deliverableCatalogItem.create({
      data: {
        contractualId: "C007",
        lotId: lot3.id,
        title: "Ligji për Mbrojtjen e Varieteteve Bimore",
        reference: ref,
      },
    }),
  ]);
  void catalogItems;

  console.log("Duke krijuar deliverable-in shembull D001...");
  const d001 = await prisma.deliverable.create({
    data: {
      // Nuk lidhet me një element specifik të katalogut (nuk është një nga 7
      // ligjet) — është një raport përgatitor gap-analysis.
      catalogItemId: null,
      lotId: lot1.id,
      expertId: elira.id,
      title: "Raport Gap-Analysis Përgatitor — Kuadri Ligjor i OMGJ",
      type: "LIGJOR",
      deadline: new Date("2026-04-15"),
      submissionDate: new Date("2026-04-10"),
      status: "APROVUAR",
      k1: 5,
      k2: 4,
      k3: 5,
      k4: 4,
      k5: 5,
      k6: 4,
      reviewer: "Keldi Bozo",
      qcComments: "Cilësi shumë e mirë; sugjerime të vogla formulimi u adresuan në versionin final.",
      version: 1,
      finalApprovalDate: new Date("2026-04-18"),
      secondaryReviewer: "Ardit Male (PM Kolegë)",
      secondaryReviewConfirmed: "PO",
    },
  });

  console.log("Duke krijuar historikun e versioneve për D001...");
  await prisma.versionHistory.createMany({
    data: [
      {
        deliverableId: d001.id,
        version: 1,
        date: new Date("2026-04-10"),
        changesRequestedOrMade: "Dërguar për rishikim të parë QC nga PM Kryesor.",
        by: "Elira Krasniqi",
        statusOfThisVersion: "Dërguar për Rishikim",
      },
      {
        deliverableId: d001.id,
        version: 1,
        date: new Date("2026-04-18"),
        changesRequestedOrMade:
          "Korrigjime të vogla formulimi dhe citimesh; u konfirmua nga rishikimi dytësor (4-eyes) dhe u aprovua.",
        by: "Keldi Bozo",
        statusOfThisVersion: "Aprovuar",
      },
    ],
  });

  console.log("Mbjellja e të dhënave u krye me sukses.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
