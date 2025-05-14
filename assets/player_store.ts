
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
            JSON.stringify(volume)
        );
    }
}