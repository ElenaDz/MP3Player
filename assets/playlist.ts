class Playlist
{
	private _songsPlayer:SongPlayer[];
	private _title: string;

	constructor(songsPlayer: SongPlayer[], title: string = null)
	{
		this._songsPlayer = songsPlayer;
		this._title = title;
	}

	public get id(): string
	{
		let id = '';

		this.songsPlayer.map((songPlayer:SongPlayer) => {
			id = id + songPlayer.songName
		});

		return id;
	}

	public get songsPlayer(): SongPlayer[]
	{
		return this._songsPlayer;
	}

	public get title(): string
	{
		return this._title
	}
}