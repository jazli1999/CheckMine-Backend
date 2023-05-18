const aggregatedPartitions = [
  ['AMS'],
  ['BLL', 'BRN', 'BRU'],
  ['CRL', 'CSO'],
  ['EIN'],
  ['ERF', 'GRZ'],
  ['GVA', 'GWT'],
  ['INN'],
  ['KLU', 'KRK'],
  ['LBC'],
  ['LNE'],
  ['PRG', 'RLG', 'RTM', 'SXB'],
  ['VIE', 'WAW'],
];

const aggregatedAirports = aggregatedPartitions.flat();

const allAirports = [
  'AMS',
  'BER',
  'BLL',
  'BRE',
  'BRN',
  'BRU',
  'BSL',
  'CGN',
  'CRL',
  'CSO',
  'DRS',
  'DTM',
  'DUS',
  'EIN',
  'ERF',
  'FDH',
  'FKB',
  'FMM',
  'FMO',
  'FRA',
  'GRZ',
  'GVA',
  'GWT',
  'HAJ',
  'HAM',
  'HHN',
  'INN',
  'KLU',
  'KRK',
  'KSF',
  'LBC',
  'LEJ',
  'LNZ',
  'LUX',
  'MUC',
  'NRN',
  'NUE',
  'PAD',
  'PRG',
  'RLG',
  'RTM',
  'SCN',
  'STR',
  'SXB',
  'SZG',
  'VIE',
  'WAW',
  'ZRH',
];

const statements = aggregatedPartitions.map(
  (partition) =>
    `CREATE TABLE IF NOT EXISTS offer_${partition.join('_').toLowerCase()} \
PARTITION OF offer \
FOR VALUES IN (${partition.map((airport) => `'${airport}'`).join(', ')});`
);

const durationRanges = [
  [0, 4],
  [4, 7],
  [7, 8],
  [8, 10],
  [10, 14],
  [14, 15],
  [15, 'MAXVALUE'],
];

allAirports.forEach((airport) => {
  if (aggregatedAirports.includes(airport)) return;
  statements.push(
    `CREATE TABLE IF NOT EXISTS offer_${airport.toLowerCase()} PARTITION OF offer FOR VALUES IN ('${airport}') \
PARTITION BY RANGE (duration);`
  );
  durationRanges.map((range) => {
    statements.push(
      `CREATE TABLE IF NOT EXISTS \
offer_${airport.toLowerCase()}_${range[0]} \
PARTITION OF offer_${airport.toLowerCase()} \
FOR VALUES FROM (${range[0]}) TO (${range[1]});`
    );
  });
});

const fs = require('fs');
fs.writeFileSync('scripts/partition.sql', statements.join('\n'));
