

const arr = [
    { region: { kode: "0101", navn: "Hovedstaden" }, navn: "København" },
    { region: { kode: "0153", navn: "Sjælland" }, navn: "Brøndby" },
    { region: { kode: "0101", navn: "Hovedstaden" }, navn: "Frederiksberg" }
];

const sortedArr = arr.sort((a, b) => {
    if (a.region.kode !== b.region.kode) {
        // Sorter først efter regionkode
        return a.region.kode > b.region.kode ? 1 : -1;
    } else {
        // Hvis regionkoderne er de samme, sorter efter kommunenavn
        return a.navn > b.navn ? 1 : -1;
    }
});

console.log(sortedArr);
