import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
import type { BlogPost } from '@/lib/supabase'
import type { Post } from '@/lib/post-types'

export const revalidate = 60

export const metadata = {
  title:       'Blog — Rubyk',
  description: 'Strategy notes, story frameworks, and founder resources from the Rubyk team.',
}

function toPost(p: BlogPost): Post {
  return {
    slug:     p.slug,
    title:    p.title,
    date:     p.created_at,
    excerpt:  p.excerpt,
    author:   p.author,
    tags:     p.tags ?? [],
    readTime: p.read_time,
    coverImage: p.cover_image || undefined,
  }
}

export default async function BlogPage() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const posts: Post[] = (data ?? []).map(toPost)


  return (
    <>
      <Navbar />
      <main style={{
        background:  'var(--cream)',
        minHeight:   '100vh',
        paddingTop:  110,
        maxWidth:    1280,
        margin:      '0 auto',
        width:       '100%',
      }}>

        {/* Header */}
        <div style={{
          padding:      'clamp(48px, 6vw, 80px) clamp(20px, 7vw, 96px) 0',
          marginBottom: 64,
          borderBottom: '1px solid rgba(61,46,30,0.08)',
          textAlign:   'center',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 11, fontWeight: 500, textTransform: 'uppercase',
            letterSpacing: '2px', color: 'var(--orange)', marginBottom: 14, textAlign: 'center'
          }}>
            Rubyk Case Studies
          </div>

          <h1 style={{
            fontFamily:    'var(--font-cormorant), Georgia, serif',
            fontSize:      'clamp(40px, 5vw, 68px)', fontWeight: 600,
            color:         'var(--dark)', letterSpacing: '-2px', lineHeight: 1.06, marginBottom: 16,
          }}>
            Writing worth reading
          </h1>

          <p style={{
            fontSize: 17, fontWeight: 300, color: 'var(--muted-text)',
            lineHeight: 1.78, maxWidth: 480, paddingBottom: 40, textAlign: 'center', margin: '0 auto',  
          }}>
           Stories we've told, Every founder's story is different. Here's how we've helped a few of them shine through…
          </p>
        </div>

        {/* Posts */}
        <div style={{ padding: '0 clamp(20px, 7vw, 96px) clamp(80px, 10vw, 120px)' }}>
          {error ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted-text)' }}>
              <p style={{ fontSize: 17, fontWeight: 300 }}>
                Could not load posts. Please check your Supabase connection.
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted-text)' }}>
              <p style={{ fontSize: 17, fontWeight: 300 }}>No posts yet — check back soon.</p>
            </div>
          ) : (
            <div style={{
  display:             'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap:                 28,
  maxWidth:            960,   // ← optional: tighten the grid width
  margin:              '0 auto', // ← centers the grid block itself
}}>
              {posts.map(post => (
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