export function compareNumbers(firstNr: number, secondNr: number): number {
  if (firstNr === secondNr) {
    return 100;
  }

  if ((firstNr === 0 || secondNr === 0) && (secondNr !== 0 || firstNr !== 0)) {
    return 0;
  }
  const largestNumber = Math.max(firstNr, secondNr);
  const smallestNumber = Math.min(firstNr, secondNr);

  const percentageDiff =
    Math.abs((largestNumber - smallestNumber) / largestNumber) * 100;

  return Number(Math.abs(100 - percentageDiff).toFixed(2));
}
