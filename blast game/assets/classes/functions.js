//разные полезные функции

//функция перемешивания элементов массива
export function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // пока есть элемент, который можно перемешать
    while (currentIndex != 0) {
  
      // берем его
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // и меняем местами с текущим
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }