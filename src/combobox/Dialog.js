import { useState, Fragment } from 'react'
import MagicString from 'magic-string';
import { Dialog, Transition, Combobox } from '@headlessui/react'
import { ServerIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

/**
 * Array<{
 *      label:string
 *      shortcut_keys:[],
 *      action: () => {}
 * }>
 */

export function CommandPalette({
  isOpen,
  closeModal,
  updateConfig,
  addFont,
}) {
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false)

  function closeGoogleModal() {
    setIsGoogleModalOpen(false)
  }

  function openGoogleModal() {
    setIsGoogleModalOpen(true)
  }
  const onSubmit = (cssEmbed, cssRule) => {
    addFont(
      cssEmbed,
      cssRule
    );
    closeGoogleModal()
  }

  const initial = {
    label: 'Home',
    options: [
      {
        label: 'add plugins',
        action: () => {
          setState(plugin);
        }
      },
      {
        label: 'add google fonts',
        action: () => {
          openGoogleModal()
          closeModal()
        }
      },
      {
        label: 'take screenshot',
      },
    ],
  }

  const plugin = {
    parent: initial,
    label: 'Plugins',
    options: [
      {
        label: '@tailwindcss/typography',
        action: () => {
          updateConfig('add plugin', '@tailwindcss/typography')
          closeModal();
          setState(initial)
        }
      },
      {
        label: '@tailwindcss/forms',
        action: () => {
          updateConfig('add plugin', '@tailwindcss/forms')
          closeModal();
          setState(initial)
        }
      },
      {
        label: '@tailwindcss/line-clamp',
        action: () => {
          updateConfig('add plugin', '@tailwindcss/line-clamp')
          closeModal();
          setState(initial)
        }
      },
      {
        label: '@tailwindcss/aspect-ratio',
        action: () => {
          updateConfig('add plugin', '@tailwindcss/aspect-ratio')
          closeModal();
          setState(initial)
        }
      },
    ],
  }

  const [state, setState] = useState(initial)

  const [query, setQuery] = useState('')

  const filteredOptions = query ? state.options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  )
    : []

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog 
          onKeyDown={(e) => {
            if (query === '') {
              if (e.key === 'Backspace' && state?.parent) {
                e.preventDefault()
                setState(state.parent)
              }
            }
          }} as="div" className="relative z-30 pt-[25vh]" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Backdrop className="fixed inset-0 z-20 bg-black/25 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-lg relative rounded-xl bg-white dark:bg-slate-600 selection:bg-slate-800 shadow-2xl ring-1 ring-black/5 align-middle">
                  <Combobox onChange={(option) => {
                    setQuery('')
                    if (option?.action) {
                      option.action()
                    }
                  }} >
                    <div className="flex items-center pb-2 pt-7 px-4 gap-x-2 border-b-2">
                      <div className='absolute top-0.5 left-3 space-x-1'>
                        {state?.parent && <span className="text-[10px] bg-white/10 px-1 py-0.5 rounded-md"> {state.parent.label} </span>}
                        <span className="text-[10px] bg-white/10 px-1 py-0.5 rounded-md"> {state.label} </span>
                      </div>
                      <ServerIcon className="w-6 h-6 dark:text-white" />
                      <Combobox.Input
                        placeholder="search ..."
                        onChange={(event) => {
                          setQuery(event.target.value)
                        }}
                        className="w-full h-8 border-0 bg-transparent focus:outline-none focus:ring-0 text-white placeholder-slate-200"
                      />
                    </div>
                    {filteredOptions?.length > 0 && (
                      <Combobox.Options
                        static
                        className="max-h-96 overflow-auto py-4 text-sm"
                      >
                        {filteredOptions.map((option, index) => {
                          return (
                            <Combobox.Option value={option} key={index}>
                              {({ active, disabled, selected }) => (
                                <div
                                  className={clsx(
                                    'text-left text-white px-4 py-2 my-1',
                                    {
                                      'bg-slate-600': disabled,
                                      'bg-slate-500': selected && !active,
                                      'bg-cyan-500': active,
                                    }
                                  )}
                                >
                                  {/* <span
                                  className={clsx({
                                    'text-white': active,
                                    'text-slate-400': disabled,
                                    'text-white': selected,
                                  })}
                                > */}
                                  {option.label.split('').map((char, index) => (
                                    <span
                                      className={clsx({
                                        'font-bold': query[index] === char,
                                      })}
                                    >
                                      {char}
                                    </span>
                                  ))}
                                  {/* </span> */}
                                </div>
                              )}
                            </Combobox.Option>
                          )
                        })}
                      </Combobox.Options>
                    )}
                    {query === '' && (
                      <Combobox.Options
                        static
                        className="max-h-96 overflow-auto py-4 text-sm"
                      >
                        {state.options.map((option, index) => {
                          return (
                            <Combobox.Option value={option} key={index}>
                              {({ active, disabled, selected }) => (
                                <div
                                  className={clsx(
                                    'text-left text-white px-4 py-2 my-1',
                                    {
                                      'bg-slate-600': disabled,
                                      'bg-slate-500': selected && !active,
                                      'bg-cyan-500': active,
                                    }
                                  )}
                                >
                                  {/* <span
                                  className={clsx({
                                    'text-white': active,
                                    'text-slate-400': disabled,
                                    'text-white': selected,
                                  })}
                                > */}
                                  {option.label.split('').map((char, index) => (
                                    <span
                                      className={clsx({
                                        'font-bold': query.includes(char),
                                      })}
                                    >
                                      {char}
                                    </span>
                                  ))}
                                  {/* </span> */}
                                </div>
                              )}
                            </Combobox.Option>
                          )
                        })}
                      </Combobox.Options>
                    )}
                    {query !== '' && filteredOptions.length === 0 && (
                      <p className='px-4 py-2 my-1'>No Results Found</p>
                    )}
                  </Combobox>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <GoogleFontsDialog isOpen={isGoogleModalOpen} closeModal={closeGoogleModal} onSubmit={onSubmit} />
    </>
  )
}

function GoogleFontsDialog({
  isOpen,
  closeModal,
  onSubmit,
}) {

  const removeStyleTag = (str) => {
    str = str.replace('<style>', '');
    str = str.replace('</style>', '');
    str = str.trim();
    return str;
  };

// `'Roboto', sans-serif;`;
// `font-family: 'Roboto', sans-serif;`;

// `
//  font-family: 'Nova Mono', monospace;
//  font-family: 'Roboto', sans-serif;
// `;

// returns [font_family_name,font_family,font_family_cm_name][]

  const getTailwindCSSFontRule = (cssRule) => {
    const s = new MagicString(cssRule);
    const cm = 'font-family:';
    const parseCSSRule0 = (str) => {
      str = str.trim();
      str = str.replace("',", ',');
      str = str.replace("'", '');
      return str.split(', ');
    };
    if (s.slice(0, cm.length) === cm) {
      const fn = (index = 0, output = []) => {
        if (index > cssRule.length) return output;
        if (s.slice(index, index + cm.length) === cm) {
          const starting_point = index + cm.length + 1;
          index = starting_point;
          while (cssRule[index] !== ';' && index < cssRule.length) {
            index++;
          }
          output.push(parseCSSRule0(s.slice(starting_point, index)));
          index++; // skipping ;
        }
        index++; // skipping
        return fn(index, output);
      };
      return fn();
    } else {
      return [parseCSSRule0(cssRule)];
    }
  };


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30 pt-[25vh]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Backdrop className="fixed inset-0 z-20 bg-black/25 backdrop-blur-sm" />
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
              <Dialog.Panel as="form" onSubmit={(event) => {
                event.preventDefault();
                const formdata = Object.fromEntries(new FormData(event.target))
                // [ [ 'family','family' ] ]
                let rules = getTailwindCSSFontRule(formdata['css-rule']);

                rules.forEach((rule) => {
                  rule.unshift(
                    rule[0]
                      .split(' ')
                      .map((v) => v.toLowerCase())
                      .join(' ')
                      .replace(' ', '-')
                  );
                });
                const embed = removeStyleTag(formdata['css-embed'])

                if (onSubmit) onSubmit(embed, rules);
              }} className="w-full max-w-xl relative rounded-xl bg-white dark:bg-slate-600 selection:bg-slate-800 shadow-2xl ring-1 ring-black/5 align-middle">
                <div className="flex flex-col items-start p-4 gap-y-2">
                  <h1 className="block text-5xl font-medium text-slate-900">Google fonts</h1>
                  <div>
                    <label htmlFor="css-embed" className='block text-xl font-medium text-slate-400'>Copy Code to embed into CSS, paste below 👇</label>
                    <input type="text" name="css-embed" id="css-embed" className="mt-1 block w-full rounded-md border-gray-300 px-1 bg-slate-500 hover:bg-blue-500 focus:bg-blue-500 focus:font-medium shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="css-rule" className='block text-xl font-medium text-slate-400'>Copy CSS RULE to Specify Family</label>
                    <input type="text" name="css-rule" id="css-rule" className="mt-1 block w-full rounded-md border-gray-300 px-1 bg-slate-500 hover:bg-blue-500 focus:bg-blue-500 focus:font-medium shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div className="flex items-center gap-x-2 mt-4">
                    <button type="submit" className="relative flex-none rounded-md text-sm font-semibold leading-6 py-0.5 px-2 bg-sky-500 hover:bg-sky-500/80 text-white focus:outline-none 
                                    focus:outline-none 
                                    focus:ring-2
                                    ring-offset-2
                                    focus:ring-sky-500                                 
                                    ring-offset-sky-900
                                    focus:ring-sky-500 
                                 text-white shadow-sm transition-colors" >Submit</button>
                    <button onClick={closeModal} className="relative flex-none rounded-md text-sm font-semibold leading-6 py-0.5 px-2 bg-slate-500 hover:bg-slate-500/80 text-white focus:outline-none 
                                    focus:outline-none 
                                    focus:ring-2
                                    ring-offset-2
                                    focus:ring-slate-500                                 
                                    ring-offset-slate-600
                                    focus:ring-slate-500 
                                 text-white shadow-sm transition-colors" >Cancel</button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
