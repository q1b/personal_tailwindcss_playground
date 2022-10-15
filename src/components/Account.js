import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, Fragment } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Avatar from './Avatar'

const Input = ({
  label,
  value,
  onChange = () => {},
  isDisabled = false,
  type = 'text',
}) => (
  <>
    <label
      htmlFor={label}
      className="block text-sm font-semibold leading-6 text-cyan-100 first-letter:uppercase"
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      id={label}
      disabled={isDisabled}
      onChange={onChange}
      class="mt-2 appearance-none text-slate-900 bg-white/95 focus:bg-white rounded-md block w-full px-3 h-10 shadow-sm shadow-cyan-300 sm:text-sm focus:outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200 ring-1 ring-slate-200"
    />
  </>
)

export default function Account({ session }) {
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

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Account
        </button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 backdrop-blur-sm p-6 text-left align-middle shadow-xl shadow-blue-400/30 transition-all">
                  <div className="flex h-8 mb-8 place-content-between">
                    <div className="flex gap-x-2">
                      <Avatar
                        url={avatar_url}
                        size={40}
                        onUpload={(url) => {
                          setAvatarUrl(url)
                          updateProfile({ username, website, avatar_url: url })
                        }}
                      />
                      <Dialog.Title
                        as="h3"
                        className="text-3xl font-medium leading-6 text-white mb-4"
                        style={{
                          textShadow: `2px 0px 8px #0004`,
                        }}
                      >
                        Account
                      </Dialog.Title>
                    </div>
                    <button
                      onClick={closeModal}
                      className="hover:bg-white/20 rounded-full p-1 flex group items-center justify-center transition-colors"
                    >
                      <XMarkIcon className="text-cyan-100 group-hover:text-white w-6 h-6 stroke-2" />
                    </button>
                  </div>
                  <div className="">
                    <div className="mb-5">
                      <Input
                        label="email"
                        value={session.user.email}
                        isDisabled={true}
                      />
                    </div>
                    <div className="mb-5">
                      <Input
                        label="name"
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="mb-7">
                      <Input
                        label="website"
                        value={website || ''}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <button
                        className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900/60 backdrop-blur-sm shadow-sm shadow-slate-800/30 text-white hover:bg-slate-900/80 w-full transition-colors border-white"
                        onClick={() =>
                          updateProfile({ username, website, avatar_url })
                        }
                      >
                        {loading ? 'Loading ...' : 'Update'}
                      </button>
                    </div>
                    <div className="">
                      <button
                        className="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-rose-900/10 text-white/90 hover:bg-rose-700/80 w-full transition-colors border border-white/40"
                        onClick={() => supabase.auth.signOut()}
                        disabled={loading}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
