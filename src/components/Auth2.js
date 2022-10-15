import { useState, useEffect, Fragment } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default Auth2 = () => {
  let [isOpen, setIsOpen] = useState(true)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    if (!session?.user) {
      throw new Error('User not logged in')
    }

    return session.user
  }

  async function getProfile() {
    try {
      setLoading(true)
      const user = await getCurrentUser()

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({ username, website, avatar_url }) {
    try {
      setLoading(true)
      const user = await getCurrentUser()

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
}
