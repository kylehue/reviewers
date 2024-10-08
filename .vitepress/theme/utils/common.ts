export function shuffleArray<T>(arr: T[]) {
   for (let i = arr.length - 1; i > 0; i--) {
      let j = ~~(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
   }
   return arr;
}
