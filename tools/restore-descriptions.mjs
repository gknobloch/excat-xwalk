/**
 * Adds description paragraphs back to xwalk-formatted cards-teaser content.
 * Maps each card by its title to its original description.
 */
import { readFileSync, writeFileSync } from 'fs';

const descriptions = {
  'Bilanzpressekonferenz Geschäftsjahr 2025': '<strong>23. Februar 2026 |</strong> Volksbank Freiburg präsentiert starke Ergebnisse für das Geschäftsjahr 2025.',
  'Die-immer-dabei-Bezahl-App': '\u201cMachen Sie Ihr Smartphone zum Portemonnaie: Mobil bezahlen, Geld senden und mehr.\u201d',
  'Der Volksbank Freiburg Wald': '\u201cGemeinsam für den Wald von morgen: Wir fördern die Aufforstung im Mooswald.\u201d',
  'Ihr digitales Banking': 'Erledigen Sie Ihre Bankgeschäfte wann, wo und wie Sie wollen.',
  'Mitgliedschaft': 'Mitwissen, mitbestimmen, mitverdienen \u2013 das ist unser Angebot an unsere Mitglieder.',
  'Sicherheit': 'Informieren Sie sich über aktuelle Betrugsmaschen und wie Sie sich dagegen schützen.',
  'Meine Bank': '\u201eMeine Bank gehört mir\u201c \u2013 das ist unser Motto.',
  'Service &amp; Mehrwerte': 'Wir sind mit unseren Services immer für Sie da \u2013 jederzeit und überall.',
  'Girokonto': 'Mit unseren Girokontomodellen haben Sie Ihre Finanzen im Griff.',
  'Debit- und Kreditkarten': 'Mit einer Visa Karte sind Sie gut gerüstet.',
  'VR Banking App': 'Banking und Bezahlen in einer App. Jetzt herunterladen.',
  'Sparbrief': 'Ihr Geld ist fest angelegt und Sie erhalten attraktive Zinsen.',
  'easyCredit': 'Sofortkredit mit finanziellem Spielraum \u2014 jetzt berechnen und abschließen',
  'Online-Brokerage': 'Mit unserem Online-Brokerage handeln Sie schnell und einfach an der Börse.',
  'Geschäftskonto': 'Mit unserem Geschäftskonto wickeln Sie Zahlungen ganz einfach ab.',
  'Unternehmerkredit': 'Für neue Pläne oder aufgeschobene Vorhaben bis zu 100.000 Euro erhalten',
  'Auslandszahlungsverkehr': 'Wir wickeln Zahlungsaufträge auch über nationale Grenzen hinaus sicher und schnell ab.',
  'Direktversicherung': 'Bieten Sie Ihren Angestellten eine betriebliche Altersvorsorge.',
  'Unternehmensnachfolge': 'Kompetente Beratung für Ihre Nachfolge bei finanziellen und vermögensbezogenen Fragen.',
  'BankingManager': 'Der BankingManager kommt. Wir bereiten alles für Sie vor.',
};

const file = process.argv[2] || 'content/index.plain.html';
const lines = readFileSync(file, 'utf-8').split('\n');
const output = [];
let added = 0;

for (let i = 0; i < lines.length; i++) {
  output.push(lines[i]);

  // After a link line inside a cards-teaser content cell, add description
  const linkMatch = lines[i].match(/^(\s*)<p><a href="[^"]*">(.+?)<\/a><\/p>$/);
  if (linkMatch) {
    const [, indent, title] = linkMatch;
    const desc = descriptions[title];
    if (desc) {
      output.push(`${indent}<p>${desc}</p>`);
      added++;
    }
  }
}

writeFileSync(file, output.join('\n'), 'utf-8');
console.log(`Restored ${added} descriptions in ${file}`);
