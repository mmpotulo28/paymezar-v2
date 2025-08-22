const Scripts = () => {
	if (process.env.NODE_ENV !== "production") {
		// Don't load New Relic agent in development
		return null;
	}
	return <></>;
};

export default Scripts;
