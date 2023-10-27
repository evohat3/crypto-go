import { useState } from 'react'
import { Switch } from '@headlessui/react'

function Slider() {

    const [enabled, setEnabled] = useState(false)

    return (
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${enabled ? 'bg-black' : 'bg-teal-300'}
            relative inline-flex h-6 w-12 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      );
    
}

export default Slider;