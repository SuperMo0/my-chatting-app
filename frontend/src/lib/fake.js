// constants.js

// --- 1. THEME CONSTANTS ---
export const COLORS = {
    primaryGradient: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
    primaryShadow: '0 10px 20px rgba(0, 97, 255, 0.3)',
};

// --- 2. CURRENT USER PROFILE ---
export const CURRENT_USER = {
    id: 'me',
    name: 'Alex Design',
    email: 'alex@design.com',
    avatar: 'https://i.pravatar.cc/150?u=alex_design_2024',
    bio: 'UI/UX Designer | React Developer',
};

// --- 3. FRIENDS LIST (Sidebar Data) ---



export const message = {
    id: crypto.randomUUID,
    senderId: 'me',
    text: 'It is going great!',
    timestamp: '10:02 AM',
    status: 'read',
}
export const FRIENDS = [
    {
        id: 1,
        name: 'Sarah Lee',
        avatar: 'https://i.pravatar.cc/150?u=sarah_lee',
        lastMessage: 'Can you send me the Figma file?',
        time: '2 mins ago',
        unreadCount: 2,
        isOnline: true,
    },
    {
        id: 2,
        name: 'Jason McAllister',
        avatar: 'https://i.pravatar.cc/150?u=jason_mc',
        lastMessage: 'Bro, that blue gradient is fire! 🔥',
        time: '10:42 AM',
        unreadCount: 0,
        isOnline: true,
    },
    {
        id: 3,
        name: 'Emily Chen',
        avatar: 'https://i.pravatar.cc/150?u=emily_chen',
        lastMessage: 'See you at the meeting tomorrow.',
        time: 'Yesterday',
        unreadCount: 0,
        isOnline: false,
    },
    {
        id: 4,
        name: 'David Smalls',
        avatar: 'https://i.pravatar.cc/150?u=david_s',
        lastMessage: 'Thanks for the help!',
        time: 'Mon',
        unreadCount: 0,
        isOnline: false,
    },
    {
        id: 5,
        name: 'Design Team',
        avatar: 'https://ui-avatars.com/api/?name=Design+Team&background=0D8ABC&color=fff',
        lastMessage: 'Alice: I pushed the new changes.',
        time: 'Mon',
        unreadCount: 5,
        isOnline: true,
        isGroup: true,
    },
    // --- NEWLY ADDED FRIENDS ---
    {
        id: 6,
        name: 'Michael Brown',
        avatar: 'https://i.pravatar.cc/150?u=michael_b',
        lastMessage: 'API documentation is updated.',
        time: '11:15 AM',
        unreadCount: 1,
        isOnline: true,
    },
    {
        id: 7,
        name: 'Lisa Wong',
        avatar: 'https://i.pravatar.cc/150?u=lisa_w',
        lastMessage: 'Can we reschedule?',
        time: 'Sunday',
        unreadCount: 0,
        isOnline: false,
    },
    {
        id: 8,
        name: 'Weekend Trip 🏕️',
        avatar: 'https://ui-avatars.com/api/?name=Weekend+Trip&background=FF5722&color=fff',
        lastMessage: 'Mark: Who is bringing the tent?',
        time: '3 days ago',
        unreadCount: 12,
        isOnline: false,
        isGroup: true,
    },
    {
        id: 9,
        name: 'Robert Fox',
        avatar: 'https://i.pravatar.cc/150?u=robert_f',
        lastMessage: 'Sent an image.',
        time: 'Last Week',
        unreadCount: 0,
        isOnline: true,
    },
    {
        id: 10,
        name: 'Support Bot',
        avatar: 'https://ui-avatars.com/api/?name=Support+Bot&background=333&color=fff',
        lastMessage: 'Ticket #402 has been resolved.',
        time: 'Last Month',
        unreadCount: 0,
        isOnline: true,
    }
];
export const onlineUsers = FRIENDS.filter(friend => friend.isOnline);
// --- 4. CHAT HISTORY (Messages) ---
export const MESSAGES = {
    1: [ // Chat with Sarah Lee
        {
            id: 1,
            senderId: 1,
            text: 'Hey Alex! How is the new app design coming along?',
            timestamp: '10:00 AM',
            status: 'read',
        },
        {
            id: 2,
            senderId: 'me',
            text: 'It is going great! I just finished the dark mode.',
            timestamp: '10:02 AM',
            status: 'read',
        },
        {
            id: 3,
            senderId: 1,
            text: 'Awesome! I can\'t wait to see it.',
            timestamp: '10:03 AM',
            status: 'read',
        },
        {
            id: 4,
            senderId: 1,
            text: 'Can you send me the Figma file?',
            timestamp: '10:05 AM',
            status: 'delivered',
        },
    ],
    2: [ // Chat with Jason McAllister
        {
            id: 1,
            senderId: 'me',
            text: 'Check out this button style I made.',
            timestamp: '10:30 AM',
            status: 'read',
        },
        {
            id: 2,
            senderId: 2,
            text: 'Bro, that blue gradient is fire! 🔥',
            timestamp: '10:42 AM',
            status: 'read',
        }
    ],
    3: [ // Chat with Emily Chen
        {
            id: 1,
            senderId: 3,
            text: 'Hey Alex, do you have the minutes from the last standup?',
            timestamp: 'Yesterday 4:00 PM',
            status: 'read',
        },
        {
            id: 2,
            senderId: 'me',
            text: 'Yep, sending them over now.',
            timestamp: 'Yesterday 4:05 PM',
            status: 'read',
        },
        {
            id: 3,
            senderId: 3,
            text: 'Thanks! Also, are we still on for the sync?',
            timestamp: 'Yesterday 4:10 PM',
            status: 'read',
        },
        {
            id: 4,
            senderId: 3,
            text: 'See you at the meeting tomorrow.',
            timestamp: 'Yesterday 4:11 PM',
            status: 'read',
        }
    ],
    4: [ // Chat with David Smalls
        {
            id: 1,
            senderId: 4,
            text: 'I\'m stuck on this CSS grid issue.',
            timestamp: 'Mon 2:00 PM',
            status: 'read',
        },
        {
            id: 2,
            senderId: 'me',
            text: 'Try using grid-template-areas, makes it way easier.',
            timestamp: 'Mon 2:15 PM',
            status: 'read',
        },
        {
            id: 3,
            senderId: 4,
            text: 'Oh wow, that worked perfectly.',
            timestamp: 'Mon 2:30 PM',
            status: 'read',
        },
        {
            id: 4,
            senderId: 4,
            text: 'Thanks for the help!',
            timestamp: 'Mon 2:31 PM',
            status: 'read',
        }
    ],
    5: [ // Design Team Group Chat
        {
            id: 1,
            senderId: 'me',
            text: 'Guys, the client loves the new logo concepts!',
            timestamp: 'Mon 9:00 AM',
            status: 'read',
        },
        {
            id: 2,
            senderId: 5, // Represents group member
            text: 'Alice: That is amazing news! 🎉',
            timestamp: 'Mon 9:05 AM',
            status: 'read',
        },
        {
            id: 3,
            senderId: 5,
            text: 'Bob: Great work everyone.',
            timestamp: 'Mon 9:10 AM',
            status: 'read',
        },
        {
            id: 4,
            senderId: 5,
            text: 'Alice: I pushed the new changes.',
            timestamp: 'Mon 11:30 AM',
            status: 'delivered',
        }
    ],
    6: [ // Chat with Michael Brown (Backend)
        {
            id: 1,
            senderId: 'me',
            text: 'Michael, the fetch request is returning 404.',
            timestamp: '11:00 AM',
            status: 'read',
        },
        {
            id: 2,
            senderId: 6,
            text: 'Let me check the server logs.',
            timestamp: '11:05 AM',
            status: 'read',
        },
        {
            id: 3,
            senderId: 6,
            text: 'Found the issue. I forgot to deploy the new route.',
            timestamp: '11:10 AM',
            status: 'read',
        },
        {
            id: 4,
            senderId: 6,
            text: 'API documentation is updated.',
            timestamp: '11:15 AM',
            status: 'delivered',
        }
    ],
    7: [ // Chat with Lisa Wong
        {
            id: 1,
            senderId: 7,
            text: 'Alex, do we have the assets for the marketing campaign?',
            timestamp: 'Sunday 10:00 AM',
            status: 'read',
        },
        {
            id: 2,
            senderId: 'me',
            text: 'Not yet, I need one more day.',
            timestamp: 'Sunday 12:00 PM',
            status: 'read',
        },
        {
            id: 3,
            senderId: 7,
            text: 'Okay, no worries.',
            timestamp: 'Sunday 12:05 PM',
            status: 'read',
        },
        {
            id: 4,
            senderId: 7,
            text: 'Can we reschedule?',
            timestamp: 'Sunday 12:06 PM',
            status: 'read',
        }
    ],
    8: [ // Weekend Trip Group
        {
            id: 1,
            senderId: 8,
            text: 'Mark: I booked the campsite!',
            timestamp: 'Fri 5:00 PM',
            status: 'read',
        },
        {
            id: 2,
            senderId: 'me',
            text: 'Nice! I will bring the food.',
            timestamp: 'Fri 5:10 PM',
            status: 'read',
        },
        {
            id: 3,
            senderId: 8,
            text: 'Sarah: I have the cooler.',
            timestamp: 'Fri 5:15 PM',
            status: 'read',
        },
        {
            id: 4,
            senderId: 8,
            text: 'Mark: Who is bringing the tent?',
            timestamp: '3 days ago',
            status: 'delivered',
        }
    ],
    9: [ // Chat with Robert Fox
        {
            id: 1,
            senderId: 9,
            text: 'Check out this inspiration board.',
            timestamp: 'Last Week',
            status: 'read',
        },
        {
            id: 2,
            senderId: 9,
            text: 'Sent an image.',
            timestamp: 'Last Week',
            status: 'read',
        }
    ],
    10: [ // Support Bot
        {
            id: 1,
            senderId: 'me',
            text: 'I cannot reset my password.',
            timestamp: 'Last Month',
            status: 'read',
        },
        {
            id: 2,
            senderId: 10,
            text: 'Please check your spam folder for the reset link.',
            timestamp: 'Last Month',
            status: 'read',
        },
        {
            id: 3,
            senderId: 10,
            text: 'Ticket #402 has been resolved.',
            timestamp: 'Last Month',
            status: 'read',
        }
    ]
};


// ⏳ PENDING REQUESTS (People you added, waiting for them to accept)
export const pendingFriends = [101, 104];

// 🌍 GLOBAL USERS (Strangers you can add)
export const globalUsers = [
    {
        id: 101,
        name: 'Alice Wonder',
        avatar: 'https://i.pravatar.cc/150?u=alice_w',
        bio: 'UX Designer at TechCorp',
        sentTime: 'Just now',
        status: 'pending'
    },
    {
        id: 104,
        name: 'Diana Prince',
        avatar: 'https://i.pravatar.cc/150?u=diana_p',
        bio: 'Digital Artist 🎨',
        sentTime: '1 day ago',
        status: 'pending'
    },
    {
        id: 102,
        name: 'Bob Builder',
        avatar: 'https://i.pravatar.cc/150?u=bob_b',
        bio: 'Freelance Developer',
        mutualFriends: 0,
        isOnline: true,
    },
    {
        id: 103,
        name: 'Charlie Day',
        avatar: 'https://i.pravatar.cc/150?u=charlie_d',
        bio: 'Product Manager',
        mutualFriends: 12,
        isOnline: false,
    },
    {
        id: 105,
        name: 'Ethan Hunt',
        avatar: 'https://i.pravatar.cc/150?u=ethan_h',
        bio: 'Cybersecurity Enthusiast',
        mutualFriends: 1,
        isOnline: true,
    },
    {
        id: 106,
        name: 'Fiona Gallagher',
        avatar: 'https://i.pravatar.cc/150?u=fiona_g',
        bio: 'Marketing Specialist',
        mutualFriends: 0,
        isOnline: false,
    },
    {
        id: 107,
        name: 'George Martin',
        avatar: 'https://i.pravatar.cc/150?u=george_m',
        bio: 'Writer & Editor',
        mutualFriends: 8,
        isOnline: false,
    }
];