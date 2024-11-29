import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useChat } from '../contexts/ChatContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';


export default function DirectMessageModal({ isOpen, onClose, users }) {
  const [search, setSearch] = useState('');
  const { dispatch } = useChat();
  // const {users} = useAuth()
  const [user, setUsers] = useState([{}]);


  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       const response = await axios.get('http://localhost:3000/api/users', {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       });
  //       // setUsers(response.data);
  //       console.log('Fetched users:', response.data);
  //       setUsers(response.data.users.filter((user, index, self) =>
  //         index === self.findIndex((u) => u._id === user._id)
  //       ));
        
  //     } catch (error) {
  //       console.error('Error fetching users:', error);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  // const mockUsers = [
  //   { id: 1, name: 'John Doe', status: 'online' },
  //   { id: 2, name: 'Jane Smith', status: 'offline' },
  //   { id: 3, name: 'Alice Johnson', status: 'online' },
  //   { id: 4, name: 'Bob Wilson', status: 'offline' },
  // ];

  // const filteredUsers = mockUsers?.filter(user =>
  //   user.name.toLowerCase().includes(search.toLowerCase())
  // );
  console.log("usehgdhkgcfr",users)
  

  // useEffect(() => {
  //   console.log('Updated user state:', {users});
  // }, [users]);

  const startChat = user => {
    const newChat = {
      _id: `${user._id}`,
      name: user.username,
      status:user.isOnline,
      type: 'direct',
    };

    dispatch({
      type: 'CREATE_DIRECT_CHAT',
      payload: newChat,
    });

    dispatch({
      type: 'SET_ACTIVE_CHAT',
      payload: newChat,
    });

    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 mb-4">
                  New Message
                </Dialog.Title>

                <div className="relative mb-4">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {users.map(user => (
                    <button
                      key={user._id}
                      onClick={() => startChat(user)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                        {user.username?user.username?.charAt(0):"null"}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
