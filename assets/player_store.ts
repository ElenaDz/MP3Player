
// fixme избавься от этого класса в нем нет необходимости
class Player_store
{
    static keyLocalStore = 'volume';


    public static getVolume()
    {
        return JSON.parse(localStorage.getItem(Player_store.keyLocalStore));
    }

    public static setVolume(volume: number)
    {
        localStorage.setItem(
            Player_store.keyLocalStore,
            // fixme не нужно сохранять в Json обычное число, его можно сохранить как текст
            JSON.stringify(volume)
        );
    }
}