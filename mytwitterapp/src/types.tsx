export type UserInfo = {
    user_id: number;
    user_name: string;
    tweet_datas: TweetData[];
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