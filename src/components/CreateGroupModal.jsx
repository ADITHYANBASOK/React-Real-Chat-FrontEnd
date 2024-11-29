// import { Fragment, useEffect, useState } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { useChat } from '../contexts/ChatContext';
// import axios from 'axios';

// export default function CreateGroupModal({ isOpen, onClose }) {
//   const [groupName, setGroupName] = useState('');
//   const [users, setUsers] = useState([]);

//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const { dispatch } = useChat();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem('token');  // Get token from storage
//         console.log(token)
//         const response = await axios.get('http://localhost:3000/api/users/users', {
//           headers: {
//             Authorization: `Bearer ${token}` // Attach token to request headers
//           }
//         });
//         setUsers(response.data); // Assuming the API returns an array of user objects
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };
  
//     fetchUsers();
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (groupName.trim() && selectedUsers.length > 0) {
//       dispatch({
//         type: 'CREATE_GROUP',
//         payload: {
//           name: groupName,
//           members: selectedUsers,
//           id: Date.now(),
//           type: 'group'
//         }
//       });
//       onClose();
//       setGroupName('');
//       setSelectedUsers([]);
//     }
//   };

//   const toggleUser = (user) => {
//     setSelectedUsers(prev =>
//       prev.find(u => u.id === user.id)
//         ? prev.filter(u => u.id !== user.id)
//         : [...prev, user]
//     );
//   };

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-25" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
//                 <Dialog.Title
//                   as="h3"
//                   className="text-lg font-medium leading-6"
//                 >
//                   Create New Group
//                 </Dialog.Title>
//                 <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium">
//                       Group Name
//                     </label>
//                     <input
//                       type="text"
//                       value={groupName}
//                       onChange={(e) => setGroupName(e.target.value)}
//                       className="input-field mt-1"
//                       placeholder="Enter group name"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">
//                       Select Members
//                     </label>
//                     <div className="space-y-2 max-h-48 overflow-y-auto">
//                       {users.map(user => (
//                         <label
//                           key={user.id}
//                           className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
//                         >
//                           <input
//                             type="checkbox"
//                             checked={selectedUsers.some(u => u.id === user.id)}
//                             onChange={() => toggleUser(user)}
//                             className="rounded text-primary focus:ring-primary"
//                           />
//                           <span>{user.name}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex justify-end space-x-3">
//                     <button
//                       type="button"
//                       onClick={onClose}
//                       className="px-4 py-2 rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="btn-primary"
//                       disabled={!groupName.trim() || selectedUsers.length === 0}
//                     >
//                       Create Group
//                     </button>
//                   </div>
//                 </form>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useChat } from '../contexts/ChatContext';
import axios from 'axios';

export default function CreateGroupModal({ isOpen, onClose }) {
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([{}]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { dispatch } = useChat();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // setUsers(response.data);
        console.log('Fetched users:', response.data);
        setUsers(response.data.users.filter((user, index, self) =>
          index === self.findIndex((u) => u._id === user._id)
        ));
        
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (groupName.trim() && selectedUsers.length > 0) {
      try {
        const token = localStorage.getItem('token');
        // const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
  
        // Prepare the group data
        const groupData = {
          name: groupName,
          members: selectedUsers.map(user => user._id),
          token: token
        };
  
        // Call the backend API to create the group
        const response = await axios.post(
          'http://localhost:3000/api/groups',
          groupData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
  
        // Handle response and dispatch to context
        dispatch({
          type: 'CREATE_GROUP',
          payload: response.data.group
        });
  
        // Close modal and reset form
        onClose();
        setGroupName('');
        setSelectedUsers([]);
      } catch (error) {
        console.error('Error creating group:', error);
      }
    }
  };
  

  const toggleUser = (user) => {
    setSelectedUsers(prevSelectedUsers =>
      prevSelectedUsers.some(selectedUser => selectedUser._id === user._id)
        ? prevSelectedUsers.filter(selectedUser => selectedUser._id !== user._id)
        : [...prevSelectedUsers, user]
    );
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Create New Group
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="input-field mt-1"
                      placeholder="Enter group name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Members
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {users.map(user => (
                        <label
                          key={user.id}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.some(selectedUser => selectedUser._id === user._id)}
                            onChange={() => toggleUser(user)}
                            className="rounded text-primary focus:ring-primary"
                          />
                          <span>{user.username}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={!groupName.trim() || selectedUsers.length === 0}
                    >
                      Create Group
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
