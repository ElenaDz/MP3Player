class Playlist {
    constructor(songsPlayer, title = null) {
        this.songsPlayer = songsPlayer;
        this._title = title;
    }
    get id() {
        let id = '';
        this.songsPlayer.map((songPlayer) => {
            id = id + songPlayer.songName + '; ';
        });
        return id;
    }
    get songsPlayer() {
        return this._songsPlayer;
    }
    set songsPlayer(songsPlayer) {
        this._songsPlayer = songsPlayer;
    }
    get title() {
        return this._title;
    }
}
