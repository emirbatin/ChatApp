import React from 'react';
import Users from '../components/Users';

function UserList() {
  const users = [
    { id: 1, name: "John Doe", profilePic: "https://nextui.org/avatars/avatar-1.png" },
    { id: 2, name: "Jane Smith", profilePic: "https://nextui.org/avatars/avatar-2.png" },
    // Diğer kullanıcılar...
  ];

  return (
    <div className='flex flex-col'>
      {users.map(user => (
        <Users key={user.id} user={user} />
      ))}
    </div>
  )
}

export default UserList;