import { getAllPosts } from '@/lib/posts'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'

export const metadata = {
  title: 'Blog — Rubyk',
  description: 'Strategy notes, story frameworks, and founder resources from the Rubyk team.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--cream)', minHeight: '100vh', paddingTop: 110 }}>

        {/* Header */}
        <div style={{
          padding: 'clamp(48px, 6vw, 80px) clamp(20px, 7vw, 96px) 0',
          marginBottom: 64,
          borderBottom: '1px solid rgba(61,46,30,0.08)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
            letterSpacing: '2px', color: 'var(--orange)', marginBottom: 14,
          }}>
            <span style={{ display: 'block', width: 24, height: 1.5, background: 'var(--orange)' }} />
            The Rubyk blog
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 600,
            color: 'var(--dark)', letterSpacing: '-2px', lineHeight: 1.06, marginBottom: 16,
          }}>
            Writing worth reading
          </h1>

          <p style={{
            fontSize: 17, fontWeight: 300, color: 'var(--muted-text)',
            lineHeight: 1.78, maxWidth: 480, paddingBottom: 40,
          }}>
            Strategy notes, story frameworks, and honest reflections on building
            businesses in Africa and beyond.
          </p>
        </div>

        {/* Posts */}
        <div style={{ padding: '0 clamp(20px, 7vw, 96px) clamp(80px, 10vw, 120px)' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted-text)' }}>
              <p style={{ fontSize: 17, fontWeight: 300 }}>No posts yet — check back soon.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 28,
            }}>
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}