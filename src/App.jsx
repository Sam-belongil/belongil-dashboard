import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Search, CalendarDays, Users, TrendingUp, FileClock, Upload, X, Inbox, Hourglass, BadgeCheck, CalendarClock, ChevronLeft, ChevronRight, ChevronDown, AlertTriangle, Repeat } from "lucide-react";

/* ---------------------------------------------------------------
   RAW DATA — seeded from the "Events" sheet.
   Swap this array (or use the Upload CSV button) to refresh.
----------------------------------------------------------------- */
const RAW_EVENTS = [
  { date: "02/05/2026", received: "", event: "JP", client: "Jonathan Pease", guests: "7", venue: "Multi Venue", service: "Dinner", status: "Completed", type: "Corporate", value: null, phone: "", email: "", spendPerHead: "", depositSent: "NA", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "20/05/2026", received: "", event: "Metricon", client: "Mardi", guests: "73", venue: "Bistro", service: "Dinner", status: "Completed", type: "Corporate", value: 20000, phone: "", email: "", spendPerHead: "", depositSent: "11/05/2026", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "23/05/2026", received: "", event: "Kovi", client: "Kovi Gordon", guests: "*", venue: "Multi Venue", service: "Multi-Day", status: "Completed", type: "Birthday", value: 40000, phone: "", email: "", spendPerHead: "", depositSent: "18/05/2026", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "23/05/2026", received: "", event: "Brooke Carter", client: "Brooke Carter", guests: "21", venue: "Bistro", service: "Lunch", status: "Completed", type: "Birthday", value: null, phone: "0400 252 193", email: "", spendPerHead: "", depositSent: "NA", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "06/06/2026", received: "", event: "Lisa Harrisson", client: "Lisa Harrison", guests: "35", venue: "Bistro", service: "", status: "Completed", type: "Birthday", value: 17000, phone: "0408 971 512", email: "", spendPerHead: "", depositSent: "08/05/2026", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "06/06/2026", received: "", event: "40th", client: "Natalie Eastgate", guests: "30", venue: "Bistro", service: "", status: "Completed", type: "Birthday", value: null, phone: "", email: "", spendPerHead: "", depositSent: "04/05/2026", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "10/07/2026", received: "", event: "Wake", client: "Sarah Trainor", guests: "240", venue: "Bistro", service: "", status: "Completed", type: "Other", value: 50000, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "11/07/2026", received: "", event: "Matt Stone Wine Dinner", client: "Matt Stone", guests: "NA", venue: "Bistro", service: "", status: "Completed", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "NA", depositPaid: "NA", sevenrooms: "", notes: "", brief: "" },
  { date: "31/07/2026", received: "", event: "Smart Energy", client: "Rhiannon", guests: "80-90", venue: "Bistro", service: "", status: "Confirmed", type: "Corporate", value: 25000, phone: "", email: "", spendPerHead: "", depositSent: "06/05/2026", depositPaid: "", sevenrooms: "", notes: "- Hire equipment", brief: "EVENT BRIEF // RUN SHEET\n\nEVENT DETAILS\nEvent Name: Smart Energy\n\nClient: Rhiannon Funch\n\nDate: July 31st\nVenue: Bistro\nTime: 6:00pm to 12am\n\nPAX: 85\nBudget: 25K\n\nEvent Type: Buy Out\nEvent Leads: Sam\n\nEVENT OVERVIEW\nSmart Energy is bringing their  team together for an unforgettable evening at The Belongil. To create a seamless event space, the venue will undergo a full furniture removal and transformation mid way through the event after mains, allowing for a relaxed, open-plan dining experience. Guests will enjoy exceptional food, premium beverages and warm hospitality in a vibrant Byron Bay setting. As the evening winds down, freshly made toasties will be served as a late-night snack, ensuring everyone finishes the celebration on a high note.\n\nNotes:\nLucky door prize attached under seats:\n5 x $20 Kiosk Vouchers\n1 x 2 Pax Cocktail Night Experience\n\nDietaries on 30’s\n\nBeverage service:\nCocktails and vino from waiter’s station on arrival\nTable service during mains\nBar service after mains \n\nSam to finalise drinks tab on the day. Currently around $7,200\n\nMENU\n\n\nPotato rosti w beef tartare\nPapaya\nPrawn dog\nleek tart \n\n\nMushroom Risotto\nSirloin \nBelongil Salad\nCabbage\nFries\n\nDessert Buffet \n\nCheese, ham and cheese toastie" },
  { date: "07/08/2026", received: "", event: "Father's 70th Birthday", client: "Michelle Von Pien", guests: "17", venue: "Bistro", service: "", status: "Confirmed", type: "Birthday", value: null, phone: "0408 757 353", email: "", spendPerHead: "", depositSent: "NA", depositPaid: "NA", sevenrooms: "", notes: "", brief: "" },
  { date: "11/08/2026", received: "", event: "Live Nation", client: "Live Nation", guests: "23", venue: "Feu", service: "", status: "Cancelled", type: "Corporate", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "20/08/2026", received: "", event: "Truffle Dinner", client: "Belongil", guests: "NA", venue: "Bistro", service: "", status: "Confirmed", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "Need Menu", brief: "" },
  { date: "21/08/2026", received: "", event: "Archie Rose Whisky Launch", client: "Archie Rose", guests: "NA", venue: "Blind Tiger", service: "", status: "Confirmed", type: "Internal Event", value: 5000, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "Need Snack Menu", brief: "BEHIND THE BARREL\nJoin us in Blind Tiger for a guided whisky tasting celebrating the craftsmanship of Archie Rose Distilling Co., featuring the launch of their new Triple Smoked Whiskey.\n\n\n\nHosted by the Archie Rose team, the evening will explore a curated selection of whiskies, culminating in an introduction to their latest release. Each pour will be thoughtfully paired with a bespoke Blind Tiger snack.\n\n\n\nFriday 21 August\n6pm until 8pm\n\nReservations are essential. Places are limited." },
  { date: "22/08/2026", received: "", event: "Hen's", client: "Emma", guests: "24", venue: "Bistro", service: "", status: "Cancelled", type: "Wedding/Engagement", value: null, phone: "403 573 120", email: "emma.carpenter123@gmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "23/08/2026", received: "", event: "Pottery by Sam Gordon in Kiosk", client: "Belongil", guests: "NA", venue: "Kiosk", service: "", status: "Cancelled", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "26/08/2026", received: "13/08/2026", event: "Private BT", client: "Andrew Adnam", guests: "6", venue: "Blind Tiger", service: "", status: "Enquiry", type: "Private Dining", value: 10000, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "Andrew Adnam and his group of five guests are looking to privately hire BT from 5pm until 12am. They want to take dinner in the Bistro. The minimum spend is $10K. Dinner in Bistro counts towards this. Let's try and upsell caviar, luxury bottles, the lot." },
  { date: "03/09/2026", received: "", event: "1800 Tequila", client: "1800", guests: "40", venue: "Bistro", service: "", status: "Confirmed", type: "Corporate", value: 17000, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "2026-09-05", received: "", event: "Engagement party", client: "Brittany Jones", guests: "50", venue: "Blind Tiger", service: "", status: "Cancelled", type: "Wedding/Engagement", value: 20000, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "28/09/2026", received: "", event: "Accountants Lunch", client: "Luana Ress", guests: "", venue: "Bistro", service: "", status: "Cancelled", type: "Birthday", value: null, phone: "0419 467 022", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "03/10/2026", received: "", event: "Pre wedding Reception", client: "Margeau Dillon", guests: "", venue: "Kiosk", service: "", status: "Cancelled", type: "Birthday", value: null, phone: "0437 824 668", email: "margeauxdillon93@gmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "05/09/2026", received: "11/08/2026", event: "Golden Bird Martini Masterclass", client: "Belongil", guests: "40", venue: "Blind Tiger", service: "", status: "Enquiry", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "06/09/2026", received: "", event: "Father's Day", client: "Belongil", guests: "", venue: "Bistro", service: "", status: "Confirmed", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "12/09/2026", received: "", event: "AG1 Kiosk Workout", client: "AG1", guests: "", venue: "Kiosk", service: "", status: "Enquiry", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "14/10/2026", received: "", event: "Moorooduc Dinner", client: "Belongil", guests: "", venue: "Bistro", service: "", status: "Confirmed", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "15/10/2026", received: "", event: "Moorooduc Dinne", client: "Belongil", guests: "", venue: "Feu", service: "", status: "Confirmed", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "16/10/2026", received: "", event: "Ampliphon", client: "Genevive", guests: "35", venue: "Bistro", service: "", status: "Cancelled", type: "Birthday", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "17/10/2026", received: "10/08/2026", event: "40th Birthday", client: "Katie Carnachan", guests: "40", venue: "Bistro", service: "", status: "Enquiry", type: "Birthday", value: null, phone: "432 201 848", email: "kcarnachan@gmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "17/10/2026", received: "11/08/2026", event: "Baby Shower", client: "Leila Kirk", guests: "15", venue: "Bistro", service: "", status: "Enquiry", type: "Other", value: null, phone: "0408 879 078", email: "leila@kirrabeachhouse.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "22/10/2026", received: "", event: "W Home", client: "W Home", guests: "", venue: "South Yarra", service: "", status: "Cancelled", type: "Birthday", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "27/10/2026", received: "", event: "CVS Lane", client: "Josh Leibermann", guests: "75", venue: "Bistro", service: "", status: "Confirmed", type: "Corporate", value: 35000, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "28/10/26", received: "", event: "REA GROUP", client: "Emma", guests: "26", venue: "Feu", service: "", status: "Enquiry", type: "Corporate", value: 35000, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "30/10/2026", received: "", event: "Wedding", client: "Rochelle Turner", guests: "", venue: "Bistro", service: "", status: "Enquiry", type: "Wedding/Engagement", value: null, phone: "402 348 831", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "31/10/2026", received: "", event: "Halloween", client: "The Ambassadors", guests: "", venue: "Multi Venue", service: "", status: "Enquiry", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "03/11/2026", received: "", event: "Melbourne Cup", client: "Belongil", guests: "", venue: "Bistro", service: "", status: "Confirmed", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "04/11/2026", received: "", event: "Pavie Wine Dinner", client: "Belongil", guests: "", venue: "", service: "", status: "Confirmed", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "06/11/2026", received: "11/08/2026", event: "Soho House Belongil Bistro Dinner", client: "Kaaran", guests: "", venue: "Bistro", service: "", status: "Enquiry", type: "Corporate", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "20/11/26", received: "", event: "Bob McTavish", client: "Belongil", guests: "", venue: "", service: "", status: "Enquiry", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "21/11/2026", received: "14/08/2026", event: "40th Birthday", client: "Todd Scott", guests: "", venue: "", service: "", status: "Enquiry", type: "", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "16/12/26", received: "", event: "Pressure Cooker Premier", client: "Belongil", guests: "", venue: "", service: "", status: "Enquiry", type: "Internal Event", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "18/12/2026", received: "", event: "Chrissy Caplice Concierge", client: "", guests: "", venue: "Feu", service: "Dinner", status: "Enquiry", type: "Corporate", value: null, phone: "", email: "chrissy@capliceconcierge.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "2027-01-15", received: "", event: "Birthday", client: "Lucy Harris", guests: "45", venue: "Feu", service: "", status: "Enquiry", type: "Birthday", value: null, phone: "422 159 375", email: "lucyrosewalters@hotmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "19/01/2027", received: "", event: "Amex", client: "Isabelle Cherry (Lateral Events)", guests: "45", venue: "Feu", service: "", status: "Confirmed", type: "Corporate", value: 30000, phone: "0402 811 092", email: "isabelle.cherry@lateralevents.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "30/01/2027", received: "", event: "Birthday", client: "Kate Riley", guests: "40", venue: "Bistro", service: "", status: "Enquiry", type: "Birthday", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "30/01/27", received: "", event: "50th Birthday", client: "Kimberley Frankham", guests: "", venue: "", service: "", status: "Enquiry", type: "Birthday", value: null, phone: "410 686 991", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "06/03/2027", received: "", event: "Ashlee Booth", client: "Elopement", guests: "50", venue: "", service: "", status: "Enquiry", type: "Birthday", value: null, phone: "0413 895 433", email: "ashleedbooth@gmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "21/03/2027", received: "13/08/2026", event: "Pre Wedding Lunch", client: "Parys", guests: "", venue: "", service: "", status: "Enquiry", type: "Wedding/Engagement", value: 30000, phone: "400 180 982", email: "parysstully@gmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "26/03/2027", received: "11/08/2026", event: "Engagement Party", client: "Jeremy and Ruby", guests: "", venue: "", service: "", status: "Enquiry", type: "Wedding/Engagement", value: null, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "07/06/2027", received: "", event: "Birthday", client: "Ash Vogel", guests: "50", venue: "", service: "", status: "Enquiry", type: "Birthday", value: null, phone: "402 375 680", email: "ash_vogel@icloud.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "01/08/2027", received: "10/08/2026", event: "Wedding reception", client: "Tayla Maui", guests: "", venue: "", service: "", status: "Enquiry", type: "Wedding/Engagement", value: 30000, phone: "", email: "", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "23/09/2027", received: "", event: "Wedding", client: "Imogen", guests: "80", venue: "Bistro", service: "", status: "Enquiry", type: "Wedding/Engagement", value: 40000, phone: "0488 191 187", email: "imogenryan@hotmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "03/10/2027", received: "", event: "40th Birthday", client: "Nick Lawless", guests: "40-50", venue: "Feu", service: "", status: "Enquiry", type: "Birthday", value: null, phone: "61423 199 567", email: "nic_lawless@hotmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "31/10/2027", received: "", event: "Elopement Party", client: "Erin Jasch", guests: "30", venue: "", service: "", status: "Enquiry", type: "Wedding/Engagement", value: null, phone: "", email: "Erin.Jasch@belleproperty.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "", received: "", event: "Birthday", client: "kim Frankham", guests: "30", venue: "Bistro", service: "", status: "Enquiry", type: "Birthday", value: null, phone: "410 686 991", email: "thefrankhams@gmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "", received: "", event: "Private Dinner", client: "Kayley", guests: "", venue: "Bistro", service: "", status: "Enquiry", type: "Private Dining", value: null, phone: "426 641 066", email: "grapeskayley@gmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
  { date: "", received: "", event: "BBSF Kiosk Pop up", client: "Belongil", guests: "", venue: "", service: "", status: "Enquiry", type: "Internal Event", value: null, phone: "", email: "rjarchivess@gmail.com", spendPerHead: "", depositSent: "", depositPaid: "", sevenrooms: "", notes: "", brief: "" },
];

/* ---------------------------------------------------------------
   HELPERS
----------------------------------------------------------------- */
function parseDate(str) {
  if (!str) return null;
  if (str.includes("-")) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const [d, m, yRaw] = str.split("/");
  const y = yRaw.length === 2 ? 2000 + Number(yRaw) : Number(yRaw);
  return new Date(y, Number(m) - 1, Number(d));
}

function parseGuests(str) {
  if (!str || str === "*") return null;
  if (str.includes("-")) {
    const [a, b] = str.split("-").map(Number);
    return Math.round((a + b) / 2);
  }
  const n = Number(str);
  return Number.isFinite(n) ? n : null;
}

function fmtCurrency(n) {
  if (n === null || n === undefined) return "—";
  return "$" + n.toLocaleString("en-AU");
}

function fmtDate(d) {
  if (!d) return "Undated";
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

function eventKey(e) {
  return `${e.event}|${e.dateRaw}|${e.client}`.toLowerCase().trim();
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\r") {
      // skip — handled by \n
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  // Drop fully-empty trailing/blank rows
  return rows.filter((r) => r.some((c) => c.trim().length));
}

function parseCsvText(text) {
  const rows = parseCsvRows(text);
  if (!rows.length) throw new Error("empty");
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name) => headers.findIndex((h) => h.includes(name));
  const dIdx = headers.findIndex((h) => h.includes("date") && !h.includes("received")),
    rIdx = idx("received"),
    evIdx = idx("event"), clIdx = idx("client"),
    gIdx = idx("guest"), vIdx = idx("venue") >= 0 ? idx("venue") : idx("location"),
    sIdx = idx("service"), stIdx = idx("status"), tIdx = idx("type"), valIdx = idx("value"),
    phIdx = idx("phone"), emIdx = idx("email"),
    spIdx = idx("spend per head") >= 0 ? idx("spend per head") : idx("spend"),
    depSentIdx = headers.findIndex((h) => h.includes("deposit") && h.includes("sent")),
    depPaidIdx = headers.findIndex((h) => h.includes("deposit") && h.includes("paid")),
    srIdx = idx("sevenrooms"), noteIdx = idx("notes") >= 0 ? idx("notes") : idx("details"),
    briefIdx = idx("xyz");
  return rows.slice(1).map((cols, i) => {
    cols = cols.map((c) => c.trim());
    const rawVal = valIdx >= 0 ? (cols[valIdx] || "").replace(/[^0-9.]/g, "") : "";
    return {
      id: i,
      dateObj: parseDate(cols[dIdx] || ""),
      dateRaw: cols[dIdx] || "",
      receivedObj: rIdx >= 0 ? parseDate(cols[rIdx] || "") : null,
      receivedRaw: rIdx >= 0 ? cols[rIdx] || "" : "",
      event: cols[evIdx] || "Untitled",
      client: cols[clIdx] || "—",
      guestsRaw: cols[gIdx] || "",
      guestsNum: parseGuests(cols[gIdx] || ""),
      venue: cols[vIdx] || "TBC",
      service: cols[sIdx] || "",
      status: cols[stIdx] || "Unspecified",
      type: cols[tIdx] || "Uncategorised",
      value: rawVal ? Number(rawVal) : null,
      phone: phIdx >= 0 ? cols[phIdx] || "" : "",
      email: emIdx >= 0 ? cols[emIdx] || "" : "",
      spendPerHead: spIdx >= 0 ? cols[spIdx] || "" : "",
      depositSent: depSentIdx >= 0 ? cols[depSentIdx] || "" : "",
      depositPaid: depPaidIdx >= 0 ? cols[depPaidIdx] || "" : "",
      sevenrooms: srIdx >= 0 ? cols[srIdx] || "" : "",
      notes: noteIdx >= 0 ? cols[noteIdx] || "" : "",
      brief: briefIdx >= 0 ? cols[briefIdx] || "" : "",
    };
  });
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_COLORS = {
  Confirmed: "#4f7a72",
  Completed: "#7a9c8e",
  Enquiry: "#d1932f",
  Cancelled: "#8b1e1e",
  Pending: "#8f8577",
  Unspecified: "#4a453e",
};

const TYPE_COLORS = ["#d4b98c", "#a8875e", "#7a6244", "#4f7a72", "#4a3d2c"];

const TODAY = new Date(); // always the real current date

function weekRange(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(d);
  start.setDate(d.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

/* ---------------------------------------------------------------
   COMPONENT
----------------------------------------------------------------- */
export default function EventsSalesDashboard() {
  const [events, setEvents] = useState(() =>
    RAW_EVENTS.map((e, i) => ({
      id: i,
      dateObj: parseDate(e.date),
      receivedObj: e.received ? parseDate(e.received) : null,
      receivedRaw: e.received || "",
      dateRaw: e.date,
      event: e.event || "Untitled",
      client: e.client || "—",
      guestsRaw: e.guests,
      guestsNum: parseGuests(e.guests),
      venue: e.venue || "TBC",
      service: e.service || "",
      status: e.status || "Unspecified",
      type: e.type || "Uncategorised",
      value: e.value,
      phone: e.phone || "",
      email: e.email || "",
      spendPerHead: e.spendPerHead || "",
      depositSent: e.depositSent || "",
      depositPaid: e.depositPaid || "",
      sevenrooms: e.sevenrooms || "",
      notes: e.notes || "",
      brief: e.brief || "",
    }))
  );

  const [statusFilter, setStatusFilter] = useState("All");
  const [showLedger, setShowLedger] = useState(false);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [savedBriefs, setSavedBriefs] = useState({});
  const [editingBrief, setEditingBrief] = useState(false);
  const [draftBrief, setDraftBrief] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const stored = await window.storage.get("runsheets", true);
        if (stored?.value) setSavedBriefs(JSON.parse(stored.value));
      } catch {
        // no saved run sheets yet — that's fine
      }
    })();
  }, []);

  function saveBrief(key, text) {
    setSavedBriefs((prev) => {
      const next = { ...prev, [key]: { text, updatedAt: new Date().toISOString() } };
      window.storage.set("runsheets", JSON.stringify(next), true).catch(() => {});
      return next;
    });
  }

  function fmtEditedAt(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }) +
      " at " + d.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
  }

  function getSavedBrief(key) {
    const v = savedBriefs[key];
    if (v === undefined) return undefined;
    return typeof v === "string" ? { text: v, updatedAt: null } : v;
  }

  useEffect(() => {
    setEditingBrief(false);
  }, [selectedEvent]);
  const [uploadError, setUploadError] = useState("");

  const filtered = useMemo(() => {
    return events
      .filter((e) => statusFilter === "All" || e.status === statusFilter)
      .filter((e) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          e.event.toLowerCase().includes(q) ||
          e.client.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (!a.dateObj) return 1;
        if (!b.dateObj) return -1;
        return a.dateObj - b.dateObj;
      });
  }, [events, statusFilter, search]);

  const kpis = useMemo(() => {
    const confirmed = events.filter((e) => e.status === "Confirmed");
    const completed = events.filter((e) => e.status === "Completed");
    const enquiries = events.filter((e) => e.status === "Enquiry");
    const cancelled = events.filter((e) => e.status === "Cancelled");
    const completedRevenue = completed.reduce((s, e) => s + (e.value || 0), 0);
    const upcomingConfirmedRevenue = confirmed.reduce((s, e) => s + (e.value || 0), 0);
    const confirmedRevenue = completedRevenue + upcomingConfirmedRevenue;
    const pipelineValue = enquiries.reduce((s, e) => s + (e.value || 0), 0);
    const totalGuests = [...confirmed, ...completed].reduce((s, e) => s + (e.guestsNum || 0), 0);
    const upcoming = events.filter((e) => e.dateObj && e.dateObj >= TODAY && e.status !== "Cancelled").length;
    const { start, end } = weekRange(TODAY);
    const hasReceivedData = events.some((e) => e.receivedObj);
    const enquiriesThisWeek = events.filter(
      (e) => e.status === "Enquiry" && e.receivedObj && e.receivedObj >= start && e.receivedObj <= end
    ).length;
    const withLead = events.filter((e) => e.receivedObj && e.dateObj);
    const avgLeadDays = withLead.length
      ? Math.round(
          withLead.reduce((s, e) => s + (e.dateObj - e.receivedObj) / (1000 * 60 * 60 * 24), 0) / withLead.length
        )
      : null;
    const resolvedCount = confirmed.length + completed.length + enquiries.length + cancelled.length;
    const conversionRate = resolvedCount
      ? Math.round(((confirmed.length + completed.length) / resolvedCount) * 100)
      : null;
    const STALE_DAYS = 14;
    const staleEnquiries = events.filter(
      (e) => e.status === "Enquiry" && e.receivedObj && (TODAY - e.receivedObj) / (1000 * 60 * 60 * 24) >= STALE_DAYS
    );
    return {
      confirmedRevenue,
      completedRevenue,
      upcomingConfirmedRevenue,
      pipelineValue,
      confirmedCount: confirmed.length,
      completedCount: completed.length,
      enquiryCount: enquiries.length,
      totalGuests,
      upcoming,
      enquiriesThisWeek,
      hasReceivedData,
      avgLeadDays,
      weekStart: start,
      weekEnd: end,
      conversionRate,
      resolvedCount,
      staleCount: staleEnquiries.length,
      staleDays: STALE_DAYS,
    };
  }, [events]);

  const staleEnquiriesList = useMemo(() => {
    const STALE_DAYS = 14;
    return events
      .filter((e) => e.status === "Enquiry" && e.receivedObj && (TODAY - e.receivedObj) / (1000 * 60 * 60 * 24) >= STALE_DAYS)
      .sort((a, b) => a.receivedObj - b.receivedObj);
  }, [events]);
  const [showStaleEnquiries, setShowStaleEnquiries] = useState(false);

  const clientCounts = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      const c = (e.client || "").trim().toLowerCase();
      if (c && c !== "—") map[c] = (map[c] || 0) + 1;
    });
    return map;
  }, [events]);
  const repeatClientNames = useMemo(
    () => new Set(Object.keys(clientCounts).filter((c) => clientCounts[c] > 1)),
    [clientCounts]
  );
  const repeatClientCount = repeatClientNames.size;
  function isRepeatClient(e) {
    return repeatClientNames.has((e.client || "").trim().toLowerCase());
  }

  const weekEnquiriesList = useMemo(
    () =>
      events
        .filter(
          (e) => e.status === "Enquiry" && e.receivedObj && e.receivedObj >= kpis.weekStart && e.receivedObj <= kpis.weekEnd
        )
        .sort((a, b) => b.receivedObj - a.receivedObj),
    [events, kpis.weekStart, kpis.weekEnd]
  );
  const [showWeekEnquiries, setShowWeekEnquiries] = useState(false);

  const revenueByMonth = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      if (!e.dateObj) return;
      const key = `${MONTHS[e.dateObj.getMonth()]} ${String(e.dateObj.getFullYear()).slice(2)}`;
      if (!map[key]) map[key] = { key, sortKey: e.dateObj.getFullYear() * 12 + e.dateObj.getMonth(), Confirmed: 0, Enquiry: 0, Cancelled: 0 };
      if (e.status === "Confirmed") map[key].Confirmed += e.value || 0;
      if (e.status === "Enquiry") map[key].Enquiry += e.value || 0;
      if (e.status === "Cancelled") map[key].Cancelled += e.value || 0;
    });
    return Object.values(map).sort((a, b) => a.sortKey - b.sortKey);
  }, [events]);

  const bookingsByMonth = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      if (!e.dateObj) return;
      const key = `${MONTHS[e.dateObj.getMonth()]} ${String(e.dateObj.getFullYear()).slice(2)}`;
      if (!map[key]) map[key] = { key, sortKey: e.dateObj.getFullYear() * 12 + e.dateObj.getMonth(), Confirmed: 0, Completed: 0, Enquiry: 0, Cancelled: 0 };
      if (map[key][e.status] !== undefined) map[key][e.status] += 1;
    });
    return Object.values(map).sort((a, b) => a.sortKey - b.sortKey);
  }, [events]);

  const avgSpendByVenue = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      const spend = parseFloat((e.spendPerHead || "").replace(/[^0-9.]/g, ""));
      if (!spend || !e.venue || e.venue === "TBC") return;
      if (!map[e.venue]) map[e.venue] = [];
      map[e.venue].push(spend);
    });
    return Object.entries(map)
      .map(([name, values]) => ({ name, avg: Math.round(values.reduce((s, v) => s + v, 0) / values.length) }))
      .sort((a, b) => b.avg - a.avg);
  }, [events]);

  const statusBreakdown = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      map[e.status] = (map[e.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [events]);

  const enquiriesByType = useMemo(() => {
    const map = {};
    events
      .filter((e) => e.status === "Enquiry")
      .forEach((e) => {
        map[e.type] = (map[e.type] || 0) + 1;
      });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [events]);

  const venueBreakdown = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      const v = e.venue === "TBC" ? "TBC" : e.venue;
      map[v] = (map[v] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [events]);

  const upcomingList = useMemo(
    () =>
      events
        .filter((e) => e.dateObj && e.dateObj >= TODAY)
        .sort((a, b) => a.dateObj - b.dateObj)
        .slice(0, 6),
    [events]
  );

  const [calendarMonth, setCalendarMonth] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);

  const calendarGrid = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const eventsByDay = {};
    events.forEach((e) => {
      if (!e.dateObj) return;
      if (e.dateObj.getFullYear() === year && e.dateObj.getMonth() === month) {
        const key = e.dateObj.getDate();
        (eventsByDay[key] = eventsByDay[key] || []).push(e);
      }
    });
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return { cells, eventsByDay, year, month };
  }, [calendarMonth, events]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return (calendarGrid.eventsByDay[selectedDay] || []).sort((a, b) => a.event.localeCompare(b.event));
  }, [selectedDay, calendarGrid]);

  function handleCsvUpload(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;
    setUploadError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setEvents(parseCsvText(e.target.result));
        setShowUpload(false);
      } catch (err) {
        setUploadError("Couldn't read that file. Export a CSV with Date, Event, Client, Guests, Venue, Status, Type, Value columns.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div
      style={{
        background: "radial-gradient(ellipse at top, #2c2418 0%, var(--ink) 45%)",
        minHeight: "100%",
        color: "var(--cream)",
        fontFamily: "var(--font-body)",
      }}
      className="p-4 md:p-8"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        :root {
          --ink: #1d1a16;
          --panel: #262119;
          --panel-light: #302a20;
          --brass: #a8875e;
          --brass-bright: #d4b98c;
          --cream: #efe6d6;
          --muted: #9c9186;
          --font-display: 'Cormorant Garamond', serif;
          --font-body: 'Work Sans', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;
        }
        .esd-serif { font-family: var(--font-display); font-weight: 600; letter-spacing: 0.01em; }
        .esd-texture {
          background-image: repeating-linear-gradient(115deg, rgba(168,135,94,0.05) 0px, rgba(168,135,94,0.05) 1px, transparent 1px, transparent 5px);
        }
        .esd-mono { font-family: var(--font-mono); }
        .esd-fade { animation: esdFadeIn 0.5s ease both; }
        @keyframes esdFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .esd-card {
          background: var(--panel);
          border: 1px solid rgba(168,135,94,0.15);
        }
        .esd-card:hover { border-color: rgba(168,135,94,0.4); }
        .esd-divider {
          border-bottom: 1px dashed rgba(168,135,94,0.25);
        }
        .esd-scroll::-webkit-scrollbar { width: 6px; }
        .esd-scroll::-webkit-scrollbar-thumb { background: rgba(168,135,94,0.3); border-radius: 4px; }
        select, input { color-scheme: dark; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 esd-fade">
        <div>
          <p className="esd-mono text-xs tracking-widest uppercase" style={{ color: "var(--brass)" }}>
            The Belongil · Byron Bay
          </p>
          <h1 className="esd-serif text-4xl md:text-5xl mt-1" style={{ color: "var(--cream)" }}>
            Events &amp; Private Dining
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Kiosk · Bistro · Feu · Blind Tiger — {events.length} bookings on the books, as of {fmtDate(TODAY)}
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm esd-fade"
          style={{ background: "var(--panel-light)", border: "1px solid rgba(168,135,94,0.3)", color: "var(--brass-bright)" }}
        >
          <Upload size={16} /> Upload updated CSV
        </button>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="esd-card esd-texture rounded-xl p-6 max-w-md w-full relative">
            <button onClick={() => setShowUpload(false)} className="absolute top-4 right-4" style={{ color: "var(--muted)" }}>
              <X size={18} />
            </button>
            <h3 className="esd-serif text-xl mb-2" style={{ color: "var(--cream)" }}>Refresh the ledger</h3>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              In Google Sheets: File → Download → Comma Separated Values (.csv), then upload it here.
              Expected columns: Date, Event, Client, Guests, Venue, Status, Type, Value — plus <b>Date Received</b> if you want the weekly enquiries count to work.
            </p>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="text-sm" style={{ color: "var(--cream)" }} />
            {uploadError && <p className="text-sm mt-3" style={{ color: "#c17a5a" }}>{uploadError}</p>}
          </div>
        </div>
      )}

      {/* Stale enquiries modal */}
      {showStaleEnquiries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }}>
          <div className="esd-card esd-texture rounded-xl p-6 max-w-md w-full relative esd-scroll" style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <button onClick={() => setShowStaleEnquiries(false)} className="absolute top-4 right-4" style={{ color: "var(--muted)" }}>
              <X size={18} />
            </button>
            <p className="esd-mono text-xs tracking-widest uppercase mb-1" style={{ color: "#8b1e1e" }}>
              {kpis.staleDays}+ days with no follow-up
            </p>
            <h3 className="esd-serif text-xl mb-4" style={{ color: "var(--cream)" }}>
              Stale Enquiries ({staleEnquiriesList.length})
            </h3>
            <div className="space-y-0">
              {staleEnquiriesList.map((e, i) => {
                const daysOld = Math.round((TODAY - e.receivedObj) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={e.id}
                    className={`py-3 ${i !== staleEnquiriesList.length - 1 ? "esd-divider" : ""}`}
                    onClick={() => {
                      setShowStaleEnquiries(false);
                      setSelectedEvent(e);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm" style={{ color: "var(--cream)" }}>{e.event}</p>
                      <span className="esd-mono text-xs px-2 py-0.5 rounded-full" style={{ background: "#8b1e1e22", color: "#8b1e1e" }}>
                        {daysOld}d old
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                      {e.client} · {e.venue} · received {fmtDate(e.receivedObj)}
                    </p>
                  </div>
                );
              })}
              {staleEnquiriesList.length === 0 && (
                <p className="text-sm" style={{ color: "var(--muted)" }}>Nothing stale right now.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Week enquiries modal */}
      {showWeekEnquiries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }}>
          <div className="esd-card esd-texture rounded-xl p-6 max-w-md w-full relative esd-scroll" style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <button onClick={() => setShowWeekEnquiries(false)} className="absolute top-4 right-4" style={{ color: "var(--muted)" }}>
              <X size={18} />
            </button>
            <p className="esd-mono text-xs tracking-widest uppercase mb-1" style={{ color: "var(--brass)" }}>
              {fmtDate(kpis.weekStart)} – {fmtDate(kpis.weekEnd)}
            </p>
            <h3 className="esd-serif text-xl mb-4" style={{ color: "var(--cream)" }}>
              Enquiries Received This Week ({weekEnquiriesList.length})
            </h3>
            <div className="space-y-0">
              {weekEnquiriesList.map((e, i) => (
                <div
                  key={e.id}
                  className={`py-3 ${i !== weekEnquiriesList.length - 1 ? "esd-divider" : ""}`}
                  onClick={() => {
                    setShowWeekEnquiries(false);
                    setSelectedEvent(e);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: "var(--cream)" }}>{e.event}</p>
                    <p className="esd-mono text-xs" style={{ color: "var(--brass-bright)" }}>{fmtDate(e.receivedObj)}</p>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                    {e.client} · {e.venue} · {e.guestsRaw ? `${e.guestsRaw} guests` : "guests TBC"} · for {fmtDate(e.dateObj)}
                  </p>
                </div>
              ))}
              {weekEnquiriesList.length === 0 && (
                <p className="text-sm" style={{ color: "var(--muted)" }}>Nothing received this week yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Run Sheet modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }}>
          <div className="esd-card esd-texture rounded-xl p-6 max-w-lg w-full relative esd-scroll" style={{ maxHeight: "88vh", overflowY: "auto" }}>
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4" style={{ color: "var(--muted)" }}>
              <X size={18} />
            </button>

            <p className="esd-mono text-xs tracking-widest uppercase mb-1" style={{ color: "var(--brass)" }}>Brief &amp; Run Sheet</p>
            <h3 className="esd-serif text-2xl mb-1" style={{ color: "var(--cream)" }}>{selectedEvent.event}</h3>
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: `${STATUS_COLORS[selectedEvent.status]}22`, color: STATUS_COLORS[selectedEvent.status] }}
              >
                {selectedEvent.status}
              </span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>{selectedEvent.type}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="esd-label" style={{ fontSize: 10, textTransform: "uppercase", color: "var(--muted)" }}>Date</p>
                <p className="text-sm" style={{ color: "var(--cream)" }}>{fmtDate(selectedEvent.dateObj)}</p>
              </div>
              <div>
                <p className="esd-label" style={{ fontSize: 10, textTransform: "uppercase", color: "var(--muted)" }}>Venue</p>
                <p className="text-sm" style={{ color: "var(--cream)" }}>{selectedEvent.venue}</p>
              </div>
              <div>
                <p className="esd-label" style={{ fontSize: 10, textTransform: "uppercase", color: "var(--muted)" }}>Guests</p>
                <p className="text-sm" style={{ color: "var(--cream)" }}>{selectedEvent.guestsRaw || "—"}</p>
              </div>
              <div>
                <p className="esd-label" style={{ fontSize: 10, textTransform: "uppercase", color: "var(--muted)" }}>Service</p>
                <p className="text-sm" style={{ color: "var(--cream)" }}>{selectedEvent.service || "—"}</p>
              </div>
            </div>

            <div className="esd-divider mb-4" />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="esd-mono text-xs uppercase" style={{ color: "var(--brass)" }}>Event Brief &amp; Run Sheet</p>
                {!editingBrief && (() => {
                  const savedEntry = getSavedBrief(eventKey(selectedEvent));
                  const label = savedEntry?.updatedAt
                    ? `Last edited ${fmtEditedAt(savedEntry.updatedAt)}`
                    : savedEntry
                    ? null
                    : selectedEvent.brief
                    ? "From sheet, not yet edited here"
                    : null;
                  return label ? (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ color: "#1a1a1a", background: "#efe6d6" }}
                    >
                      {label}
                    </span>
                  ) : null;
                })()}
              </div>
              {!editingBrief ? (
                <button
                  onClick={() => {
                    const key = eventKey(selectedEvent);
                    setDraftBrief(getSavedBrief(key)?.text ?? selectedEvent.brief ?? "");
                    setEditingBrief(true);
                  }}
                  className="text-xs underline"
                  style={{ color: "var(--brass-bright)" }}
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingBrief(false)}
                    className="text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      saveBrief(eventKey(selectedEvent), draftBrief);
                      setEditingBrief(false);
                    }}
                    className="text-xs underline"
                    style={{ color: "var(--brass-bright)" }}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {editingBrief ? (
              <textarea
                className="w-full text-sm p-3 rounded-lg mb-4"
                style={{
                  color: "var(--cream)",
                  background: "var(--panel-light)",
                  border: "1px solid rgba(168,135,94,0.4)",
                  lineHeight: 1.6,
                  minHeight: 220,
                  outline: "none",
                }}
                value={draftBrief}
                onChange={(e) => setDraftBrief(e.target.value)}
              />
            ) : (() => {
              const key = eventKey(selectedEvent);
              const saved = getSavedBrief(key);
              const displayedBrief = saved ? saved.text : selectedEvent.brief;
              return displayedBrief ? (
                <div
                  className="text-sm whitespace-pre-wrap mb-4 p-3 rounded-lg"
                  style={{ color: "var(--cream)", background: "var(--panel-light)", border: "1px solid rgba(168,135,94,0.25)", lineHeight: 1.6 }}
                >
                  {displayedBrief}
                </div>
              ) : (
                <p className="text-sm mb-4" style={{ color: "var(--muted)", fontStyle: "italic" }}>
                  No brief on file yet — click Edit to write one, or add it to the "XYZ" column in the sheet and re-upload.
                </p>
              );
            })()}

            <div className="esd-divider mb-4" />

            <p className="esd-mono text-xs uppercase mb-2" style={{ color: "var(--brass)" }}>Client</p>
            <div className="grid grid-cols-1 gap-1.5 mb-4 text-sm" style={{ color: "var(--cream)" }}>
              <p className="flex items-center gap-1.5">
                {selectedEvent.client}
                {isRepeatClient(selectedEvent) && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(168,135,94,0.2)", color: "var(--brass-bright)" }}>
                    repeat client
                  </span>
                )}
              </p>
              {selectedEvent.phone && <p style={{ color: "var(--muted)" }}>{selectedEvent.phone}</p>}
              {selectedEvent.email && <p style={{ color: "var(--muted)" }}>{selectedEvent.email}</p>}
            </div>

            <div className="esd-divider mb-4" />

            <p className="esd-mono text-xs uppercase mb-2" style={{ color: "var(--brass)" }}>Financials</p>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <p className="esd-label" style={{ fontSize: 10, textTransform: "uppercase", color: "var(--muted)" }}>Value</p>
                <p style={{ color: "var(--brass-bright)" }}>{fmtCurrency(selectedEvent.value)}</p>
              </div>
              <div>
                <p className="esd-label" style={{ fontSize: 10, textTransform: "uppercase", color: "var(--muted)" }}>Spend per head</p>
                <p style={{ color: "var(--cream)" }}>{selectedEvent.spendPerHead || "—"}</p>
              </div>
              <div>
                <p className="esd-label" style={{ fontSize: 10, textTransform: "uppercase", color: "var(--muted)" }}>Deposit sent</p>
                <p style={{ color: "var(--cream)" }}>{selectedEvent.depositSent || "—"}</p>
              </div>
              <div>
                <p className="esd-label" style={{ fontSize: 10, textTransform: "uppercase", color: "var(--muted)" }}>Deposit paid</p>
                <p style={{ color: "var(--cream)" }}>{selectedEvent.depositPaid || "—"}</p>
              </div>
            </div>

            {selectedEvent.sevenrooms && (
              <>
                <div className="esd-divider mb-4" />
                <p className="esd-mono text-xs uppercase mb-1" style={{ color: "var(--brass)" }}>Sevenrooms Booking</p>
                <p className="text-sm mb-4" style={{ color: "var(--cream)" }}>{selectedEvent.sevenrooms}</p>
              </>
            )}

            {selectedEvent.notes && (
              <>
                <div className="esd-divider mb-4" />
                <p className="esd-mono text-xs uppercase mb-1" style={{ color: "var(--brass)" }}>Additional Notes</p>
                <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--cream)" }}>{selectedEvent.notes}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Revenue row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {[
          { label: "Revenue captured to date (completed)", value: fmtCurrency(kpis.completedRevenue), icon: BadgeCheck, accent: "#4f7a72" },
          { label: "Upcoming confirmed revenue", value: fmtCurrency(kpis.upcomingConfirmedRevenue), icon: CalendarClock, accent: "var(--brass)" },
          { label: "Revenue in enquiries", value: fmtCurrency(kpis.pipelineValue), icon: FileClock, accent: "#a3583c" },
        ].map((k, i) => (
          <div key={i} className="esd-card esd-texture rounded-xl p-5 esd-fade" style={{ animationDelay: `${i * 60}ms`, borderColor: `${k.accent}44` }}>
            <k.icon size={18} style={{ color: k.accent }} />
            <p className="esd-mono text-2xl mt-2" style={{ color: "var(--cream)" }}>{k.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Confirmed bookings", value: kpis.confirmedCount, icon: CalendarDays },
          { label: "Open enquiries", value: kpis.enquiryCount, icon: FileClock },
          { label: "Confirmed guests", value: kpis.totalGuests.toLocaleString(), icon: Users },
          {
            label: kpis.hasReceivedData ? "Enquiries this week" : "Enquiries this week (needs Date Received)",
            value: kpis.hasReceivedData ? kpis.enquiriesThisWeek : "—",
            icon: Inbox,
            onClick: kpis.hasReceivedData ? () => setShowWeekEnquiries(true) : null,
          },
          {
            label: kpis.hasReceivedData ? "Avg. lead time" : "Avg. lead time (needs Date Received)",
            value: kpis.hasReceivedData && kpis.avgLeadDays !== null ? `${kpis.avgLeadDays}d` : "—",
            icon: Hourglass,
          },
          {
            label: "Enquiry → booking rate",
            value: kpis.conversionRate !== null ? `${kpis.conversionRate}%` : "—",
            icon: TrendingUp,
          },
          {
            label: kpis.hasReceivedData ? `Stale enquiries (${kpis.staleDays}+ days)` : "Stale enquiries (needs Date Received)",
            value: kpis.hasReceivedData ? kpis.staleCount : "—",
            icon: AlertTriangle,
            onClick: kpis.hasReceivedData && kpis.staleCount > 0 ? () => setShowStaleEnquiries(true) : null,
          },
          {
            label: "Repeat clients",
            value: repeatClientCount,
            icon: Repeat,
          },
        ].map((k, i) => (
          <div
            key={i}
            className="esd-card esd-texture rounded-xl p-4 esd-fade"
            style={{ animationDelay: `${i * 60}ms`, cursor: k.onClick ? "pointer" : "default" }}
            onClick={k.onClick || undefined}
          >
            <k.icon size={16} style={{ color: "var(--brass)" }} />
            <p className="esd-mono text-xl mt-2" style={{ color: "var(--cream)" }}>{k.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="esd-card esd-texture rounded-xl p-4 lg:col-span-2 esd-fade">
          <h3 className="esd-serif text-lg mb-3" style={{ color: "var(--cream)" }}>Revenue by month</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueByMonth} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,135,94,0.1)" vertical={false} />
              <XAxis dataKey="key" tick={{ fill: "#9c9186", fontSize: 11 }} axisLine={{ stroke: "rgba(168,135,94,0.2)" }} tickLine={false} />
              <YAxis tick={{ fill: "#9c9186", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "#302a20", border: "1px solid rgba(168,135,94,0.3)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#efe6d6" }}
                formatter={(v) => fmtCurrency(v)}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9c9186" }} />
              <Bar dataKey="Confirmed" stackId="a" fill={STATUS_COLORS.Confirmed} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Enquiry" stackId="a" fill={STATUS_COLORS.Enquiry} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Cancelled" stackId="a" fill={STATUS_COLORS.Cancelled} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="esd-card esd-texture rounded-xl p-4 esd-fade">
          <h3 className="esd-serif text-lg mb-3" style={{ color: "var(--cream)" }}>Status of the book</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {statusBreakdown.map((entry, i) => (
                  <Cell key={i} fill={STATUS_COLORS[entry.name] || "#4a453e"} stroke="var(--panel)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#302a20", border: "1px solid rgba(168,135,94,0.3)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9c9186" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bookings by month + Avg spend per head */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="esd-card esd-texture rounded-xl p-4 lg:col-span-2 esd-fade">
          <h3 className="esd-serif text-lg mb-3" style={{ color: "var(--cream)" }}>Bookings by month</h3>
          <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>Count of events, not dollars — for staffing and capacity planning.</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bookingsByMonth} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,135,94,0.1)" vertical={false} />
              <XAxis dataKey="key" tick={{ fill: "#9c9186", fontSize: 11 }} axisLine={{ stroke: "rgba(168,135,94,0.2)" }} tickLine={false} />
              <YAxis tick={{ fill: "#9c9186", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#302a20", border: "1px solid rgba(168,135,94,0.3)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#efe6d6" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9c9186" }} />
              <Bar dataKey="Confirmed" stackId="b" fill={STATUS_COLORS.Confirmed} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Completed" stackId="b" fill={STATUS_COLORS.Completed} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Enquiry" stackId="b" fill={STATUS_COLORS.Enquiry} radius={[0, 0, 0, 0]} />
              <Bar dataKey="Cancelled" stackId="b" fill={STATUS_COLORS.Cancelled} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="esd-card esd-texture rounded-xl p-4 esd-fade">
          <h3 className="esd-serif text-lg mb-3" style={{ color: "var(--cream)" }}>Avg. spend per head</h3>
          {avgSpendByVenue.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={avgSpendByVenue} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,135,94,0.1)" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#9c9186", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fill: "#9c9186", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#302a20", border: "1px solid rgba(168,135,94,0.3)", borderRadius: 8, fontSize: 12 }} formatter={(v) => `$${v}/head`} />
                <Bar dataKey="avg" fill="var(--brass)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm" style={{ color: "var(--muted)" }}>No Spend Per Head data in the sheet yet.</p>
          )}
        </div>
      </div>

      {/* Enquiries by type + Busiest venues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="esd-card esd-texture rounded-xl p-4 esd-fade">
          <h3 className="esd-serif text-lg mb-3" style={{ color: "var(--cream)" }}>Enquiries by type</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={enquiriesByType} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,135,94,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#9c9186", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fill: "#9c9186", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#302a20", border: "1px solid rgba(168,135,94,0.3)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                {enquiriesByType.map((_, i) => (
                  <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>
            "Uncategorised" is every open enquiry the sheet hasn't tagged with a Type yet.
          </p>
        </div>

        <div className="esd-card esd-texture rounded-xl p-4 esd-fade">
          <h3 className="esd-serif text-lg mb-3" style={{ color: "var(--cream)" }}>Busiest venues</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={venueBreakdown} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168,135,94,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#9c9186", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fill: "#9c9186", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#302a20", border: "1px solid rgba(168,135,94,0.3)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="var(--brass)" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="esd-card esd-texture rounded-xl p-4 esd-fade">
          <h3 className="esd-serif text-lg mb-3" style={{ color: "var(--cream)" }}>Next on the calendar</h3>
          <div className="space-y-0">
            {upcomingList.map((e, i) => (
              <div
                key={e.id}
                className={`flex items-center justify-between py-3 ${i !== upcomingList.length - 1 ? "esd-divider" : ""}`}
                onClick={() => setSelectedEvent(e)}
                style={{ cursor: "pointer" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[e.status] }} />
                  <div>
                    <p className="text-sm" style={{ color: "var(--cream)" }}>{e.event}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{e.client} · {e.venue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="esd-mono text-xs" style={{ color: "var(--brass-bright)" }}>{fmtDate(e.dateObj)}</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{e.guestsRaw ? `${e.guestsRaw} guests` : ""}</p>
                </div>
              </div>
            ))}
            {upcomingList.length === 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>Nothing dated ahead of today.</p>}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="esd-card esd-texture rounded-xl p-4 lg:col-span-2 esd-fade">
          <div className="flex items-center justify-between mb-4">
            <h3 className="esd-serif text-lg" style={{ color: "var(--cream)" }}>
              {calendarMonth.toLocaleDateString("en-AU", { month: "long", year: "numeric" })}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
                  setSelectedDay(null);
                }}
                className="p-1.5 rounded-lg"
                style={{ background: "var(--panel-light)", border: "1px solid rgba(168,135,94,0.25)", color: "var(--brass-bright)" }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  setCalendarMonth(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
                  setSelectedDay(null);
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs"
                style={{ background: "var(--panel-light)", border: "1px solid rgba(168,135,94,0.25)", color: "var(--muted)" }}
              >
                Today
              </button>
              <button
                onClick={() => {
                  setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
                  setSelectedDay(null);
                }}
                className="p-1.5 rounded-lg"
                style={{ background: "var(--panel-light)", border: "1px solid rgba(168,135,94,0.25)", color: "var(--brass-bright)" }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="text-center text-xs py-1" style={{ color: "var(--muted)" }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarGrid.cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const dayEvents = calendarGrid.eventsByDay[d] || [];
              const isToday =
                TODAY.getFullYear() === calendarGrid.year && TODAY.getMonth() === calendarGrid.month && TODAY.getDate() === d;
              const isSelected = selectedDay === d;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(isSelected ? null : d)}
                  className="rounded-lg p-1.5 text-left transition-colors"
                  style={{
                    minHeight: 56,
                    background: isSelected ? "rgba(168,135,94,0.18)" : "var(--panel-light)",
                    border: isToday ? "1px solid var(--brass)" : "1px solid rgba(168,135,94,0.12)",
                  }}
                >
                  <span className="esd-mono text-xs" style={{ color: isToday ? "var(--brass-bright)" : "var(--muted)" }}>{d}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {dayEvents.slice(0, 4).map((e, j) => (
                        <span key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[e.status] }} />
                      ))}
                      {dayEvents.length > 4 && (
                        <span className="text-[10px] esd-mono" style={{ color: "var(--muted)" }}>+{dayEvents.length - 4}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="esd-card esd-texture rounded-xl p-4 esd-fade">
          <h3 className="esd-serif text-lg mb-3" style={{ color: "var(--cream)" }}>
            {selectedDay
              ? new Date(calendarGrid.year, calendarGrid.month, selectedDay).toLocaleDateString("en-AU", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })
              : "Select a day"}
          </h3>
          {!selectedDay && (
            <p className="text-sm" style={{ color: "var(--muted)" }}>Click any date on the calendar to see what's booked.</p>
          )}
          {selectedDay && selectedDayEvents.length === 0 && (
            <p className="text-sm" style={{ color: "var(--muted)" }}>Nothing on the books this day.</p>
          )}
          <div className="space-y-0">
            {selectedDayEvents.map((e, i) => (
              <div
                key={e.id}
                className={`py-2.5 ${i !== selectedDayEvents.length - 1 ? "esd-divider" : ""}`}
                onClick={() => setSelectedEvent(e)}
                style={{ cursor: "pointer" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[e.status] }} />
                  <p className="text-sm" style={{ color: "var(--cream)" }}>{e.event}</p>
                </div>
                <p className="text-xs mt-0.5 ml-4" style={{ color: "var(--muted)" }}>{e.client} · {e.venue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event ledger table */}
      <div className="esd-card esd-texture rounded-xl p-4 esd-fade">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3" style={{ marginBottom: showLedger ? 16 : 0 }}>
          <button
            onClick={() => setShowLedger((v) => !v)}
            className="flex items-center gap-2"
            style={{ color: "var(--cream)" }}
          >
            <h3 className="esd-serif text-lg">Full ledger</h3>
            <span className="text-xs" style={{ color: "var(--muted)" }}>({events.length} events)</span>
            <ChevronDown size={16} style={{ color: "var(--brass)", transform: showLedger ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {showLedger && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--panel-light)", border: "1px solid rgba(168,135,94,0.2)" }}>
                <Search size={14} style={{ color: "var(--muted)" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search event, client, venue…"
                  className="bg-transparent outline-none text-sm"
                  style={{ color: "var(--cream)" }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm px-3 py-1.5 rounded-lg outline-none"
                style={{ background: "var(--panel-light)", border: "1px solid rgba(168,135,94,0.2)", color: "var(--cream)" }}
              >
                <option value="All">All statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Enquiry">Enquiry</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Pending">Pending</option>
                <option value="Unspecified">Unspecified</option>
              </select>
            </div>
          )}
        </div>

        {showLedger && (
          <div className="overflow-x-auto esd-scroll">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="esd-divider">
                  {["Date", "Event", "Client", "Venue", "Guests", "Status", "Value"].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 text-xs uppercase tracking-wide" style={{ color: "var(--brass)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="esd-divider"
                    onClick={() => setSelectedEvent(e)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="py-2 pr-4 esd-mono text-xs" style={{ color: "var(--muted)" }}>{fmtDate(e.dateObj)}</td>
                    <td className="py-2 pr-4" style={{ color: "var(--cream)" }}>{e.event}</td>
                    <td className="py-2 pr-4" style={{ color: "var(--muted)" }}>
                      {e.client}
                      {isRepeatClient(e) && (
                        <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ background: "rgba(168,135,94,0.2)", color: "var(--brass-bright)" }}>
                          repeat
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4" style={{ color: "var(--muted)" }}>{e.venue}</td>
                    <td className="py-2 pr-4 esd-mono text-xs" style={{ color: "var(--muted)" }}>{e.guestsRaw || "—"}</td>
                    <td className="py-2 pr-4">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: `${STATUS_COLORS[e.status]}22`, color: STATUS_COLORS[e.status] }}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-2 pr-4 esd-mono text-xs" style={{ color: "var(--brass-bright)" }}>{fmtCurrency(e.value)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="py-6 text-center text-sm" style={{ color: "var(--muted)" }}>No entries match the current search and filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
