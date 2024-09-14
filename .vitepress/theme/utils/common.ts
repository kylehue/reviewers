export function shuffleArray(arr: any[]) {
   for (let i = arr.length - 1; i >= 0; i--) {
      let j = ~~(Math.random() * arr.length);
      [arr[i], arr[j]] = [arr[j], arr[i]];
   }
   return arr;
}
