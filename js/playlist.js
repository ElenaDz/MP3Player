class Playlist {
    constructor(songsPlayer, title = null) {
        this._songsPlayer = songsPlayer;
        this._title = title;
    }
    //  перепесила, т.к. возвращал пустую строку до этого
    get id() {
        let id = '';
        this.songsPlayer.map((songPlayer) => {
            id = id + songPlayer.songName;
        });
        return id;
    }
    get songsPlayer() {
        return this._songsPlayer;
    }
    get title() {
        return this._title;
    }
}
