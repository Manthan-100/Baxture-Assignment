import redis from "redis";

class dbConn {
	constructor() {
		this.redis;
	}

    connect = () => {
        this.redis = redis.createClient();

        return new Promise((resolve, reject) => {
            this.redis.on("error", (err) => reject(err));
            this.redis.on("connect", () => resolve(this.redis));
        });
    }

    set = ({ key, data }) => {
        return this.redis.set(key, JSON.stringify(data));
    }

    del = ({ key }) => {
        return redis.del(key);
    }
}

export default new dbConn();