import { MediaType } from '../enums/media-type.enum';
import { PostData, PostType, User, Comment } from '../types/post';

// Helper function for generating timestamps
const getTimeAgo = (hoursAgo: number): Date =>
  new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

// Helper function for creating comments
const createComment = (
  id: string,
  user: User,
  content: string,
  hoursAgo: number,
): Comment => ({
  id,
  user,
  content,
  timestamp: getTimeAgo(hoursAgo),
});

// Define reusable user objects
const users: Record<string, User> = {
  u1: {
    id: 'u1',
    name: 'Anthonymcm',
    username: 'anthonyamcm',
    avatarUri: 'https://dummyimage.com/600x400/000/fff&text=John',
    isVerified: true,
    isConnection: true,
    isFollowing: true,
  },
  u2: {
    id: 'u2',
    name: 'Jane Smith',
    username: 'janesmithalertygyehasgd',
    avatarUri: 'https://dummyimage.com/600x400/000/fff&text=Jane',
    isVerified: true,
    isConnection: false,
    isFollowing: true,
  },
  u3: {
    id: 'u3',
    name: 'Alice Johnson',
    username: 'alicej',
    avatarUri: 'https://dummyimage.com/600x400/000/fff&text=Alice',
    isVerified: false,
    isConnection: false,
    isFollowing: false,
  },
  u4: {
    id: 'u4',
    name: 'Bob Brown',
    username: 'bobbrown',
    avatarUri: 'https://dummyimage.com/600x400/000/fff&text=Bob',
    isVerified: false,
    isConnection: true,
    isFollowing: true,
  },
  u5: {
    id: 'u5',
    name: 'Charlie Davis',
    username: 'charlied',
    avatarUri: 'https://dummyimage.com/600x400/000/fff&text=Charlie',
    isVerified: false,
    isConnection: true,
    isFollowing: true,
  },
};

// Define reusable comment objects
const comments: Record<string, Comment> = {
  c1: createComment('c1', users.u2, 'Nice post!', 1.5), // 1.5 hours ago
  c2: createComment('c2', users.u4, 'Amazing photos!', 4), // 4 hours ago
  c3: createComment('c3', users.u5, 'Amazing shot!', 72), // 3 days ago
  c4: createComment('c4', users.u1, 'Great video!', 0.5), // 30 minutes ago
  c5: createComment('c5', users.u3, 'Loved this!', 2), // 2 hours ago
};

// Define post data
export const posts: PostData[] = [
  {
    id: '1',
    type: PostType.TEXT,
    user: users.u1,
    timestamp: getTimeAgo(5), // 5 hours ago
    likes: 4,
    echo: 300,
    comments: [comments.c2],
    isLiked: true,
    isSaved: true,
    content:
      'Here are some images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! #Travel @friend images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! #Travel @friend images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! #Travel @friend',
  },
  {
    id: '2',
    type: PostType.MEDIA,
    user: users.u5,
    timestamp: getTimeAgo(1), // 1 hour ago
    likes: 3200,
    echo: 450,
    comments: [comments.c4],
    isLiked: false,
    isSaved: false,
    media: [
      {
        url: 'https://dummyimage.com/600x400/000/fff&text=Image2',
        id: '1',
        type: MediaType.IMAGE,
        key: 'image1',
        uploadedBy: users.u5.id,
      },
      {
        url: 'https://dummyimage.com/600x400/000/fff&text=Image3',
        id: '2',
        type: MediaType.IMAGE,
        key: 'image2',
        uploadedBy: users.u5.id,
      },
      {
        url: 'https://www.w3schools.com/html/movie.mp4',
        id: '3',
        type: MediaType.VIDEO,
        key: 'video1',
        uploadedBy: users.u5.id,
      },
    ],
    content:
      'This is a **bold** statement and **bold** this is *italic*. ~~strike through~~ Check *italic* out **bold**  #ReactNative @user This is a **bold** statement and **bold** this is *italic*. ~~strike through~~ Check *italic* out',
  },
  {
    id: '3',
    type: PostType.TEXT,
    user: users.u2,
    timestamp: getTimeAgo(2), // 2 hours ago
    likes: 12078,
    echo: 1390,
    comments: [comments.c1],
    isLiked: true,
    isSaved: false,
    content:
      'This is a **bold** statement and **bold** this is *italic*. ~~strike through~~ Check *italic* out **bold**  #ReactNative @user This is a **bold** statement and **bold** this is *italic*. ~~strike through~~ Check *italic* out',
  },
  {
    id: '4',
    type: PostType.TEXT,
    user: users.u3,
    timestamp: getTimeAgo(120), // 5 days ago
    likes: 250,
    echo: 190,
    comments: [comments.c2, comments.c3],
    isLiked: true,
    isSaved: true,
    content:
      'Here are some images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! #Travel @friend',
  },
  {
    id: '5',
    type: PostType.TEXT,
    user: users.u4,
    timestamp: getTimeAgo(5), // 5 hours ago
    likes: 4500,
    echo: 300,
    comments: [comments.c2],
    isLiked: true,
    isSaved: true,
    content:
      'Here are some images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! Here are some images from my recent trip! #Travel @friend',
  },
  {
    id: '6',
    type: PostType.MEDIA,
    user: users.u5,
    timestamp: getTimeAgo(3), // 3 hours ago
    likes: 1500,
    echo: 200,
    comments: [comments.c5],
    isLiked: true,
    isSaved: false,
    media: [
      {
        url: 'https://www.w3schools.com/html/movie.mp4',
        id: '1',
        type: MediaType.VIDEO,
        key: 'video1',
        uploadedBy: users.u5.id,
      },
    ],
  },
];
