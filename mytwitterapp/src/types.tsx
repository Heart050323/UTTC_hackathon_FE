export type UserInfo = {
    user_id: number;
    user_name: string;
}

export type TweetData = {
    user_id: number;
    user_name:string;
    tweet_id: number;
    content: string;
    replied_tweet_id: number;
    re_tweet_id: number;
    created_at: Date;
    likecount: number;
}

export type HomePageProps = {
    data: UserInfo | null;
}

export type PostPageProps = {
    data: UserInfo | null;
}

export type UserIDProps = {
    user_id: number | undefined;
}

export type TweetItemProps = {
    sender_user_id: number | undefined;
    tweet:TweetData
}
