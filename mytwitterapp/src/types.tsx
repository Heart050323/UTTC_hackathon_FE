export type UserInfo = {
    user_id: number;
    user_name: string;
}

// export type UserProfile = {
//     message: string;
//     icon_image: URL;
//     header_image: URL;
//     birth_day:
// }

export type TweetData = {
    user_id: number;
    user_name:string;
    tweet_id: number;
    content: string;
    replied_tweet_id: number;
    re_tweet_id: number;
    created_at: Date;
    likecount: number;
    badcount: number;
    replycount:number;
    re_tweetcount:number;
}

export type HomePageProps = {
    data: UserInfo | null;
}

export type PostPageProps = {
    data: UserInfo | null;
}

export type TweetPageProps = {
    data: UserInfo | null;
}

export type RePostPageProps = {
    data: UserInfo | null;
} 

export type ReplyPageProps = {
    data: UserInfo | null;
} 

export type ReTweetProps = {
    data: UserInfo | null;
    tweet: TweetData;
} 

export type ReplyTweetProps = {
    data: UserInfo | null;
    tweet: TweetData;
} 
export type UserIDProps = {
    user_id: number | undefined;
}

export type TweetItemProps = {
    sender_user_id: number | undefined;
    tweet:TweetData 
}
