
import Link from 'next/link'
import { getAllPosts, formatPostDate } from '@/lib/posts'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Blog — Rubyk',
  description: 'Strategy notes, story frameworks, and founder resources from the Rubyk team.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Navbar />
      <main
        style={{
          background: 'var(--cream)',
          minHeight:  '100vh',
          paddingTop: 110,
        }}
      >
        {/* Hero header */}
        <div
          style={{
            padding:      'clamp(48px, 6vw, 80px) clamp(24px, 7vw, 96px) 0',
            marginBottom: 64,
            borderBottom: '1px solid rgba(61,46,30,0.08)',
          }}
        >
          <div
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          10,
              fontSize:     11,
              fontWeight:   500,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color:        'var(--orange)',
              marginBottom: 14,
            }}
          >
            <span style={{ display: 'block', width: 24, height: 1.5, background: 'var(--orange)' }} />
            The Rubyk blog
          </div>

          <h1
            style={{
              fontFamily:    'var(--font-cormorant), Georgia, serif',
              fontSize:      'clamp(40px, 5vw, 68px)',
              fontWeight:    600,
              color:         'var(--dark)',
              letterSpacing: '-2px',
              lineHeight:    1.06,
              marginBottom:  16,
            }}
          >
            Writing worth reading
          </h1>

          <p
            style={{
              fontSize:     17,
              fontWeight:   300,
              color:        'var(--muted-text)',
              lineHeight:   1.78,
              maxWidth:     480,
              paddingBottom: 40,
            }}
          >
            Strategy notes, story frameworks, and honest reflections on building businesses
            in Africa and beyond.
          </p>
        </div>

        {/* Posts grid */}
        <div
          style={{
            padding: '0 clamp(24px, 7vw, 96px) clamp(80px, 10vw, 120px)',
          }}
        >
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted-text)' }}>
              <p style={{ fontSize: 17, fontWeight: 300 }}>No posts yet — check back soon.</p>
            </div>
          ) : (
            <div
              style={{
                display:             'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap:                 28,
              }}
            >
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <article
                    style={{
                      background:   '#fff',
                      border:       '1px solid rgba(61,46,30,0.09)',
                      borderRadius: 16,
                      padding:      32,
                      height:       '100%',
                      display:      'flex',
                      flexDirection: 'column',
                      transition:   'transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s',
                      cursor:       'pointer',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.transform   = 'translateY(-4px)'
                      el.style.boxShadow   = '0 20px 48px rgba(61,46,30,0.09)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.transform = 'none'
                      el.style.boxShadow = 'none'
                    }}
                  >
                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize:      11,
                              fontWeight:    500,
                              textTransform: 'uppercase',
                              letterSpacing: '1.2px',
                              color:         'var(--orange)',
                              background:    'var(--orange-pale)',
                              padding:       '3px 9px',
                              borderRadius:  20,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2
                      style={{
                        fontFamily:   'var(--font-cormorant), Georgia, serif',
                        fontSize:     24,
                        fontWeight:   600,
                        color:        'var(--dark)',
                        lineHeight:   1.28,
                        marginBottom: 10,
                        letterSpacing: '-0.3px',
                        flexGrow:     1,
                      }}
                    >
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p
                        style={{
                          fontSize:     14,
                          fontWeight:   300,
                          color:        'var(--muted-text)',
                          lineHeight:   1.7,
                          marginBottom: 20,
                        }}
                      >
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div
                      style={{
                        display:    'flex',
                        alignItems: 'center',
                        gap:        12,
                        fontSize:   12,
                        color:      'var(--muted-text)',
                        marginTop:  'auto',
                        paddingTop: 16,
                        borderTop:  '1px solid rgba(61,46,30,0.07)',
                      }}
                    >
                      <span>{formatPostDate(post.date)}</span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted-text)' }} />
                      <span>{post.readTime}</span>
                      <span style={{ marginLeft: 'auto', color: 'var(--orange)' }}>Read →</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
