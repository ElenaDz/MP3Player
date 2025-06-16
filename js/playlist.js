class Playlist {
    constructor(songsPlayer, title = null) {
        this._songsPlayer = songsPlayer;
        this._title = title;
    }
    get id() {
        return this.songsPlayer
            .map((songPlayer) => {
            songPlayer.songName;
        })
            .join(' ');
    }
    get songsPlayer() {
        return this._songsPlayer;
    }
    get title() {
        return this._title;
    }
}
