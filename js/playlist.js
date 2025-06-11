class Playlist {
    constructor(songsPlayer, title = null, clicks = []) {
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
    get clicks() {
        return this._clicks;
    }
}
