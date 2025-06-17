class Playlist {
    constructor(songsPlayer, title = null) {
        this._songsPlayer = songsPlayer;
        this._title = title;
    }
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
