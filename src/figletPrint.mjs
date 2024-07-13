import figlet from 'figlet';

export function printFigletAsync(text) {
  return new Promise((resolve, reject) => {
    figlet(text, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
