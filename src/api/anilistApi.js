const API_URL = 'https://graphql.anilist.co';

// In-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi',
  'Slice of Life', 'Sports', 'Supernatural',
];

export const GENRE_COLORS = {
  Action: '#ef4444',
  Adventure: '#f97316',
  Comedy: '#facc15',
  Drama: '#a855f7',
  Fantasy: '#6dffcf',
  Horror: '#dc2626',
  Mystery: '#41d7ff',
  Psychological: '#c084fc',
  Romance: '#fb7185',
  'Sci-Fi': '#38bdf8',
  'Slice of Life': '#34d399',
  Sports: '#fb923c',
  Supernatural: '#ff4fd8',
};

function getCacheKey(query, variables) {
  return JSON.stringify({ query, variables });
}

async function fetchFromAniList(query, variables, signal) {
  const key = getCacheKey(query, variables);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    signal,
  });

  if (!response.ok) {
    const retryAfter = response.headers.get('Retry-After');
    if (response.status === 429 && retryAfter) {
      await new Promise((r) => setTimeout(r, Number(retryAfter) * 1000));
      return fetchFromAniList(query, variables, signal);
    }
    throw new Error(`AniList API error: ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'AniList query failed');
  }

  cache.set(key, { data: json.data, timestamp: Date.now() });
  return json.data;
}

const MEDIA_CARD_FRAGMENT = `
  id
  title { romaji english }
  coverImage { extraLarge large color }
  bannerImage
  averageScore
  popularity
  genres
  season
  seasonYear
  episodes
  status
`;

const DETAILS_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english }
      coverImage { extraLarge large color }
      bannerImage
      averageScore
      popularity
      genres
      season
      seasonYear
      episodes
      status
      description(asHtml: false)
      characters(sort: FAVOURITES_DESC, page: 1, perPage: 12) {
        edges {
          node { id name { full } image { large } }
          role
        }
      }
      recommendations(sort: RATING_DESC, page: 1, perPage: 8) {
        edges {
          node {
            mediaRecommendation {
              ${MEDIA_CARD_FRAGMENT}
            }
          }
        }
      }
      relations {
        edges {
          node { ${MEDIA_CARD_FRAGMENT} type }
          relationType
        }
      }
      studios { edges { node { id name } isMain } }
      rankings { rank type context allTime }
      trailer { id site }
    }
  }
`;

const TRENDING_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage currentPage lastPage total }
      media(type: ANIME, sort: TRENDING_DESC) {
        ${MEDIA_CARD_FRAGMENT}
        description(asHtml: false)
      }
    }
  }
`;

const SEARCH_QUERY = `
  query ($search: String, $genre: String, $sort: [MediaSort], $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage currentPage lastPage total }
      media(type: ANIME, search: $search, genre: $genre, sort: $sort, isAdult: false) {
        ${MEDIA_CARD_FRAGMENT}
        description(asHtml: false)
      }
    }
  }
`;

const BROWSE_QUERY = `
  query ($genre: String, $sort: [MediaSort], $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage currentPage lastPage total }
      media(type: ANIME, genre: $genre, sort: $sort, isAdult: false) {
        ${MEDIA_CARD_FRAGMENT}
        description(asHtml: false)
      }
    }
  }
`;

const CHARACTER_SEARCH_QUERY = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage currentPage lastPage total }
      characters(search: $search, sort: FAVOURITES_DESC) {
        id
        name { full }
        image { large }
        favourites
        media(type: ANIME, sort: POPULARITY_DESC, perPage: 3) {
          edges { node { id title { romaji english } } }
        }
        description(asHtml: false)
      }
    }
  }
`;

const TOP_CHARACTERS_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage currentPage lastPage total }
      characters(sort: FAVOURITES_DESC) {
        id
        name { full }
        image { large }
        favourites
        media(type: ANIME, sort: POPULARITY_DESC, perPage: 3) {
          edges { node { id title { romaji english } } }
        }
        description(asHtml: false)
      }
    }
  }
`;

export async function fetchTrending(page = 1, perPage = 50, signal) {
  const data = await fetchFromAniList(TRENDING_QUERY, { page, perPage }, signal);
  return data.Page;
}

export async function searchAnime(search, genre, sort = ['TRENDING_DESC'], page = 1, perPage = 20, signal) {
  if (search) {
    const vars = { search, page, perPage, sort };
    if (genre && genre !== 'All') vars.genre = genre;
    const data = await fetchFromAniList(SEARCH_QUERY, vars, signal);
    return data.Page;
  }
  const vars = { page, perPage, sort };
  if (genre && genre !== 'All') vars.genre = genre;
  const data = await fetchFromAniList(BROWSE_QUERY, vars, signal);
  return data.Page;
}

export async function fetchAnimeDetails(id, signal) {
  const data = await fetchFromAniList(DETAILS_QUERY, { id: Number(id) }, signal);
  return data.Media;
}

export async function searchCharacters(search, page = 1, perPage = 24, signal) {
  if (search) {
    const data = await fetchFromAniList(CHARACTER_SEARCH_QUERY, { search, page, perPage }, signal);
    return data.Page;
  }
  const data = await fetchFromAniList(TOP_CHARACTERS_QUERY, { page, perPage }, signal);
  return data.Page;
}

export function getTitle(anime) {
  if (!anime) return '';
  return anime.title?.english || anime.title?.romaji || '';
}

export function getScore(anime) {
  if (!anime?.averageScore) return null;
  return (anime.averageScore / 10).toFixed(1);
}

export function getAnimeColor(anime) {
  if (anime?.coverImage?.color) return anime.coverImage.color;
  if (anime?.genres?.length) return GENRE_COLORS[anime.genres[0]] || '#41d7ff';
  return '#41d7ff';
}

export function clearCache() {
  cache.clear();
}
