import phone from 'phone';

export function normalize (number) {
  return phone(number)[0];
}

export function formatCountry (number, code = 'US') {
  return phone(number, code)[0];
}
