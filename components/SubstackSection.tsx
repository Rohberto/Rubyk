import { getSubstackPosts } from '@/lib/substack'
import { SUBSTACK_HANDLE } from '@/data/content'
import SubstackClient from './SubstackClient'

export default async function SubstackSection() {
  const posts = await getSubstackPosts(SUBSTACK_HANDLE, 3)
  return <SubstackClient posts={posts} />
}
