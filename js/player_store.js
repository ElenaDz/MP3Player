// fixme избавься от этого класса в нем нет необходимости
class Player_store {
    static getVolume() {
        return JSON.parse(localStorage.getItem(Player_store.keyLocalStore));
    }
    static setVolume(volume) {
        localStorage.setItem(Player_store.keyLocalStore, 
        // fixme не нужно сохранять в Json обычное число, его можно сохранить как текст ( так?)
        volume);
    }
}
Player_store.keyLocalStore = 'volume';
