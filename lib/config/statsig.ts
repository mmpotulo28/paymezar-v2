import { StatsigSessionReplayPlugin } from "@statsig/session-replay";
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";

export const statsigConfig = {
	clientKey: process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || "",
	user: { userID: "a-user" },
	plugins: { plugins: [new StatsigAutoCapturePlugin(), new StatsigSessionReplayPlugin()] },
};
