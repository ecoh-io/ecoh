import { Media } from './Media';

/**
 * Enum representing the types of posts.
 */
export enum PostType {
  TEXT = 'text',
  MEDIA = 'media',
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
  id: string; // Unique ID for the post
  type: PostType; // Type of the post (image, text, video)
  user: User; // User who created the post
  timestamp: Date; // Date and time of the post
  likes: number; // Number of likes on the post
  echo: number; // Number of shares of the post
  comments: Comment[]; // List of comments on the post
  isLiked: boolean; // Whether the current user has liked the post
  isSaved: boolean; // Whether the post is saved by the current user
}

/**
 * Interface for an image post.
 */
export interface MediaPost extends BasePost {
  type: PostType.MEDIA; // Type set to 'image'
  media: Media[]; // List of images with their URIs
  content: string; // Caption for the post
}

/**
 * Interface for a text post.
 */
export interface TextPost extends BasePost {
  type: PostType.TEXT; // Type set to 'text'
  content: string; // Text content of the post (supports markdown)
}

/**
 * Union type representing all possible post data types.
 */
export type PostData = MediaPost | TextPost;
