const ALPHABET = [...'abcdefghijklmnopqrstuvwxyz']
const INDEX_OF = Object.fromEntries(ALPHABET.map((c, i) => [c, i]))
type Direction = 'forward' | 'backward'

document.addEventListener(
  'DOMContentLoaded',
  pipe(
    () => ({
      input: get<HTMLTextAreaElement>('textarea'),
      left: get<HTMLButtonElement>('left'),
      right: get<HTMLButtonElement>('right'),
    }),
    ({ input, left, right }) => {
      wire('forward')(input)(right)
      wire('backward')(input)(left)
    },
  ),
)

// #region atoms
function nextIndex(dir: Direction) {
  return (i: number): number =>
    dir === 'forward'
      ? (i + 1) % ALPHABET.length
      : (i - 1 + ALPHABET.length) % ALPHABET.length
}

function rotateChar(dir: Direction) {
  return (char: string): string => {
    const lower = char.toLowerCase()
    const idx = INDEX_OF[lower]
    if (idx == null) return char
    const shifted = ALPHABET[nextIndex(dir)(idx)]
    return char === lower ? shifted : shifted.toUpperCase()
  }
}

function cycleText(dir: Direction) {
  return compose(
    (arr: string[]) => arr.join(''),
    (s: string) => Array.from(s).map(rotateChar(dir)),
  )
}

function wire(dir: Direction) {
  return (input: HTMLTextAreaElement) =>
    (btn: HTMLButtonElement): void =>
      btn.addEventListener(
        'click',
        tap(() => {
          input.value = cycleText(dir)(input.value)
        }),
      )
}
// #endregion

// #region utils
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B) {
  return (a: A): C => f(g(a))
}

function pipe<A, B, C>(f: (a: A) => B, g: (b: B) => C) {
  return (a: A): C => g(f(a))
}

function tap<T>(fn: (x: T) => void) {
  return (x: T): T => (fn(x), x)
}
function get<E extends HTMLElement = HTMLElement>(id: string) {
  const el = document.getElementById(id)
  if (!el) throw new Error(`Missing element #${id}`)
  return el as E
}
// #endregion
