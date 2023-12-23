import { Switch } from '@headlessui/react'
import { useTheme } from '../utils/ThemeContext';

function Slider() {

  const { isDarkMode, toggleTheme } = useTheme();

    return (
        <Switch
        checked={isDarkMode}
        onChange={toggleTheme}
        className={`${
          isDarkMode ? 'bg-slate-600 border-white' : 'bg-black border-white'
        } relative inline-flex h-6 w-12 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${isDarkMode ? 'translate-x-6' : 'translate-x-0'}
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      );
    
}

export default Slider;