import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    sound: true
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Link to="/" className="text-primary hover:text-primary-dark">
            Back to Chat
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 space-y-6">
            {/* Notification Settings */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications when you get new messages
                </p>
              </div>
              <button
                onClick={() => handleToggle('notifications')}
                className={`${
                  settings.notifications ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle dark mode theme
                </p>
              </div>
              <button
                onClick={() => handleToggle('darkMode')}
                className={`${
                  settings.darkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                />
              </button>
            </div>

            {/* Sound Settings */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Message Sounds</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Play sounds for new messages
                </p>
              </div>
              <button
                onClick={() => handleToggle('sound')}
                className={`${
                  settings.sound ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    settings.sound ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}