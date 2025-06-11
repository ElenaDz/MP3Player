
interface ClicksPlaylist
{
	song_id: number;
	count: number;
}

class Playlist
{
	private _songsPlayer:SongPlayer[];
	private _title: string;
	private _clicks: ClicksPlaylist[];

	constructor(songsPlayer: SongPlayer[], title: string = null, clicks: ClicksPlaylist[] = [])
	{
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


	public get clicks(): ClicksPlaylist[]
	{
		return this._clicks;
	}
}