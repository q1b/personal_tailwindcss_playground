import MagicString from "magic-string"
import { useState, useRef, useMemo, Fragment, useEffect } from 'react';
import { Dialog, Transition, Combobox } from '@headlessui/react';
import { MagnifyingGlassIcon as OutlineSearchIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon as SolidSearchIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon as MiniSearchIcon } from '@heroicons/react/20/solid';

const MagnifyingGlassIcon = {
  Solid: SolidSearchIcon,
  Outline: OutlineSearchIcon,
  Mini: MiniSearchIcon,
};

// className helpers for tailwindcss
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const clx = (...values) => {
  return twMerge(clsx(values));
};

/**
 * Array<{
 *      label:string
 *      shortcut_keys:[],
 *      action: () => {}
 * }>
 */

export function CommandPalette({ isOpen, closeModal, updateConfig, addFont }) {
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  function closeGoogleModal() {
    setIsGoogleModalOpen(false);
  }

  function openGoogleModal() {
    setIsGoogleModalOpen(true);
  }
  
  const onSubmit = (cssEmbed, cssRule) => {
    addFont(cssEmbed, cssRule);
    closeGoogleModal();
  };

  const initial = {
    label: 'Home',
    options: [
      {
        label: 'add plugins',
        action: () => {
          setState(plugin);
          setQuery('')
        },
      },
      {
        label: 'add google fonts',
        action: () => {
          closeModal();
          setTimeout(() => {
            openGoogleModal();
          },1000)
        },
      },
      {
        label: 'take screenshot',
        disabled: true,
      },
    ],
  };

  const plugin = {
    parent: initial,
    label: 'Plugins',
    options: [
      {
        label: '@tailwindcss/typography',
        action: () => {
          updateConfig('add plugin', '@tailwindcss/typography');
          closeModal();
          setState(initial);
        },
      },
      {
        label: '@tailwindcss/forms',
        action: () => {
          updateConfig('add plugin', '@tailwindcss/forms');
          closeModal();
          setState(initial);
        },
      },
      {
        label: '@tailwindcss/line-clamp',
        action: () => {
          updateConfig('add plugin', '@tailwindcss/line-clamp');
          closeModal();
          setState(initial);
        },
      },
      {
        label: '@tailwindcss/aspect-ratio',
        action: () => {
          updateConfig('add plugin', '@tailwindcss/aspect-ratio');
          closeModal();
          setState(initial);
        },
      },
    ],
  };

  const [state, setState] = useState(initial);

  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (query === '') return state.options;
    const fil = state.options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
    if (fil.length === 0)
      return [
        {
          label: 'No Results Found',
          disabled: true,
        },
      ];
    return fil;
  }, [query, state]);

  // const highlightedText = useMemo(() => {
  //   const labels = state.options.map((option) => option.label);
  //   const fil = state.options.filter((option) =>
  //     option.label.toLowerCase().includes(query.toLowerCase())
  //   );
  //   if (fil.length === 0)
  //     return [
  //       {
  //         label: 'No Results Found',
  //         disabled: true,
  //       },
  //     ];
  //   return fil;
  // },[query,state])
  return (
    <>
      <Transition
        appear
        show={isOpen}
        as={Fragment}
        afterLeave={() => {
          setQuery('');
          setState(initial);
        }}
      >
        <Dialog
          onKeyDown={(e) => {
            if (query === '') {
              if (e.key === 'Backspace' && state?.parent) {
                e.preventDefault();
                setState(state.parent);
              }
            }
          }}
          as="div"
          className="relative z-30 pt-[25vh]"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in delay-200 duration-600"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Backdrop className="fixed inset-0 z-20 dark:bg-black/25 backdrop-blur-md dark:backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-elastic-2 duration-300"
                enterFrom="opacity-0 scale-110"
                enterTo="opacity-100 scale-100"
                leave="ease-2 delay-200 duration-500"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-90"
              >
                <Dialog.Panel className="w-full border border-slate-600/10 backdrop-blur-sm max-w-lg relative rounded-xl bg-slate-50 dark:bg-slate-600 dark:selection:bg-slate-800 shadow-inner dark:shadow-2xl dark:shadow-slate-800 ring-1 ring-black/5 align-middle">
                  <Combobox
                    onChange={(option) => {
                      if (option?.action) {
                        option.action();
                      }
                    }}
                  >
                    <div className="flex flex-col w-full px-2.5 py-2 gap-y-1 items-start border-b border-slate-400 dark:border-slate-300">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-elastic-2 delay-50 duration-300"
                        enterFrom="opacity-0 scale-110"
                        enterTo="opacity-100 scale-100"
                        leave="ease-2 duration-700"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-90"
                      >
                        <div className="inline-flex gap-x-1">
                          {state?.parent && (
                            <span className="text-[10px] dark:text-slate-200 backdrop-blur-sm bg-slate-400/10 shadow-md dark:bg-white/10 px-1 py-0.5 rounded-md">
                              {state.parent.label}
                            </span>
                          )}
                          <span className="text-[10px] dark:text-slate-200 backdrop-blur-sm bg-slate-400/10 shadow-md dark:bg-white/10 px-1 py-0.5 rounded-md">
                            {state.label}
                          </span>
                        </div>
                      </Transition.Child>
                      <div className="flex w-full gap-x-2 items-center group">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-elastic-2 delay-100 duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-2 duration-700"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <span
                            className="relative group-hover:text-sky-400 group-focus-within:text-sky-400 
                        dark:group-hover:text-white dark:group-focus-within:text-white dark:text-white"
                          >
                            <MagnifyingGlassIcon.Solid className="w-6 h-6 rounded-full group-hover:opacity-0 transition-[transform,opacity] duration-200" />
                            <MagnifyingGlassIcon.Mini className="w-6 h-6 group-focus-within:opacity-100 rounded-full absolute opacity-0 group-hover:opacity-100 -translate-y-full transition-[transform,opacity] duration-200" />
                          </span>
                        </Transition.Child>
                        <Combobox.Input
                          placeholder="search ..."
                          onChange={(event) => {
                            setQuery(event.target.value);
                          }}
                          className="peer w-full h-8 bg-transparent focus:outline-none focus:ring-0 text-slate-900 dark:text-white 
                          placeholder-slate-400
                          hover:placeholder-slate-500
                          dark:placeholder-slate-300
                          dark:hover:placeholder-slate-200"
                        />
                      </div>
                    </div>
                    <Combobox.Options
                      static
                      className="max-h-96 py-4 overflow-hidden text-sm space-y-3"
                    >
                      {filteredOptions.map((option, index) => {
                        return (
                          <Transition.Child
                            as={Fragment}
                            enter={`ease-elastic-2 delay-${index}00 duration-300`}
                            enterFrom="opacity-0 -translate-x-40"
                            enterTo="opacity-100 translate-x-0"
                            leave={`ease-2 delay-${
                              filteredOptions.length - index - 1 - 1
                            }00 duration-700`}
                            leaveFrom="opacity-100 translate-x-0"
                            leaveTo="opacity-0 -translate-x-40"
                          >
                            <Combobox.Option
                              disabled={option.disabled}
                              value={option}
                              key={`${option.label}${index}`}
                            >
                              {({ active, disabled, selected }) => (
                                <div
                                  className={clx(
                                    'cursor-pointer select-none text-left bg-slate-500/60 text-white mx-2 px-4 rounded-lg py-2 shadow-md',
                                    {
                                      'opacity-60 text-slate-900 dark:text-white select-none':
                                        disabled,
                                      'bg-slate-500/70': selected && !active,
                                      'bg-cyan-500': active,
                                    }
                                  )}
                                >
                                  {option.label}
                                  {/* {option.label.split('').map((char, index) => (
                                  <span
                                    className={clx({
                                      'font-bold': query[index] === char,
                                    })}
                                  >
                                    {char}
                                  </span>
                                ))} */}
                                </div>
                              )}
                            </Combobox.Option>
                          </Transition.Child>
                        );
                      })}
                    </Combobox.Options>
                  </Combobox>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <GoogleFontsDialog
        isOpen={isGoogleModalOpen}
        closeModal={closeGoogleModal}
        onSubmit={onSubmit}
      />
    </>
  );
}

function GoogleFontsDialog({ isOpen, closeModal, onSubmit }) {
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

  let inputRef = useRef(null)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog initialFocus={inputRef}  as="div" className="relative z-30 pt-[25vh]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Backdrop className="fixed inset-0 z-20 dark:bg-black/25 backdrop-blur-sm" />
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
              <Dialog.Panel
                as="form"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formdata = Object.fromEntries(
                    new FormData(event.target)
                  );
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
                  const embed = removeStyleTag(formdata['css-embed']);

                  if (onSubmit) onSubmit(embed, rules);
                }}
                className="w-full max-w-xl min-h-96 relative rounded-xl bg-white dark:bg-slate-600 selection:bg-slate-800 shadow-2xl ring-1 ring-black/5 align-middle"
              >
                <div className="flex flex-col items-start p-4 gap-y-3">
                  <h1 className="block text-5xl font-medium text-slate-900">
                    Google fonts
                  </h1>
                  <div className="space-y-2">
                    <label
                      htmlFor="css-embed"
                      className="block text-xl font-medium text-slate-400"
                    >
                      Copy Code to embed into CSS, paste below 👇
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      name="css-embed"
                      id="css-embed"
                      autoComplete="off"
                      placeholder="@import url('https://fonts.googleapis.com/css2?family=..."
                      className="block w-full selection:bg-sky-400 selection:text-white dark:selection:text-slate-900 rounded-md border-b border border-b-slate-600 border-slate-200 dark:border-slate-400 dark:border-b-slate-100 px-1 focus:border-b-sky-500 dark:focus:border-b-sky-300 dark:bg-slate-500 text-slate-800 dark:text-white dark:hover:bg-slate-500/70 dark:focus:bg-slate-500/50 shadow-sm focus:outline-none sm:text-sm transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="css-rule"
                      className="block text-xl font-medium text-slate-400"
                    >
                      Copy CSS RULE to Specify Family
                    </label>
                    <input
                      type="text"
                      name="css-rule"
                      id="css-rule"
                      autoComplete="off"
                      placeholder="font-family: 'font_name', font-type"
                      className="block w-full selection:bg-sky-400 selection:text-white dark:selection:text-slate-900 rounded-md border-b border border-b-slate-600 border-slate-200 dark:border-slate-400 dark:border-b-slate-100 px-1 focus:border-b-sky-500 dark:focus:border-b-sky-300 dark:bg-slate-500 text-slate-800 dark:text-white dark:hover:bg-slate-500/70 dark:focus:bg-slate-500/50 shadow-sm focus:outline-none sm:text-sm transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-x-2 mt-2">
                    <button
                      type="submit"
                      className="relative flex-none rounded-md text-sm font-semibold leading-6 py-0.5 px-2 bg-sky-500 hover:bg-sky-500/80 text-white focus:outline-none 
                                    focus:outline-none 
                                    focus:ring-2
                                    ring-offset-2
                                    focus:ring-sky-500                                 
                                    ring-offset-white dark:ring-offset-sky-900
                                    focus:ring-sky-500 
                                 text-white shadow-sm transition-colors"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="relative flex-none rounded-md text-sm font-semibold leading-6 py-0.5 px-2 bg-slate-500 hover:bg-slate-500/80 text-white focus:outline-none 
                                    focus:outline-none 
                                    focus:ring-2
                                    ring-offset-2
                                    focus:ring-slate-500                                 
                                    ring-offset-white dark:ring-offset-slate-600
                                    focus:ring-slate-500 
                                 text-white shadow-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}