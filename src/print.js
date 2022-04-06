export default function printMe() {
  conole.log('I get called from print.js!');
}

export function throwException() {
  throw new Error("whoopsie")
}