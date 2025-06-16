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
		return this.songsPlayer
			.map((songPlayer:SongPlayer) =>
			{
				songPlayer.songName
			})
			.join(' ');
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