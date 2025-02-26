/**
 * Enum representing the types of posts.
 */
export enum PostType {
  IMAGE = 'image',
  TEXT = 'text',
  VIDEO = 'video',
}

/**
 * Interface representing a user.
 */
export interface User {
  id: string;
  name: string;
  username: string;
  avatarUri: string; // URI for the user's avatar image
  isVerified: boolean; // Whether the user is verified
  isConnection: boolean;
  isFollowing: boolean;
}

/**
 * Interface representing a comment on a post.
 */
export interface Comment {
  id: string; // Unique ID for the comment
  user: User; // User who made the comment
  content: string; // Comment text
  timestamp: Date; // Date and time of the comment
}

/**
 * Base interface for all post types.
 * Contains common fields shared across all post types.
 */
export interface BasePost {
  id: number; // Unique ID for the post
  type: PostType; // Type of the post (image, text, video)
  user: User; // User who created the post
  timestamp: Date; // Date and time of the post
  likes: number; // Number of likes on the post
  shares: number; // Number of shares of the post
  comments: Comment[]; // List of comments on the post
  isLiked: boolean; // Whether the current user has liked the post
  isSaved: boolean; // Whether the post is saved by the current user
}

/**
 * Interface for media content (shared across different post types).
 */
export interface MediaContent {
  uri: string; // URI of the media (image or video)
  thumbnailUri?: string; // Optional thumbnail URI (for videos or other media types)
}

/**
 * Interface for an image post.
 */
export interface ImagePost extends BasePost {
  type: PostType.IMAGE; // Type set to 'image'
  images: MediaContent[]; // List of images with their URIs
}

/**
 * Interface for a text post.
 */
export interface TextPost extends BasePost {
  type: PostType.TEXT; // Type set to 'text'
  content: string; // Text content of the post (supports markdown)
}

/**
 * Interface for a video post.
 */
export interface VideoPost extends BasePost {
  type: PostType.VIDEO; // Type set to 'video'
  videoUri: string; // URI for the video
  thumbnailUri: string; // URI for the video's thumbnail
  duration: number; // Duration of the video in seconds
}

/**
 * Union type representing all possible post data types.
 */
export type PostData = ImagePost | TextPost | VideoPost;
