import * as React from 'react';
import Link from 'next/link';
import { NextPage } from 'next';

import Layout from '../components/Layout';
import fetcher from '../util/fetcher';
import { Track } from '../interfaces';

type Props = {
  pathname: string;
};

const SearchPage: NextPage<Props> = ({ pathname }) => {
  const [query, setQuery] = React.useState<string>('');
  const [tracks, setTracks] = React.useState<Track[]>([]);

  function handleQueryChange(e: any) {
    setQuery(e.target.value);
  }

  async function search(e: any) {
    e.preventDefault();
    if (query === '') {
      return;
    }

    const data = await fetcher(`http://localhost:6011/search?query=${query}&limit=20&offset=0`);
    const results: Track[] = [];
    if (data !== []) {
      data.forEach((item: any) => {
        const track: Track = { id: '', name: '', artists: [], imgUrl: '' };
        track.id = item.id;
        track.name = item.name;
        // there are three different sizes available in item.album.images
        track.imgUrl = item.album.images[2].url;
        item.artists.forEach((artist: any) => {
          track.artists.push(artist.name);
        });
        results.push(track);
      });
      setTracks(results);
    }
  }

  return (
    <Layout title="Search | Krawumms">
      <h1>Search tracks on Spotify</h1>

      <form onSubmit={search}>
        <input type="text" value={query} onChange={handleQueryChange} />
        <input type="submit" value="Search" />
      </form>

      <ul>
        {tracks.map((track: Track) => (
          <li key={track.id}>
            <p>ID: {track.id}</p>
            <p>Name: {track.name}</p>
            <p>Artist(s): {track.artists.join(', ')}</p>
            <img src={track.imgUrl} alt="album" />
          </li>
        ))}
      </ul>

      <p>You are currently on: {pathname}</p>
      <p>
        <Link href="/">
          <a>Go home</a>
        </Link>
      </p>
    </Layout>
  );
};

SearchPage.getInitialProps = async ({ pathname }) => {
  return { pathname };
};

export default SearchPage;
