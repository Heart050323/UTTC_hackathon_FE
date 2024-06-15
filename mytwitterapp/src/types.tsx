export type UserInfo = {
    user_id: number;
    user_name: string;
    tweet_datas: TweetData[];
}

type TweetData = {
    tweet_id: number;
    content: string;
    replied_tweet_id: number;
    re_tweet_id: number;
    created_at: Date;
}

export type HomePageProps = {
    email: string | null;
}