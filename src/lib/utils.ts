export function randomNumber(max: number, min: number, decimalDigits?: number) {
  const factor = decimalDigits ? 10 ** decimalDigits : 1;
  return (
    (Math.floor(Math.random() * (max * factor - min * factor + factor)) +
      min * factor) /
    factor
  );
}
