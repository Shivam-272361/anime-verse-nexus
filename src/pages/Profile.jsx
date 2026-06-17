import { motion } from 'framer-motion';
import { FiAward, FiBookmark, FiClock, FiHeart, FiStar } from 'react-icons/fi';
import { Bar, BarChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AnimeCard from '../components/AnimeCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import PageTransition from '../components/PageTransition.jsx';
import { useTrending } from '../hooks/useAniList.js';

const taste = [
  { subject: 'Action', value: 88 },
  { subject: 'Drama', value: 94 },
  { subject: 'Sci-Fi', value: 97 },
  { subject: 'Romance', value: 70 },
  { subject: 'Fantasy', value: 82 },
  { subject: 'Mystery', value: 76 },
];

const watchHistory = [
  { day: 'Mon', hours: 2.4 },
  { day: 'Tue', hours: 1.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 2.9 },
  { day: 'Fri', hours: 4.4 },
  { day: 'Sat', hours: 5.1 },
  { day: 'Sun', hours: 3.7 },
];

const achievements = ['First Galaxy Jump', 'Midnight Binge', 'Genre Alchemist', 'Trailer Hunter', 'Top 1% Explorer'];

export default function Profile() {
  const { data: topAnime, loading } = useTrending(20);
  const favorites = topAnime.slice(0, 6);
  const banner = topAnime[0]?.bannerImage || topAnime[0]?.coverImage?.extraLarge;

  return (
    <PageTransition className="py-8">
      <section className="glass-strong mb-6 overflow-hidden rounded-3xl">
        {banner ? (
          <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }} />
        ) : (
          <div className="h-48 skeleton-shimmer" />
        )}
        <div className="-mt-16 flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-5">
            <div className="grid h-32 w-32 place-items-center rounded-3xl border border-white/20 bg-gradient-to-br from-neon-blue to-neon-pink text-4xl font-black shadow-glow">AV</div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neon-blue">User Profile</p>
              <h1 className="font-display text-4xl font-bold">Nexus Pilot</h1>
              <p className="mt-1 text-white/55">Cosmic curator with a taste for emotional sci-fi and neon action.</p>
            </div>
          </div>
          <button className="rounded-2xl bg-white px-5 py-3 font-bold text-abyss transition hover:scale-[1.03]">Edit profile</button>
        </div>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          ['Favorites', '128', FiHeart],
          ['Watchlist', '42', FiBookmark],
          ['Hours', '1.8K', FiClock],
          ['Rank', 'Top 1%', FiStar],
        ].map(([label, value, Icon], index) => (
          <motion.div key={label} className="glass rounded-3xl p-5" whileHover={{ y: -6 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Icon className="text-2xl text-neon-blue" />
            <p className="mt-4 font-display text-3xl font-bold">{value}</p>
            <p className="text-sm text-white/50">{label}</p>
          </motion.div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="glass rounded-3xl p-5">
          <h2 className="mb-4 font-display text-2xl font-bold">Anime Taste Radar</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={taste}>
                <PolarGrid stroke="rgba(255,255,255,0.14)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.68)', fontSize: 12 }} />
                <Radar dataKey="value" stroke="#41d7ff" fill="#41d7ff" fillOpacity={0.35} />
                <Tooltip contentStyle={{ background: '#050816', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h2 className="mb-4 font-display text-2xl font-bold">Watch History</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={watchHistory}>
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.6)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.6)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#050816', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16 }} />
                <Bar dataKey="hours" radius={[12, 12, 0, 0]} fill="url(#watchGradient)" />
                <defs>
                  <linearGradient id="watchGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop stopColor="#ff4fd8" />
                    <stop offset="1" stopColor="#41d7ff" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="glass rounded-3xl p-5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-2xl font-bold">
            <FiAward className="text-neon-pink" /> Achievements
          </h2>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 font-semibold text-white/75">
                {achievement}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 font-display text-2xl font-bold">Favorite Collection</h2>
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} compact />)}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {favorites.slice(0, 3).map((anime, index) => (
                <AnimeCard anime={anime} index={index} key={anime.id} compact />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
